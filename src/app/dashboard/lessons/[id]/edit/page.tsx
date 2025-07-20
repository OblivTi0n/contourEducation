import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { 
  fetchLessonById, 
  updateLesson, 
  getAvailableTutors, 
  getEnrolledStudents 
} from '@/lib/lesson-actions'
import { LessonForm } from '@/components/lessons/LessonForm'

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

interface EditLessonPageProps {
  params: {
    id: string
  }
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const supabase = await createClient()
  
  // Check authentication and permissions
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    redirect('/login')
  }

  let userRole: string = 'student' // Default fallback

  // Decode JWT to extract user role
  if (session.access_token) {
    const decodedToken = decodeJWT(session.access_token)
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role
    }
  }

  // Only allow admins and tutors to edit lessons
  if (userRole !== 'admin' && userRole !== 'tutor') {
    redirect('/dashboard/lessons')
  }

  try {
    const lesson = await fetchLessonById(params.id)
    
    if (!lesson) {
      notFound()
    }

    // Tutors can only edit lessons they're assigned to
    if (userRole === 'tutor') {
      const isAssigned = lesson.tutors?.some(tutor => tutor.id === session.user.id)
      if (!isAssigned) {
        redirect('/dashboard/lessons')
      }
    }

    // Fetch required data for the form
    const [
      subjectsResult,
      campusesResult,
      roomsResult,
    ] = await Promise.all([
      supabase
        .from('subjects')
        .select('id, code, title')
        .order('code'),
      
      supabase
        .from('campuses')
        .select('id, name')
        .eq('status', 'active')
        .order('name'),
      
      supabase
        .from('rooms')
        .select('id, name, campus_id')
        .eq('status', 'active')
        .order('name'),
    ])

    if (subjectsResult.error) {
      console.error('Error fetching subjects:', subjectsResult.error)
      throw subjectsResult.error
    }

    if (campusesResult.error) {
      console.error('Error fetching campuses:', campusesResult.error)
      throw campusesResult.error
    }

    if (roomsResult.error) {
      console.error('Error fetching rooms:', roomsResult.error)
      throw roomsResult.error
    }

    const subjects = subjectsResult.data || []
    const campuses = campusesResult.data || []
    const rooms = roomsResult.data || []

    // Get available tutors and students for the current subject
    const [availableTutors, enrolledStudents] = await Promise.all([
      getAvailableTutors(lesson.subject_id),
      getEnrolledStudents(lesson.subject_id),
    ])

    const handleSubmit = async (data: any) => {
      'use server'
      try {
        await updateLesson(data)
      } catch (error) {
        console.error('Error updating lesson:', error)
        throw error
      }
    }

    return (
      <LessonForm
        lesson={lesson}
        mode="edit"
        subjects={subjects}
        campuses={campuses}
        rooms={rooms}
        availableTutors={availableTutors}
        enrolledStudents={enrolledStudents}
        onSubmit={handleSubmit}
      />
    )
  } catch (error) {
    console.error('Error loading edit lesson page:', error)
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load lesson edit form. Please try again.</p>
      </div>
    )
  }
} 