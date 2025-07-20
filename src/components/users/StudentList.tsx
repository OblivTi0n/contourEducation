"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  GraduationCap,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  School,
  Mail,
  Phone,
} from "lucide-react";
import { UserProfile, deleteUser } from "@/lib/user-actions";

interface StudentListProps {
  students: UserProfile[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  userRole: 'admin' | 'tutor'; // Who is viewing this list
  showActions?: boolean; // Whether to show CRUD actions
}

const sortableColumns = [
  { key: 'first_name', label: 'Name' },
  { key: 'school_name', label: 'School' },
  { key: 'vce_year_level', label: 'Year Level' },
  { key: 'contact_email', label: 'Email' },
];

export function StudentList({
  students,
  totalCount,
  currentPage,
  totalPages,
  searchQuery = '',
  sortBy = 'first_name',
  sortOrder = 'asc',
  userRole,
  showActions = true
}: StudentListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<UserProfile | null>(null);

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filtering/searching
    if ('search' in updates) {
      params.set('page', '1');
    }
    
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateSearchParams({ search: value || undefined });
  };

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    updateSearchParams({ sortBy: column, sortOrder: newSortOrder });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleDeleteStudent = async (student: UserProfile) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    startTransition(async () => {
      try {
        await deleteUser(studentToDelete.id);
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
        router.refresh();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    });
  };

  const getStudentFullName = (student: UserProfile) => {
    return `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'No name';
  };

  const getStudentInitials = (student: UserProfile) => {
    const firstName = student.first_name?.charAt(0) || '';
    const lastName = student.last_name?.charAt(0) || '';
    return (firstName + lastName).toUpperCase() || '?';
  };

  const getYearLevelBadge = (yearLevel: number | null) => {
    if (!yearLevel) return <span className="text-muted-foreground">N/A</span>;
    
    const colors = {
      7: "bg-purple-100 text-purple-800",
      8: "bg-blue-100 text-blue-800", 
      9: "bg-green-100 text-green-800",
      10: "bg-yellow-100 text-yellow-800",
      11: "bg-orange-100 text-orange-800",
      12: "bg-red-100 text-red-800",
    } as const;

    return (
      <Badge className={colors[yearLevel as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        Year {yearLevel}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Students</h1>
          <Badge variant="secondary">{totalCount} total</Badge>
        </div>
        {userRole === 'admin' && showActions && (
          <Button onClick={() => router.push('/dashboard/Users/create?role=student')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  {sortableColumns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                  ))}
                  <TableHead>Parent/Guardian</TableHead>
                  {showActions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={student.avatar_url || undefined} />
                          <AvatarFallback>{getStudentInitials(student)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getStudentFullName(student)}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {student.contact_email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStudentFullName(student)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <School className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{student.school_name || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getYearLevelBadge(student.vce_year_level)}</TableCell>
                    <TableCell>{student.contact_email}</TableCell>
                    <TableCell>
                      {student.parent_guardian_name ? (
                        <div className="text-sm">
                          <div className="font-medium">{student.parent_guardian_name}</div>
                          {student.parent_guardian_phone && (
                            <div className="text-muted-foreground flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {student.parent_guardian_phone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    {showActions && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/Users/${student.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            {userRole === 'admin' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/dashboard/Users/${student.id}/edit`)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteStudent(student)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} students
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {studentToDelete ? getStudentFullName(studentToDelete) : 'this student'}? 
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 