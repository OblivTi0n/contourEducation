'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type UserRole = 'student' | 'tutor' | 'admin'

export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  role: UserRole
  contact_email: string | null
  phone_number: string | null
  avatar_url: string | null
  school_name: string | null
  vce_year_level: number | null
  parent_guardian_name: string | null
  parent_guardian_email: string | null
  parent_guardian_phone: string | null
  job_title: string | null
  bio: string | null
  qualifications: any | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
}

export interface CreateUserData {
  email: string
  password: string
  first_name: string
  last_name: string
  role: UserRole
  contact_email?: string
  phone_number?: string
  school_name?: string
  vce_year_level?: number
  parent_guardian_name?: string
  parent_guardian_email?: string
  parent_guardian_phone?: string
  job_title?: string
  bio?: string
  qualifications?: any
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

export interface UpdateUserData {
  first_name?: string
  last_name?: string
  role?: UserRole
  contact_email?: string
  phone_number?: string
  school_name?: string
  vce_year_level?: number
  parent_guardian_name?: string
  parent_guardian_email?: string
  parent_guardian_phone?: string
  job_title?: string
  bio?: string
  qualifications?: any
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

export async function getUsers(
  search?: string,
  role?: UserRole,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  page: number = 1,
  pageSize: number = 10
) {
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*')

  // Apply search filter
  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,contact_email.ilike.%${search}%`)
  }

  // Apply role filter
  if (role) {
    query = query.eq('role', role)
  }

  // Apply sorting
  if (sortBy) {
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  } else {
    query = query.order('first_name', { ascending: true })
  }

  // Apply pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }

  // Get total count for pagination
  let countQuery = supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Apply same filters for count
  if (search) {
    countQuery = countQuery.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,contact_email.ilike.%${search}%`)
  }
  if (role) {
    countQuery = countQuery.eq('role', role)
  }

  const { count: totalCount } = await countQuery

  return {
    users: data as UserProfile[],
    totalCount: totalCount || 0,
    page,
    pageSize,
    totalPages: Math.ceil((totalCount || 0) / pageSize)
  }
}

export async function getStudents(
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  page: number = 1,
  pageSize: number = 10
) {
  return getUsers(search, 'student', sortBy, sortOrder, page, pageSize)
}

export async function getTutors(
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  page: number = 1,
  pageSize: number = 10
) {
  return getUsers(search, 'tutor', sortBy, sortOrder, page, pageSize)
}

export async function getAdmins(
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  page: number = 1,
  pageSize: number = 10
) {
  return getUsers(search, 'admin', sortBy, sortOrder, page, pageSize)
}

export async function getUserById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    throw new Error('Failed to fetch user')
  }

  return data as UserProfile
}

export async function createUser(userData: CreateUserData) {
  const supabase = await createClient()

  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      role: userData.role
    }
  })

  if (authError) {
    console.error('Error creating auth user:', authError)
    throw new Error('Failed to create user account')
  }

  if (!authData.user) {
    throw new Error('Failed to create user account')
  }

  // Create the profile record
  const profileData = {
    id: authData.user.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    role: userData.role,
    contact_email: userData.contact_email || userData.email,
    phone_number: userData.phone_number,
    school_name: userData.school_name,
    vce_year_level: userData.vce_year_level,
    parent_guardian_name: userData.parent_guardian_name,
    parent_guardian_email: userData.parent_guardian_email,
    parent_guardian_phone: userData.parent_guardian_phone,
    job_title: userData.job_title,
    bio: userData.bio,
    qualifications: userData.qualifications,
    emergency_contact_name: userData.emergency_contact_name,
    emergency_contact_phone: userData.emergency_contact_phone
  }

  const { data: profileResult, error: profileError } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single()

  if (profileError) {
    console.error('Error creating profile:', profileError)
    // Clean up the auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw new Error('Failed to create user profile')
  }

  revalidatePath('/dashboard/Users')
  return profileResult as UserProfile
}

export async function updateUser(id: string, userData: UpdateUserData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update(userData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    throw new Error('Failed to update user')
  }

  revalidatePath('/dashboard/Users')
  revalidatePath(`/dashboard/Users/${id}`)
  return data as UserProfile
}

export async function deleteUser(id: string) {
  const supabase = await createClient()

  // Delete the profile first
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (profileError) {
    console.error('Error deleting profile:', profileError)
    throw new Error('Failed to delete user profile')
  }

  // Then delete the auth user
  const { error: authError } = await supabase.auth.admin.deleteUser(id)

  if (authError) {
    console.error('Error deleting auth user:', authError)
    // Profile is already deleted, but log the auth deletion failure
    console.warn('Auth user deletion failed, but profile was deleted')
  }

  revalidatePath('/dashboard/Users')
} 