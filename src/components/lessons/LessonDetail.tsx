"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  ArrowLeft,
  ExternalLink,
  Building,
  Monitor,
  User,
  GraduationCap
} from "lucide-react";
import { Lesson } from "@/lib/lesson-actions";

interface LessonDetailProps {
  lesson: Lesson;
  userRole: string;
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

export const LessonDetail: React.FC<LessonDetailProps> = ({
  lesson,
  userRole,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "EEEE, MMMM dd, yyyy"),
      time: format(date, "h:mm a"),
      shortDate: format(date, "MMM dd"),
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

  const getUserDisplayName = (user: { first_name?: string; last_name?: string }) => {
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unnamed User";
  };

  const getUserInitials = (user: { first_name?: string; last_name?: string }) => {
    const firstName = user.first_name?.charAt(0) || "";
    const lastName = user.last_name?.charAt(0) || "";
    return (firstName + lastName).toUpperCase() || "?";
  };

  const canManageLesson = userRole === 'admin' || userRole === 'tutor';
  const startDateTime = formatDateTime(lesson.start_time);
  const endDateTime = formatDateTime(lesson.end_time);
  const duration = formatDuration(lesson.start_time, lesson.end_time);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/lessons">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lessons
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={statusColors[lesson.status]}>
                  {statusLabels[lesson.status]}
                </Badge>
                {lesson.subject && (
                  <Badge variant="outline">
                    {lesson.subject.code}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        {canManageLesson && (
          <Button asChild>
            <Link href={`/dashboard/lessons/${lesson.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Lesson
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lesson Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Lesson Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject */}
              {lesson.subject && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Subject</div>
                  <div className="text-lg font-semibold">
                    {lesson.subject.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {lesson.subject.code}
                  </div>
                </div>
              )}

              {/* Date and Time */}
              <div>
                <div className="text-sm font-medium text-muted-foreground">Schedule</div>
                <div className="flex items-center space-x-2 text-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{startDateTime.date}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {startDateTime.time} - {endDateTime.time} ({duration})
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge className={statusColors[lesson.status]}>
                  {statusLabels[lesson.status]}
                </Badge>
              </div>

              {/* Created by */}
              {lesson.creator && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Created by</div>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {getUserInitials(lesson.creator)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{getUserDisplayName(lesson.creator)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.location_detail ? (
                /* Online lesson */
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    <span className="font-medium">Online Lesson</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Meeting Link
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {lesson.location_detail}
                      </code>
                      <Button size="sm" variant="outline" asChild>
                        <a 
                          href={lesson.location_detail} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Join
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* In-person lesson */
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-primary" />
                    <span className="font-medium">In-Person Lesson</span>
                  </div>
                  
                  {lesson.campus && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Campus</div>
                      <div className="font-medium">{lesson.campus.name}</div>
                      {lesson.campus.address && (
                        <div className="text-sm text-muted-foreground">
                          {lesson.campus.address}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {lesson.room && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Room</div>
                      <div className="font-medium">{lesson.room.name}</div>
                      {lesson.room.capacity && (
                        <div className="text-sm text-muted-foreground">
                          Capacity: {lesson.room.capacity} people
                        </div>
                      )}
                    </div>
                  )}
                  
                  {lesson.location && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Additional Notes
                      </div>
                      <div className="text-sm">{lesson.location}</div>
                    </div>
                  )}
                  
                  {!lesson.campus && !lesson.room && (
                    <div className="text-sm text-muted-foreground">
                      {lesson.location || "Location to be determined"}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Participants */}
        <div className="space-y-6">
          {/* Tutors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Tutors</span>
                <Badge variant="secondary">
                  {lesson.tutors?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.tutors && lesson.tutors.length > 0 ? (
                <div className="space-y-3">
                  {lesson.tutors.map((tutor) => (
                    <div key={tutor.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarFallback>
                          {getUserInitials(tutor)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{getUserDisplayName(tutor)}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {tutor.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No tutors assigned</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>Students</span>
                <Badge variant="secondary">
                  {lesson.students?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.students && lesson.students.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {lesson.students.map((student) => (
                    <div key={student.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(student)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{getUserDisplayName(student)}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {student.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No students enrolled</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {canManageLesson && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/dashboard/lessons/${lesson.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Lesson
                  </Link>
                </Button>
                
                {lesson.status === 'scheduled' && (
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                
                {lesson.location_detail && (
                  <Button className="w-full" variant="outline" asChild>
                    <a 
                      href={lesson.location_detail} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join Meeting
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 