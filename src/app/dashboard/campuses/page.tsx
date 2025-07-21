import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { CampusList } from '@/components/campuses/CampusList'
import { getCampuses } from '@/lib/campus-actions'
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

interface CampusesPageProps {
  searchParams: Promise<{
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: string
  }>
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
  const params = await searchParams
  const search = params.search
  const sortBy = params.sortBy || 'name'
  const sortOrder = params.sortOrder || 'asc'
  const page = parseInt(params.page || '1')

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

export default async function CampusesPage({ searchParams }: CampusesPageProps) {
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

  // Only allow admins to access campus management
  if (userRole !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<CampusListSkeleton />}>
      <CampusesContent searchParams={searchParams} />
    </Suspense>
  )
} 