import { Suspense } from 'react'
import { CampusList } from '@/components/campuses/CampusList'
import { getCampuses } from '@/lib/campus-actions'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface CampusesPageProps {
  searchParams: {
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: string
  }
}

function CampusListSkeleton() {
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
                  <Skeleton className="w-10 h-10 rounded-lg" />
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

async function CampusesContent({ searchParams }: CampusesPageProps) {
  const search = searchParams.search
  const sortBy = searchParams.sortBy || 'name'
  const sortOrder = searchParams.sortOrder || 'asc'
  const page = parseInt(searchParams.page || '1')

  try {
    const result = await getCampuses(search, sortBy, sortOrder, page)

    return (
      <CampusList
        campuses={result.campuses}
        totalCount={result.totalCount}
        currentPage={result.page}
        totalPages={result.totalPages}
        searchQuery={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    )
  } catch (error) {
    console.error('Error loading campuses:', error)
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Error Loading Campuses
          </h2>
          <p className="text-muted-foreground">
            There was an error loading the campus list. Please try again.
          </p>
        </div>
      </div>
    )
  }
}

export default function CampusesPage({ searchParams }: CampusesPageProps) {
  return (
    <DashboardLayout userRole="admin">
      <Suspense fallback={<CampusListSkeleton />}>
        <CampusesContent searchParams={searchParams} />
      </Suspense>
    </DashboardLayout>
  )
} 