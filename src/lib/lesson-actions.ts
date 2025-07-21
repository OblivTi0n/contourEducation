import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export interface Lesson {
  id: string
  subject_id: string
  title: string
  start_time: string
  end_time: string
  location?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_by?: string
  created_at: string
  updated_at: string
  campus_id?: string
  room_id?: string
  location_detail?: string
  // Relations
  subject?: {
    id: string
    code: string
    title: string
  }
  campus?: {
    id: string
    name: string
    address?: string
  }
  room?: {
    id: string
    name: string
    capacity?: number
  }
  creator?: {
    id: string
    first_name?: string
    last_name?: string
  }
  tutors?: Array<{
    id: string
    first_name?: string
    last_name?: string
    role: string
  }>
  students?: Array<{
    id: string
    first_name?: string
    last_name?: string
    role: string
  }>
}

export interface CreateLessonData {
  subject_id: string
  title: string
  start_time: string
  end_time: string
  location?: string
  campus_id?: string
  room_id?: string
  location_detail?: string
  tutor_ids?: string[]
  student_ids?: string[]
}

export interface UpdateLessonData extends Partial<CreateLessonData> {
  id: string
  status?: 'scheduled' | 'completed' | 'cancelled'
}

// Fetch lessons with optional filtering
export async function fetchLessons(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortBy: string = 'start_time',
  sortOrder: 'asc' | 'desc' = 'asc',
  status?: string,
  subject_id?: string,
  campus_id?: string,
  user_role?: string,
  user_id?: string
) {
  const supabase = await createClient()
  
  const offset = (page - 1) * limit
  
  // First, get lessons with basic relations (no junction table joins to avoid RLS issues)
  let query = supabase
    .from('lessons')
    .select(`
      *,
      subject:subjects(id, code, title),
      campus:campuses(id, name, address),
      room:rooms(id, name, capacity),
      creator:profiles!lessons_created_by_fkey(id, first_name, last_name)
    `)
  
  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%`)
  }
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (subject_id) {
    query = query.eq('subject_id', subject_id)
  }
  
  if (campus_id) {
    query = query.eq('campus_id', campus_id)
  }
  
  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  
  // Get paginated data first
  const { data: lessonsData, error } = await query
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('Error fetching lessons:', error)
    throw error
  }

  if (!lessonsData || lessonsData.length === 0) {
    return {
      data: [],
      count: 0,
      totalPages: 0,
      page,
      limit
    }
  }

  // Get lesson IDs for filtering junction tables
  const lessonIds = lessonsData.map(lesson => lesson.id)

  // Get tutors and students separately to avoid RLS circular references
  let tutorsData: Array<{ lesson_id: string; tutor_id: string; profile?: { id: string; first_name: string; last_name: string } }> = []
  let studentsData: Array<{ lesson_id: string; student_id: string; profile?: { id: string; first_name: string; last_name: string } }> = []

  try {
    // Fetch tutors for these lessons
    const { data: tutors } = await supabase
      .from('lesson_tutors')
      .select(`
        lesson_id,
        tutor:profiles(id, first_name, last_name, role)
      `)
      .in('lesson_id', lessonIds)

    tutorsData = tutors || []

    // Fetch students for these lessons  
    const { data: students } = await supabase
      .from('lesson_students')
      .select(`
        lesson_id,
        student:profiles(id, first_name, last_name, role)
      `)
      .in('lesson_id', lessonIds)

    studentsData = students || []
  } catch (junctionError) {
    console.warn('Error fetching junction data:', junctionError)
    // Continue without junction data if there are RLS issues
  }

  // Apply role-based filtering in application layer
  let filteredLessons = lessonsData
  
  if (user_role === 'student' && user_id) {
    // Filter to only lessons where user is a student
    const studentLessonIds = studentsData
      .filter(s => s.student?.id === user_id)
      .map(s => s.lesson_id)
    filteredLessons = lessonsData.filter(lesson => studentLessonIds.includes(lesson.id))
  } else if (user_role === 'tutor' && user_id) {
    // Filter to only lessons where user is a tutor
    const tutorLessonIds = tutorsData
      .filter(t => t.tutor?.id === user_id)
      .map(t => t.lesson_id)
    filteredLessons = lessonsData.filter(lesson => tutorLessonIds.includes(lesson.id))
  }
  // Admins see all lessons (no filtering)

  // Transform the data to include tutors and students
  const lessons: Lesson[] = filteredLessons.map((lesson: Record<string, unknown>) => ({
    ...lesson,
    tutors: tutorsData
      .filter(t => t.lesson_id === lesson.id)
      .map(t => t.tutor)
      .filter(tutor => tutor), // Remove nulls
    students: studentsData
      .filter(s => s.lesson_id === lesson.id)
      .map(s => s.student)
      .filter(student => student) // Remove nulls
  }))

  // Get total count for pagination
  const { count } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
  
  return {
    data: lessons,
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    page,
    limit
  }
}

// Fetch single lesson by ID
export async function fetchLessonById(id: string): Promise<Lesson | null> {
  const supabase = await createClient()
  
  // Fetch lesson with basic relations first
  const { data: lessonData, error } = await supabase
    .from('lessons')
    .select(`
      *,
      subject:subjects(id, code, title),
      campus:campuses(id, name, address),
      room:rooms(id, name, capacity),
      creator:profiles!lessons_created_by_fkey(id, first_name, last_name)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching lesson:', error)
    return null
  }

  // Fetch tutors and students separately to avoid RLS issues
  let tutors: Array<{ id: string; first_name: string; last_name: string }> = []
  let students: Array<{ id: string; first_name: string; last_name: string }> = []

  try {
    // Fetch tutors for this lesson
    const { data: tutorsData } = await supabase
      .from('lesson_tutors')
      .select(`
        tutor:profiles(id, first_name, last_name, role)
      `)
      .eq('lesson_id', id)

    tutors = tutorsData?.map(t => t.tutor).filter(tutor => tutor) || []

    // Fetch students for this lesson
    const { data: studentsData } = await supabase
      .from('lesson_students')
      .select(`
        student:profiles(id, first_name, last_name, role)
      `)
      .eq('lesson_id', id)

    students = studentsData?.map(s => s.student).filter(student => student) || []
  } catch (junctionError) {
    console.warn('Error fetching junction data for lesson:', junctionError)
    // Continue without junction data if there are RLS issues
  }
  
  // Transform the data to include tutors and students
  const lesson: Lesson = {
    ...lessonData,
    tutors,
    students
  }
  
  return lesson
}

// Create new lesson
export async function createLesson(lessonData: CreateLessonData): Promise<Lesson> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Create lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .insert({
      subject_id: lessonData.subject_id,
      title: lessonData.title,
      start_time: lessonData.start_time,
      end_time: lessonData.end_time,
      location: lessonData.location,
      campus_id: lessonData.campus_id,
      room_id: lessonData.room_id,
      location_detail: lessonData.location_detail,
      created_by: user.id
    })
    .select()
    .single()
  
  if (lessonError) {
    console.error('Error creating lesson:', lessonError)
    throw lessonError
  }
  
  // Add tutors
  if (lessonData.tutor_ids?.length) {
    const tutorAssignments = lessonData.tutor_ids.map(tutor_id => ({
      lesson_id: lesson.id,
      tutor_id
    }))
    
    const { error: tutorError } = await supabase
      .from('lesson_tutors')
      .insert(tutorAssignments)
    
    if (tutorError) {
      console.error('Error assigning tutors:', tutorError)
      throw tutorError
    }
  }
  
  // Add students
  if (lessonData.student_ids?.length) {
    const studentAssignments = lessonData.student_ids.map(student_id => ({
      lesson_id: lesson.id,
      student_id
    }))
    
    const { error: studentError } = await supabase
      .from('lesson_students')
      .insert(studentAssignments)
    
    if (studentError) {
      console.error('Error assigning students:', studentError)
      throw studentError
    }
  }
  
  revalidatePath('/dashboard/lessons')
  
  // Return the created lesson with relations
  const createdLesson = await fetchLessonById(lesson.id)
  if (!createdLesson) throw new Error('Failed to fetch created lesson')
  
  return createdLesson
}

// Update lesson
export async function updateLesson(lessonData: UpdateLessonData): Promise<Lesson> {
  const supabase = await createClient()
  
  // Update lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .update({
      subject_id: lessonData.subject_id,
      title: lessonData.title,
      start_time: lessonData.start_time,
      end_time: lessonData.end_time,
      location: lessonData.location,
      status: lessonData.status,
      campus_id: lessonData.campus_id,
      room_id: lessonData.room_id,
      location_detail: lessonData.location_detail,
      updated_at: new Date().toISOString()
    })
    .eq('id', lessonData.id)
    .select()
    .single()
  
  if (lessonError) {
    console.error('Error updating lesson:', lessonError)
    throw lessonError
  }
  
  // Update tutors if provided
  if (lessonData.tutor_ids !== undefined) {
    // Remove existing tutors
    await supabase
      .from('lesson_tutors')
      .delete()
      .eq('lesson_id', lessonData.id)
    
    // Add new tutors
    if (lessonData.tutor_ids.length > 0) {
      const tutorAssignments = lessonData.tutor_ids.map(tutor_id => ({
        lesson_id: lessonData.id,
        tutor_id
      }))
      
      const { error: tutorError } = await supabase
        .from('lesson_tutors')
        .insert(tutorAssignments)
      
      if (tutorError) {
        console.error('Error updating tutors:', tutorError)
        throw tutorError
      }
    }
  }
  
  // Update students if provided
  if (lessonData.student_ids !== undefined) {
    // Remove existing students
    await supabase
      .from('lesson_students')
      .delete()
      .eq('lesson_id', lessonData.id)
    
    // Add new students
    if (lessonData.student_ids.length > 0) {
      const studentAssignments = lessonData.student_ids.map(student_id => ({
        lesson_id: lessonData.id,
        student_id
      }))
      
      const { error: studentError } = await supabase
        .from('lesson_students')
        .insert(studentAssignments)
      
      if (studentError) {
        console.error('Error updating students:', studentError)
        throw studentError
      }
    }
  }
  
  revalidatePath('/dashboard/lessons')
  revalidatePath(`/dashboard/lessons/${lessonData.id}`)
  
  // Return the updated lesson with relations
  const updatedLesson = await fetchLessonById(lessonData.id)
  if (!updatedLesson) throw new Error('Failed to fetch updated lesson')
  
  return updatedLesson
}

// Delete lesson
export async function deleteLesson(id: string): Promise<void> {
  const supabase = await createClient()
  
  // Delete related records first
  await supabase.from('lesson_tutors').delete().eq('lesson_id', id)
  await supabase.from('lesson_students').delete().eq('lesson_id', id)
  
  // Delete lesson
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting lesson:', error)
    throw error
  }
  
  revalidatePath('/dashboard/lessons')
}

// Get available tutors for subject
export async function getAvailableTutors(subjectId?: string) {
  const supabase = await createClient()
  
  if (subjectId) {
    // Get tutors assigned to this subject
    const { data: tutorSubjects } = await supabase
      .from('tutor_subjects')
      .select('tutor_id')
      .eq('subject_id', subjectId)
    
    const tutorIds = tutorSubjects?.map(ts => ts.tutor_id) || []
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('role', 'tutor')
      .in('id', tutorIds)
      .order('first_name')
    
    if (error) {
      console.error('Error fetching tutors:', error)
      throw error
    }
    
    return data || []
  } else {
    // Get all tutors
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('role', 'tutor')
      .order('first_name')
    
    if (error) {
      console.error('Error fetching tutors:', error)
      throw error
    }
    
    return data || []
  }
}

// Get enrolled students for subject
export async function getEnrolledStudents(subjectId?: string) {
  const supabase = await createClient()
  
  if (subjectId) {
    // Get students enrolled in this subject
    const { data: enrolments } = await supabase
      .from('enrolments')
      .select('student_id')
      .eq('subject_id', subjectId)
      .eq('status', 'active')
    
    const studentIds = enrolments?.map(e => e.student_id) || []
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('role', 'student')
      .in('id', studentIds)
      .order('first_name')
    
    if (error) {
      console.error('Error fetching students:', error)
      throw error
    }
    
    return data || []
  } else {
    // Get all students
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('role', 'student')
      .order('first_name')
    
    if (error) {
      console.error('Error fetching students:', error)
      throw error
    }
    
    return data || []
  }
} 