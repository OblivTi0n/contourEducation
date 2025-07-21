import { Suspense } from 'react'
import { StudentList } from '@/components/users/StudentList'
import { getStudents } from '@/lib/user-actions'
import { Skeleton } from '@/components/ui/skeleton'
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

interface StudentsPageProps {
  searchParams: Promise<{
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: string
  }>
}

function StudentListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-muted rounded animate-pulse" />
          <div className="w-20 h-8 bg-muted rounded animate-pulse" />
          <div className="w-16 h-6 bg-muted rounded animate-pulse" />
        </div>
        <div className="w-24 h-10 bg-muted rounded animate-pulse" />
      </div>

      {/* Search Skeleton */}
      <div className="w-80 h-10 bg-muted rounded animate-pulse" />

      {/* Table Skeleton */}
      <div className="space-y-4">
        <div className="w-32 h-6 bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-48 h-4 bg-muted rounded animate-pulse" />
                <div className="w-32 h-3 bg-muted rounded animate-pulse" />
              </div>
              <div className="w-16 h-6 bg-muted rounded animate-pulse" />
              <div className="w-32 h-4 bg-muted rounded animate-pulse" />
              <div className="w-24 h-4 bg-muted rounded animate-pulse" />
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function StudentsContent({ searchParams }: StudentsPageProps) {
  const params = await searchParams;
  const search = params.search
  const sortBy = params.sortBy || 'first_name'
  const sortOrder = params.sortOrder || 'asc'
  const page = parseInt(params.page || '1')

  try {
    const result = await getStudents(search, sortBy, sortOrder, page)

    return (
      <StudentList
        students={result.users}
        totalCount={result.totalCount}
        currentPage={result.page}
        totalPages={result.totalPages}
        searchQuery={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        userRole="admin"
      />
    )
  } catch (error) {
    console.error('Error loading students:', error)
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Error Loading Students
          </h2>
          <p className="text-muted-foreground">
            There was an error loading the student list. Please try again.
          </p>
        </div>
      </div>
    )
  }
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
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

  // Only allow admins and tutors to access student management
  if (userRole === 'student') {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<StudentListSkeleton />}>
      <StudentsContent searchParams={searchParams} />
    </Suspense>
  )
} 