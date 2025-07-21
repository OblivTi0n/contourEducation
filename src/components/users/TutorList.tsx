"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Briefcase,
  Mail,
  Phone,
  Star,
  BookOpen,
} from "lucide-react";
import { UserProfile, deleteUser, getAvailableSubjects } from "@/lib/user-actions";

interface TutorListProps {
  tutors: UserProfile[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  subjectFilter?: string;
}

const sortableColumns = [
  { key: 'first_name', label: 'Name' },
  { key: 'job_title', label: 'Job Title' },
  { key: 'contact_email', label: 'Email' },
];

export function TutorList({
  tutors,
  totalCount,
  currentPage,
  totalPages,
  searchQuery = '',
  sortBy = 'first_name',
  sortOrder = 'asc',
  subjectFilter
}: TutorListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState<UserProfile | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<Array<{id: string, code: string, title: string}>>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

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

  const handleSubjectFilter = (value: string) => {
    updateSearchParams({ subject: value === 'all' ? undefined : value });
  };

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    updateSearchParams({ sortBy: column, sortOrder: newSortOrder });
  };

  // Load available subjects
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setIsLoadingSubjects(true);
        const subjects = await getAvailableSubjects();
        setAvailableSubjects(subjects || []);
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleDeleteTutor = async (tutor: UserProfile) => {
    setTutorToDelete(tutor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!tutorToDelete) return;

    startTransition(async () => {
      try {
        await deleteUser(tutorToDelete.id);
        setDeleteDialogOpen(false);
        setTutorToDelete(null);
        router.refresh();
      } catch (error) {
        console.error('Error deleting tutor:', error);
      }
    });
  };

  const getTutorFullName = (tutor: UserProfile) => {
    return `${tutor.first_name || ''} ${tutor.last_name || ''}`.trim() || 'No name';
  };

  const getTutorInitials = (tutor: UserProfile) => {
    const firstName = tutor.first_name?.charAt(0) || '';
    const lastName = tutor.last_name?.charAt(0) || '';
    return (firstName + lastName).toUpperCase() || '?';
  };

  const getStatusBadge = () => {
    // This could be enhanced with actual status from database
    return (
      <Badge className="bg-green-100 text-green-800">
        Active
      </Badge>
    );
  };

  const truncateBio = (bio: string | null, maxLength: number = 100) => {
    if (!bio) return 'No bio available';
    if (bio.length <= maxLength) return bio;
    return bio.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Tutors</h1>
          <Badge variant="secondary">{totalCount} total</Badge>
        </div>
        <Button onClick={() => router.push('/dashboard/users/create?role=tutor')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tutor
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tutors..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={subjectFilter || 'all'} onValueChange={handleSubjectFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <BookOpen className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {isLoadingSubjects ? (
                  <SelectItem value="loading" disabled>Loading subjects...</SelectItem>
                ) : (
                  availableSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tutors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tutor List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
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
                  <TableHead>Bio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutors.map((tutor) => (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={tutor.avatar_url || undefined} />
                          <AvatarFallback>{getTutorInitials(tutor)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getTutorFullName(tutor)}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {tutor.contact_email}
                          </div>
                          {tutor.phone_number && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {tutor.phone_number}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTutorFullName(tutor)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{tutor.job_title || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tutor.contact_email}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-muted-foreground">
                          {truncateBio(tutor.bio)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/users/${tutor.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/users/${tutor.id}/edit`)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTutor(tutor)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} tutors
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
            <AlertDialogTitle>Delete Tutor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {tutorToDelete ? getTutorFullName(tutorToDelete) : 'this tutor'}? 
              This action cannot be undone and will remove all associated data including any lessons they are assigned to.
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