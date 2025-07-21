import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { fetchLessons, deleteLesson } from '@/lib/lesson-actions'
import { LessonList } from '@/components/lessons/LessonList'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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

interface LessonsPageProps {
  searchParams: Promise<{
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: string
    status?: string
    subject_id?: string
    campus_id?: string
  }>
}

// Loading skeleton component
const LessonListSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="space-y-4 pt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
)

async function LessonsPageContent({ searchParams }: LessonsPageProps) {
  const supabase = await createClient()
  
  // Get the current user and user role (secure method)
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  let userRole: string = 'student' // Default fallback
  const userId = user.id

  // Get session only to extract user role from access token
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    const decodedToken = decodeJWT(session.access_token)
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role
    }
  }

  // Await searchParams to fix Next.js error
  const params = await searchParams
  
  const page = parseInt(params.page || "1")
  const search = params.search
  const sortBy = params.sortBy || "start_time"
  const sortOrder = params.sortOrder || "asc"
  const status = params.status
  const subjectId = params.subject_id
  const campusId = params.campus_id

  try {
    const result = await fetchLessons(
      page,
      10,
      search,
      sortBy,
      sortOrder,
      status,
      subjectId,
      campusId,
      userRole,
      userId
    )

    const handleDeleteLesson = async (lessonId: string) => {
      'use server'
      try {
        await deleteLesson(lessonId)
      } catch (error) {
        console.error('Error deleting lesson:', error)
        throw error
      }
    }

    return (
      <LessonList
        lessons={result.data}
        totalCount={result.count}
        currentPage={result.page}
        totalPages={result.totalPages}
        searchQuery={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        userRole={userRole}
        onDeleteLesson={userRole === 'admin' ? handleDeleteLesson : undefined}
      />
    )
  } catch (error) {
    console.error("Error loading lessons:", error)
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load lessons. Please try again.</p>
      </div>
    )
  }
}

export default function LessonsPage({ searchParams }: LessonsPageProps) {
  return (
    <Suspense fallback={<LessonListSkeleton />}>
      <LessonsPageContent searchParams={searchParams} />
    </Suspense>
  )
} 