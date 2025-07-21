import { notFound } from 'next/navigation'
import { UserForm } from '@/components/users/UserForm'
import { getUserById } from '@/lib/user-actions'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

// Helper function to decode JWT and extract claims
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const supabase = await createClient()
  
  // Check authentication and permissions
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    redirect('/login')
  }

  let userRole: string = 'student' // Default fallback
  let currentUserId = session.user.id

  // Decode JWT to extract user role
  if (session.access_token) {
    const decodedToken = decodeJWT(session.access_token)
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role
    }
  }

  // Authorization check: 
  // - Admins can edit all users
  // - Tutors and students can only edit their own profile
  if (userRole !== 'admin' && currentUserId !== params.id) {
    redirect('/dashboard')
  }

  try {
    const user = await getUserById(params.id)
    
    return <UserForm 
      user={user} 
      mode="edit" 
      currentUserRole={userRole}
      currentUserId={currentUserId}
    />
  } catch (error) {
    console.error('Error loading user:', error)
    notFound()
  }
} 