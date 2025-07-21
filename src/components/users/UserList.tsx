"use client";

import { useState, useTransition } from "react";
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
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Crown,
} from "lucide-react";
import { UserProfile, UserRole, deleteUser } from "@/lib/user-actions";

interface UserListProps {
  users: UserProfile[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  roleFilter?: UserRole;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const roleColors = {
  admin: "bg-red-100 text-red-800",
  tutor: "bg-blue-100 text-blue-800",
  student: "bg-green-100 text-green-800",
} as const;

const sortableColumns = [
  { key: 'first_name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'contact_email', label: 'Email' },
  { key: 'school_name', label: 'School' },
  { key: 'vce_year_level', label: 'Year Level' },
];

export function UserList({
  users,
  totalCount,
  currentPage,
  totalPages,
  searchQuery = '',
  roleFilter,
  sortBy = 'first_name',
  sortOrder = 'asc'
}: UserListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

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
    if ('search' in updates || 'role' in updates) {
      params.set('page', '1');
    }
    
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateSearchParams({ search: value || undefined });
  };

  const handleRoleFilter = (value: string) => {
    updateSearchParams({ role: value === 'all' ? undefined : value });
  };

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    updateSearchParams({ sortBy: column, sortOrder: newSortOrder });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleDeleteUser = async (user: UserProfile) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    startTransition(async () => {
      try {
        await deleteUser(userToDelete.id);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        router.refresh();
      } catch (error) {
        console.error('Error deleting user:', error);
        // You could add a toast notification here
      }
    });
  };

  const getUserFullName = (user: UserProfile) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No name';
  };

  const getUserInitials = (user: UserProfile) => {
    const firstName = user.first_name?.charAt(0) || '';
    const lastName = user.last_name?.charAt(0) || '';
    return (firstName + lastName).toUpperCase() || '?';
  };

  const getUserSubjects = (user: UserProfile) => {
    if (user.role === 'tutor' && user.tutor_subjects) {
      return user.tutor_subjects.map(ts => ({
        ...ts.subject,
        is_lead_tutor: ts.is_lead_tutor
      }));
    } else if (user.role === 'student' && user.enrolments) {
      return user.enrolments
        .filter(e => e.status === 'active')
        .map(e => e.subject);
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Users</h1>
          <Badge variant="secondary">{totalCount} total</Badge>
        </div>
        <Button onClick={() => router.push('/dashboard/users/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter || 'all'} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getUserFullName(user)}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.contact_email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getUserFullName(user)}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.contact_email}</TableCell>
                    <TableCell>{user.school_name || 'N/A'}</TableCell>
                    <TableCell>
                      {user.role === 'student' ? user.vce_year_level || 'N/A' : 'N/A'}
                    </TableCell>
                    <TableCell>{user.phone_number || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {getUserSubjects(user).length === 0 ? (
                          <span className="text-xs text-muted-foreground">No subjects assigned</span>
                        ) : (
                          getUserSubjects(user).map((subject: any) => (
                            <Badge 
                              key={subject.id} 
                              variant="outline" 
                              className="text-xs flex items-center gap-1"
                            >
                              {subject.code}
                              {user.role === 'tutor' && subject.is_lead_tutor && (
                                <Crown className="w-2 h-2" />
                              )}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/users/${user.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user)}
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
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} users
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
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete ? getUserFullName(userToDelete) : 'this user'}? 
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