"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Lesson } from "@/lib/lesson-actions";

interface LessonListProps {
  lessons: Lesson[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  userRole: string;
  onDeleteLesson?: (id: string) => void;
}

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
} as const;

const statusLabels = {
  scheduled: "Scheduled",
  completed: "Completed", 
  cancelled: "Cancelled",
} as const;

export const LessonList: React.FC<LessonListProps> = ({
  lessons,
  totalCount,
  currentPage,
  totalPages,
  searchQuery,
  sortBy,
  sortOrder,
  userRole,
  onDeleteLesson,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "MMM dd, yyyy"),
      time: format(date, "h:mm a"),
    };
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    if (localSearchQuery) {
      params.set("search", localSearchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  };

  const handleSort = (field: string) => {
    const params = new URLSearchParams(window.location.search);
    const newSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    params.set("sortBy", field);
    params.set("sortOrder", newSortOrder);
    params.set("page", "1");
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  };

  const canManageLessons = userRole === 'admin' || userRole === 'tutor';
  const canCreateLessons = userRole === 'admin' || userRole === 'tutor';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Lessons</h1>
          <Badge variant="secondary" className="ml-2">
            {totalCount} lessons
          </Badge>
        </div>
        {canCreateLessons && (
          <Button asChild>
            <Link href="/dashboard/lessons/create">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Lesson
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search lessons..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {searchQuery ? `Search results for "${searchQuery}"` : "All Lessons"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No lessons found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "No lessons have been scheduled yet"}
              </p>
              {canCreateLessons && (
                <Button asChild>
                  <Link href="/dashboard/lessons/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule First Lesson
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("title")}
                      >
                        Title
                        {sortBy === "title" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("subject.title")}
                      >
                        Subject
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("start_time")}
                      >
                        Date & Time
                        {sortBy === "start_time" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map((lesson) => {
                      const startDateTime = formatDateTime(lesson.start_time);
                      const duration = formatDuration(lesson.start_time, lesson.end_time);
                      const participantCount = (lesson.tutors?.length || 0) + (lesson.students?.length || 0);

                      return (
                        <TableRow key={lesson.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{lesson.title}</div>
                              {lesson.subject && (
                                <div className="text-sm text-muted-foreground">
                                  {lesson.subject.code}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {lesson.subject?.title}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{startDateTime.date}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {startDateTime.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{duration}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">
                                {lesson.location_detail 
                                  ? "Online" 
                                  : lesson.campus?.name 
                                    ? `${lesson.campus.name}${lesson.room ? ` - ${lesson.room.name}` : ''}`
                                    : lesson.location || "TBD"
                                }
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[lesson.status]}>
                              {statusLabels[lesson.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">{participantCount}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/lessons/${lesson.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                {canManageLessons && (
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/lessons/${lesson.id}/edit`}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {canCreateLessons && onDeleteLesson && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-destructive"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{lesson.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => onDeleteLesson(lesson.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} lessons
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => {
                        const showEllipsis = index > 0 && page - array[index - 1] > 1;
                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && <span className="px-2">...</span>}
                            <Button
                              variant={page === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
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