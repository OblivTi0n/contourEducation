import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createLesson, getAvailableTutors, getEnrolledStudents, CreateLessonData, UpdateLessonData } from '@/lib/lesson-actions'
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

export default async function CreateLessonPage() {
  const supabase = await createClient()
  
  // Check authentication and permissions (secure method)
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

  // Only allow admins and tutors to create lessons
  if (userRole !== 'admin' && userRole !== 'tutor') {
    redirect('/dashboard/lessons')
  }

  try {
    // Fetch subjects based on user role
    let subjectsResult
    if (userRole === 'tutor') {
      // For tutors, only fetch subjects they are assigned to
      const { data: tutorSubjects, error: tutorSubjectsError } = await supabase
        .from('tutor_subjects')
        .select(`
          subject:subjects(id, code, title)
        `)
        .eq('tutor_id', user.id)
      
      if (tutorSubjectsError) {
        console.error('Error fetching tutor subjects:', tutorSubjectsError)
        throw tutorSubjectsError
      }
      
      // Extract subjects from the tutor_subjects relation and ensure proper typing
      const subjects = tutorSubjects
        ?.map((ts: unknown) => (ts as { subject: { id: string; code: string; title: string } }).subject)
        .filter((subject: unknown) => {
          const s = subject as { id: string; code: string; title: string } | null;
          return s && s.id && s.code && s.title;
        })
        .sort((a: unknown, b: unknown) => {
          const subjectA = a as { code: string };
          const subjectB = b as { code: string };
          return subjectA.code.localeCompare(subjectB.code);
        }) || []
      
      subjectsResult = { data: subjects, error: null }
    } else {
      // For admins, fetch all subjects
      subjectsResult = await supabase
        .from('subjects')
        .select('id, code, title')
        .order('code')
    }

    // Fetch campuses and rooms
    const [
      campusesResult,
      roomsResult,
    ] = await Promise.all([
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

    // Get subject-specific tutors and students (initially empty, will be filtered in form)
    const [availableTutors, enrolledStudents] = await Promise.all([
      getAvailableTutors(), // Pass no subject ID to get all tutors initially
      getEnrolledStudents(), // Pass no subject ID to get all students initially
    ])

    const handleSubmit = async (data: CreateLessonData | UpdateLessonData) => {
      'use server'
      try {
        await createLesson(data as CreateLessonData)
      } catch (error) {
        console.error('Error creating lesson:', error)
        throw error
      }
    }

    return (
      <LessonForm
        mode="create"
        subjects={subjects}
        campuses={campuses}
        rooms={rooms}
        availableTutors={availableTutors}
        enrolledStudents={enrolledStudents}
        onSubmit={handleSubmit}
      />
    )
  } catch (error) {
    console.error('Error loading create lesson page:', error)
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load lesson creation form. Please try again.</p>
      </div>
    )
  }
} 