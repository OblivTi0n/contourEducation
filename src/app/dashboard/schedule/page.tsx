import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { fetchLessons } from '@/lib/lesson-actions'
import { ScheduleCalendar } from '@/components/dashboard/ScheduleCalendar'

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

export default async function SchedulePage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    redirect('/login')
  }

  let userRole: string = 'student' // Default fallback
  const userId = session.user.id

  // Decode JWT to extract user role
  if (session.access_token) {
    const decodedToken = decodeJWT(session.access_token)
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role
    }
  }

  try {
    // Fetch all lessons for the user (we'll filter by date in the component)
    const result = await fetchLessons(
      1, // page
      100, // limit - get more lessons for calendar view
      undefined, // search
      'start_time', // sortBy
      'asc', // sortOrder
      'scheduled', // status - only scheduled lessons
      undefined, // subject_id
      undefined, // campus_id
      userRole,
      userId
    )

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">Schedule</h1>
        </div>

        {/* Calendar */}
        <ScheduleCalendar 
          userRole={userRole as "student" | "tutor" | "admin"}
          lessons={result.data}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading schedule:', error)
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load schedule. Please try again.</p>
      </div>
    )
  }
} 