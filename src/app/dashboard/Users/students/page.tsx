import { Suspense } from 'react'
import { StudentList } from '@/components/users/StudentList'
import { getStudents } from '@/lib/user-actions'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Skeleton } from '@/components/ui/skeleton'

interface StudentsPageProps {
  searchParams: {
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: string
  }
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
  const search = searchParams.search
  const sortBy = searchParams.sortBy || 'first_name'
  const sortOrder = searchParams.sortOrder || 'asc'
  const page = parseInt(searchParams.page || '1')

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

export default function StudentsPage({ searchParams }: StudentsPageProps) {
  return (
    <DashboardLayout userRole="admin">
      <Suspense fallback={<StudentListSkeleton />}>
        <StudentsContent searchParams={searchParams} />
      </Suspense>
    </DashboardLayout>
  )
} 