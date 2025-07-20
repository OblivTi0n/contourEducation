import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { TutorDashboard } from '@/components/dashboard/TutorDashboard'

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

export default async function TutorDashboardPage() {
  const supabase = await createClient()
  
  // Get the current session
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    redirect('/login')
  }

  const user = session.user
  let userRole: string | null = null

  // Decode JWT to extract user role
  if (session.access_token) {
    const decodedToken = decodeJWT(session.access_token)
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role
      
      // Auth guard: Only allow tutor users
      if (decodedToken.user_role !== 'tutor') {
        // Redirect to appropriate dashboard based on role
        if (decodedToken.user_role === 'admin') {
          redirect('/admindashboard')
        } else {
          redirect('/studentdashboard')
        }
      }
    } else {
      // No role found, redirect to default dashboard
      redirect('/studentdashboard')
    }
  }

  return <TutorDashboard />
} 