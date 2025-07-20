'use server'

import { createClient } from '@/lib/supabase-server'

export interface DashboardStats {
  totalStudents: number
  totalTutors: number
  totalSubjects: number
  totalLessons: number
}

export interface SubjectWithStats {
  id: string
  code: string
  title: string
  studentCount: number
  tutorCount: number
  lessonCount: number
}

export interface EnrollmentTrend {
  month: string
  students: number
  percentage: number
}

// Get overall dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  try {
    // Get counts for each entity type
    const [studentsResult, tutorsResult, subjectsResult, lessonsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student'),
      
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'tutor'),
      
      supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true }),
      
      supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
    ])

    return {
      totalStudents: studentsResult.count || 0,
      totalTutors: tutorsResult.count || 0,
      totalSubjects: subjectsResult.count || 0,
      totalLessons: lessonsResult.count || 0
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalStudents: 0,
      totalTutors: 0,
      totalSubjects: 0,
      totalLessons: 0
    }
  }
}

// Get subjects with enrollment and lesson statistics
export async function getSubjectsWithStats(): Promise<SubjectWithStats[]> {
  const supabase = await createClient()

  try {
    // First get all subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('id, code, title')
      .order('code')

    if (subjectsError) {
      console.error('Error fetching subjects:', subjectsError)
      return []
    }

    if (!subjects || subjects.length === 0) {
      return []
    }

    // Get statistics for each subject
    const subjectsWithStats = await Promise.all(
      subjects.map(async (subject) => {
        // Get student count via enrolments table if it exists, otherwise count lesson students
        let studentCount = 0
        try {
          const { count: enrolmentCount } = await supabase
            .from('enrolments')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', subject.id)
            .eq('status', 'active')
          
          studentCount = enrolmentCount || 0
        } catch {
          // Fallback to counting unique students in lessons
          const { data: lessonStudents } = await supabase
            .from('lesson_students')
            .select('student_id, lessons!inner(subject_id)')
            .eq('lessons.subject_id', subject.id)
          
          const uniqueStudents = new Set(lessonStudents?.map(ls => ls.student_id) || [])
          studentCount = uniqueStudents.size
        }

        // Get tutor count
        const { count: tutorCount } = await supabase
          .from('tutor_subjects')
          .select('*', { count: 'exact', head: true })
          .eq('subject_id', subject.id)

        // Get lesson count
        const { count: lessonCount } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('subject_id', subject.id)

        return {
          id: subject.id,
          code: subject.code,
          title: subject.title,
          studentCount: studentCount,
          tutorCount: tutorCount || 0,
          lessonCount: lessonCount || 0
        }
      })
    )

    return subjectsWithStats
  } catch (error) {
    console.error('Error fetching subjects with stats:', error)
    return []
  }
}

// Get enrollment trends based on user creation dates from auth.users
export async function getEnrollmentTrends(): Promise<EnrollmentTrend[]> {
  const supabase = await createClient()

  try {
    // Get student creation dates
    const { data: students, error } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('role', 'student')
      .order('created_at', { ascending: true })

    if (error || !students) {
      console.error('Error fetching enrollment trends:', error)
      return []
    }

    // Get current total for percentage calculation
    const totalStudents = students.length

    if (totalStudents === 0) {
      return []
    }

    // Group by month and calculate cumulative counts
    const monthlyData: { [key: string]: number } = {}
    const now = new Date()
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December']

    // Initialize last 4 months
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = months[date.getMonth()]
      monthlyData[monthName] = 0
    }

    // Count students created up to each month
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i + 1, 0) // Last day of month
      const monthName = months[date.getMonth()]
      
      const studentsUpToMonth = students.filter(student => 
        new Date(student.created_at) <= date
      ).length

      monthlyData[monthName] = studentsUpToMonth
    }

    // Convert to array with percentages
    const trends: EnrollmentTrend[] = Object.entries(monthlyData).map(([month, count]) => ({
      month,
      students: count,
      percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
    }))

    return trends
  } catch (error) {
    console.error('Error calculating enrollment trends:', error)
    return []
  }
} 