'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export interface Campus {
  id: string
  name: string
  address: string | null
  google_maps_link: string | null
  status: string
  created_at: string
}

export interface CreateCampusData {
  name: string
  address?: string
  google_maps_link?: string
  status?: string
}

export interface UpdateCampusData {
  name?: string
  address?: string
  google_maps_link?: string
  status?: string
}

export async function getCampuses(
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  page: number = 1,
  pageSize: number = 10
) {
  const supabase = await createClient()

  let query = supabase
    .from('campuses')
    .select('*')

  // Apply search filter
  if (search) {
    query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`)
  }

  // Apply sorting
  if (sortBy) {
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  } else {
    query = query.order('name', { ascending: true })
  }

  // Apply pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching campuses:', error)
    throw new Error('Failed to fetch campuses')
  }

  // Get total count for pagination
  let countQuery = supabase
    .from('campuses')
    .select('*', { count: 'exact', head: true })

  // Apply same filters for count
  if (search) {
    countQuery = countQuery.or(`name.ilike.%${search}%,address.ilike.%${search}%`)
  }

  const { count: totalCount } = await countQuery

  return {
    campuses: data as Campus[],
    totalCount: totalCount || 0,
    page,
    pageSize,
    totalPages: Math.ceil((totalCount || 0) / pageSize)
  }
}

export async function getCampusById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('campuses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching campus:', error)
    throw new Error('Failed to fetch campus')
  }

  return data as Campus
}

export async function createCampus(campusData: CreateCampusData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('campuses')
    .insert({
      name: campusData.name,
      address: campusData.address || null,
      google_maps_link: campusData.google_maps_link || null,
      status: campusData.status || 'active'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating campus:', error)
    throw new Error('Failed to create campus')
  }

  revalidatePath('/dashboard/campuses')
  return data as Campus
}

export async function updateCampus(id: string, campusData: UpdateCampusData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('campuses')
    .update(campusData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating campus:', error)
    throw new Error('Failed to update campus')
  }

  revalidatePath('/dashboard/campuses')
  revalidatePath(`/dashboard/campuses/${id}`)
  return data as Campus
}

export async function deleteCampus(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('campuses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting campus:', error)
    throw new Error('Failed to delete campus')
  }

  revalidatePath('/dashboard/campuses')
} 