import { Suspense } from "react";
import { fetchSubjects } from "@/lib/subject-actions";
import { SubjectList } from "@/components/subjects/SubjectList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

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

interface SearchParams {
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Loading skeleton component
const SubjectListSkeleton = () => (
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
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

async function SubjectsPageContent({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  
  // Check authentication and get user role
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

  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search;
  const sortBy = searchParams.sortBy || "title";
  const sortOrder = searchParams.sortOrder || "asc";

  try {
    const { data: subjects, count, totalPages } = await fetchSubjects(
      page,
      10,
      search,
      sortBy,
      sortOrder
    );

    return (
      <SubjectList
        subjects={subjects}
        currentPage={page}
        totalPages={totalPages}
        totalCount={count}
        searchTerm={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        userRole={userRole}
      />
    );
  } catch (error) {
    console.error("Error loading subjects:", error);
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load subjects. Please try again.</p>
      </div>
    );
  }
}

export default function SubjectsPage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  return (
    <Suspense fallback={<SubjectListSkeleton />}>
      <SubjectsPageContent searchParams={searchParams} />
    </Suspense>
  );
} 