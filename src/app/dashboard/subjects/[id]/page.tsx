import { notFound } from "next/navigation";
import { fetchSubjectById } from "@/lib/subject-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, UserPlus, Calendar, Users, BookOpen } from "lucide-react";
import Link from "next/link";

interface SubjectDetailPageProps {
  params: {
    id: string;
  };
}

export default async function SubjectDetailPage({ params }: SubjectDetailPageProps) {
  const subject = await fetchSubjectById(params.id);

  if (!subject) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/subjects">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{subject.title}</h1>
            <p className="text-muted-foreground">Subject Code: {subject.code}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/subjects/${subject.id}/tutors`}>
                <UserPlus className="w-4 h-4 mr-2" />
                Manage Tutors
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/subjects/${subject.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Subject
              </Link>
            </Button>
          </div>
        </div>

        {/* Subject Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Subject Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Subject Code</h4>
                  <p className="font-mono text-lg">{subject.code}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Subject Title</h4>
                  <p className="text-lg">{subject.title}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Created Date</h4>
                  <p>{formatDate(subject.created_at)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Assigned Tutors</h4>
                  <p className="text-lg font-semibold">{subject.tutor_subjects.length}</p>
                </div>
              </div>

              {/* Tutor Details */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Tutor Assignments</h4>
                {subject.tutor_subjects.length === 0 ? (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-2">No tutors assigned</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/subjects/${subject.id}/tutors`}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign Tutors
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subject.tutor_subjects.map((assignment) => (
                      <div
                        key={assignment.tutor_id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {assignment.profiles.first_name} {assignment.profiles.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Assigned: {formatDateTime(assignment.assigned_at)}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            Tutor
                          </Badge>
                          {assignment.is_lead_tutor && (
                            <Badge variant="default" className="text-xs">
                              Lead
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {subject.tutor_subjects.length}
                </div>
                <div className="text-sm text-muted-foreground">Assigned Tutors</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {subject.tutor_subjects.filter(ts => ts.is_lead_tutor).length}
                </div>
                <div className="text-sm text-muted-foreground">Lead Tutors</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  0
                </div>
                <div className="text-sm text-muted-foreground">Active Lessons</div>
                <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  0
                </div>
                <div className="text-sm text-muted-foreground">Enrolled Students</div>
                <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href={`/dashboard/subjects/${subject.id}/tutors`}>
                  <UserPlus className="w-6 h-6" />
                  <span>Manage Tutors</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href={`/dashboard/subjects/${subject.id}/edit`}>
                  <Edit className="w-6 h-6" />
                  <span>Edit Subject</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" disabled>
                <Calendar className="w-6 h-6" />
                <span>View Lessons</span>
                <span className="text-xs">(Coming Soon)</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" disabled>
                <Users className="w-6 h-6" />
                <span>View Students</span>
                <span className="text-xs">(Coming Soon)</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 