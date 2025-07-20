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
  Building,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Campus, deleteCampus } from "@/lib/campus-actions";

interface CampusListProps {
  campuses: Campus[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  maintenance: "bg-yellow-100 text-yellow-800",
} as const;

const sortableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'address', label: 'Address' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created' },
];

export function CampusList({
  campuses,
  totalCount,
  currentPage,
  totalPages,
  searchQuery = '',
  sortBy = 'name',
  sortOrder = 'asc'
}: CampusListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campusToDelete, setCampusToDelete] = useState<Campus | null>(null);

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
    
    router.push(`/dashboard/campuses?${params.toString()}`);
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

  const handleDeleteCampus = async (campus: Campus) => {
    setCampusToDelete(campus);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!campusToDelete) return;

    startTransition(async () => {
      try {
        await deleteCampus(campusToDelete.id);
        setDeleteDialogOpen(false);
        setCampusToDelete(null);
        router.refresh();
      } catch (error) {
        console.error('Error deleting campus:', error);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase() as keyof typeof statusColors;
    const colorClass = statusColors[normalizedStatus] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={colorClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Building className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Campuses</h1>
          <Badge variant="secondary">{totalCount} total</Badge>
        </div>
        <Button onClick={() => router.push('/dashboard/campuses/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Campus
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search campuses..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Campuses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campus List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campus</TableHead>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campuses.map((campus) => (
                  <TableRow key={campus.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{campus.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campus.address ? (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {campus.address}
                              </div>
                            ) : (
                              'No address specified'
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{campus.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{campus.address || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campus.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(campus.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {campus.google_maps_link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(campus.google_maps_link!, '_blank')}
                            title="Open in Maps"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/campuses/${campus.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/campuses/${campus.id}/edit`)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCampus(campus)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} campuses
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
            <AlertDialogTitle>Delete Campus</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {campusToDelete?.name}? 
              This action cannot be undone and will remove all associated data including any lessons and rooms.
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