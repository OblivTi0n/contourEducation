import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'
import { TutorDashboard } from '@/components/dashboard/TutorDashboard'
import { StudentDashboard } from '@/components/dashboard/StudentDashboard'

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

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get the current user (secure method)
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  let userRole: string = 'student' // Default fallback

  // Get session only to extract user role from access token
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    const decodedToken = decodeJWT(session.access_token)
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role
    }
  }

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />
    case 'tutor':
      return <TutorDashboard />
    case 'student':
    default:
      return <StudentDashboard />
  }
} 