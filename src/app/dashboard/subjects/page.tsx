import { Suspense } from "react";
import { fetchSubjects } from "@/lib/subject-actions";
import { SubjectList } from "@/components/subjects/SubjectList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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