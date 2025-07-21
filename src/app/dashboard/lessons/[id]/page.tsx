import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { fetchLessonById } from '@/lib/lesson-actions'
import { LessonDetail } from '@/components/lessons/LessonDetail'

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

interface LessonDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const supabase = await createClient()
  
  // Check authentication (secure method)
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

  try {
    const { id } = await params
    const lesson = await fetchLessonById(id)
    
    if (!lesson) {
      notFound()
    }

    // Check if user has access to this lesson
    if (userRole === 'student') {
      // Students can only view lessons they're enrolled in
      const isEnrolled = lesson.students?.some(student => student.id === user.id)
      if (!isEnrolled) {
        redirect('/dashboard/lessons')
      }
    } else if (userRole === 'tutor') {
      // Tutors can only view lessons they're assigned to
      const isAssigned = lesson.tutors?.some(tutor => tutor.id === user.id)
      if (!isAssigned) {
        redirect('/dashboard/lessons')
      }
    }
    // Admins can view all lessons

    return <LessonDetail lesson={lesson} userRole={userRole} />
  } catch (error) {
    console.error('Error loading lesson:', error)
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load lesson details. Please try again.</p>
      </div>
    )
  }
} 