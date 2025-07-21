"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { deleteSubject, type SubjectWithTutors } from "@/lib/subject-actions";

interface SubjectListProps {
  subjects: SubjectWithTutors[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  userRole?: string;
}

export const SubjectList = ({ 
  subjects, 
  currentPage, 
  totalPages, 
  totalCount,
  searchTerm = "",
  sortBy = "title",
  sortOrder = "asc",
  userRole = "student"
}: SubjectListProps) => {
  const [search, setSearch] = useState(searchTerm);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", "1");
      if (sortBy !== "title") params.set("sortBy", sortBy);
      if (sortOrder !== "asc") params.set("sortOrder", sortOrder);
      
      window.location.href = `/dashboard/subjects?${params.toString()}`;
    });
  };

  const handleSort = (column: string) => {
    startTransition(() => {
      const newSortOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc";
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", "1");
      params.set("sortBy", column);
      params.set("sortOrder", newSortOrder);
      
      window.location.href = `/dashboard/subjects?${params.toString()}`;
    });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", page.toString());
      if (sortBy !== "title") params.set("sortBy", sortBy);
      if (sortOrder !== "asc") params.set("sortOrder", sortOrder);
      
      window.location.href = `/dashboard/subjects?${params.toString()}`;
    });
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete subject "${code}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteSubject(id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(`Failed to delete subject: ${result.error}`);
      }
    });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">
            Manage VCE subjects and tutor assignments ({totalCount} total)
          </p>
        </div>
        {userRole === 'admin' && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/subjects/create">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by subject code or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={isPending}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card>
        <CardHeader>
          <CardTitle>All Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No subjects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search criteria." : "Get started by creating your first subject."}
              </p>
              {!searchTerm && userRole === 'admin' && (
                <Button asChild>
                  <Link href="/dashboard/subjects/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Subject
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort("code")}
                          className="font-semibold"
                        >
                          Code {getSortIcon("code")}
                        </Button>
                      </th>
                      <th className="text-left p-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort("title")}
                          className="font-semibold"
                        >
                          Title {getSortIcon("title")}
                        </Button>
                      </th>
                      <th className="text-left p-2">
                        <span className="font-semibold px-4">Tutors</span>
                      </th>
                      <th className="text-left p-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort("created_at")}
                          className="font-semibold"
                        >
                          Created {getSortIcon("created_at")}
                        </Button>
                      </th>
                      <th className="text-right p-2">
                        <span className="font-semibold px-4">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <span className="font-mono text-sm font-medium">
                            {subject.code}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{subject.title}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {subject.tutor_subjects.length === 0 ? (
                              <Badge variant="outline" className="text-xs">
                                No tutors
                              </Badge>
                            ) : (
                              subject.tutor_subjects
                                .filter((assignment) => assignment.profiles !== null)
                                .map((assignment) => (
                                <Badge 
                                  key={assignment.tutor_id}
                                  variant={assignment.is_lead_tutor ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {assignment.profiles.first_name} {assignment.profiles.last_name}
                                  {assignment.is_lead_tutor && " (Lead)"}
                                </Badge>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(subject.created_at)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/dashboard/subjects/${subject.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            {userRole === 'admin' && (
                              <>
                                <Button size="sm" variant="ghost" asChild>
                                  <Link href={`/dashboard/subjects/${subject.id}/tutors`}>
                                    <UserPlus className="w-4 h-4" />
                                  </Link>
                                </Button>
                                <Button size="sm" variant="ghost" asChild>
                                  <Link href={`/dashboard/subjects/${subject.id}/edit`}>
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(subject.id, subject.code)}
                                  disabled={isPending}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {subjects.map((subject) => (
                  <Card key={subject.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-sm font-medium text-muted-foreground">
                            {subject.code}
                          </div>
                          <div className="font-medium">{subject.title}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/dashboard/subjects/${subject.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          {userRole === 'admin' && (
                            <>
                              <Button size="sm" variant="ghost" asChild>
                                <Link href={`/dashboard/subjects/${subject.id}/tutors`}>
                                  <UserPlus className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button size="sm" variant="ghost" asChild>
                                <Link href={`/dashboard/subjects/${subject.id}/edit`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(subject.id, subject.code)}
                                disabled={isPending}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Tutors:</div>
                        <div className="flex flex-wrap gap-1">
                          {subject.tutor_subjects.length === 0 ? (
                            <Badge variant="outline" className="text-xs">
                              No tutors assigned
                            </Badge>
                          ) : (
                            subject.tutor_subjects
                              .filter((assignment) => assignment.profiles !== null)
                              .map((assignment) => (
                              <Badge 
                                key={assignment.tutor_id}
                                variant={assignment.is_lead_tutor ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {assignment.profiles.first_name} {assignment.profiles.last_name}
                                {assignment.is_lead_tutor && " (Lead)"}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Created: {formatDate(subject.created_at)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} ({totalCount} total subjects)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || isPending}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages || isPending}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 