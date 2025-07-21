import { Suspense } from 'react'
import { StudentList } from '@/components/users/StudentList'
import { TutorList } from '@/components/users/TutorList'
import { getStudents, getTutors } from '@/lib/user-actions'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { GraduationCap, Users } from 'lucide-react'
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

interface UsersPageProps {
  searchParams: Promise<{
    search?: string
    tab?: 'students' | 'tutors'
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: string
    subject?: string
  }>
}

function UserListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-16 h-6" />
        </div>
        <Skeleton className="w-24 h-10" />
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="w-64 h-10" />

      {/* Search Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="w-80 h-10" />
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="w-32 h-6" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-48 h-4" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                  <Skeleton className="w-16 h-6" />
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-8 h-8" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function StudentsContent({ searchParams, userRole }: UsersPageProps & { userRole: string }) {
  const params = await searchParams;
  const search = params.search
  const sortBy = params.sortBy || 'first_name'
  const sortOrder = params.sortOrder || 'asc'
  const page = parseInt(params.page || '1')
  const subjectFilter = params.subject

  try {
    const result = await getStudents(search, sortBy, sortOrder, page, subjectFilter ? parseInt(subjectFilter) : undefined)

    return (
      <StudentList
        students={result.users}
        totalCount={result.totalCount}
        currentPage={result.page}
        totalPages={result.totalPages}
        searchQuery={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        subjectFilter={subjectFilter}
        userRole={userRole as 'admin' | 'tutor'}
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

async function TutorsContent({ searchParams, userRole }: UsersPageProps & { userRole: string }) {
  const params = await searchParams;
  const search = params.search
  const sortBy = params.sortBy || 'first_name'
  const sortOrder = params.sortOrder || 'asc'
  const page = parseInt(params.page || '1')
  const subjectFilter = params.subject

  try {
    const result = await getTutors(search, sortBy, sortOrder, page, subjectFilter ? parseInt(subjectFilter) : undefined)

    return (
      <TutorList
        tutors={result.users}
        totalCount={result.totalCount}
        currentPage={result.page}
        totalPages={result.totalPages}
        searchQuery={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        subjectFilter={subjectFilter}
        userRole={userRole as 'admin' | 'tutor'}
      />
    )
  } catch (error) {
    console.error('Error loading tutors:', error)
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Error Loading Tutors
          </h2>
          <p className="text-muted-foreground">
            There was an error loading the tutor list. Please try again.
          </p>
        </div>
      </div>
    )
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
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

  // Only allow admins and tutors to access user management
  if (userRole === 'student') {
    redirect('/dashboard')
  }

  const params = await searchParams;
  const activeTab = params.tab || 'students'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger value="tutors" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Tutors</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Suspense fallback={<UserListSkeleton />}>
            <StudentsContent searchParams={searchParams} userRole={userRole} />
          </Suspense>
        </TabsContent>

        <TabsContent value="tutors">
          <Suspense fallback={<UserListSkeleton />}>
            <TutorsContent searchParams={searchParams} userRole={userRole} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
} 