import { StatCard } from "./StatCard";
import { UpcomingLessons } from "./UpcomingLessons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, BookOpen, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { createClient } from '@/lib/supabase-server';
import { fetchLessons } from '@/lib/lesson-actions';
import { getUsers, getUserById } from '@/lib/user-actions';
import { redirect } from 'next/navigation';

// Helper function to decode JWT
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export const TutorDashboard = async () => {
  const supabase = await createClient();
  
  // Get the current user (secure method)
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  let userRole: string = 'student'; // Default fallback

  // Get session only to extract user role from access token
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    const decodedToken = decodeJWT(session.access_token);
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role;
    }
  }

  // Ensure this is actually a tutor
  if (userRole !== 'tutor') {
    redirect('/dashboard');
  }

  let tutorProfile;
  
  try {
    // Fetch tutor profile data
    tutorProfile = await getUserById(user.id);
    // Fetch tutor's lessons
    const lessonsResult = await fetchLessons(
      1, // page
      50, // limit - get more to show variety
      undefined, // search
      'start_time', // sortBy
      'asc', // sortOrder
      undefined, // status
      undefined, // subject_id
      undefined, // campus_id
      'tutor', // user_role
      user.id // user_id
    );

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    const todaysLessons = lessonsResult.data.filter(lesson => 
      lesson.start_time.split('T')[0] === today
    );

    // Get unique student IDs from tutor's lessons
    const studentIds = new Set<string>();
    lessonsResult.data.forEach(lesson => {
      lesson.students?.forEach(student => {
        if (student.id) studentIds.add(student.id);
      });
    });

    // Get unique subject IDs from tutor's lessons
    const subjectIds = new Set<string>();
    lessonsResult.data.forEach(lesson => {
      if (lesson.subject_id) subjectIds.add(lesson.subject_id);
    });

    // Fetch subjects this tutor teaches
    const { data: tutorSubjects, error: subjectsError } = await supabase
      .from('tutor_subjects')
      .select(`
        subject:subjects(id, code, title)
      `)
      .eq('tutor_id', user.id);

    const subjects = tutorSubjects?.map(ts => ts.subject).filter(subject => subject != null) || [];

    // Get students from tutor's subjects via enrollments
    let allStudents: Array<{ id: string; first_name: string; last_name: string; role: string; subjects: string[] }> = [];
    if (subjects.length > 0) {
      const subjectIdsFromAssignments = subjects.map((s: unknown) => (s as { id: string } | null)?.id).filter(Boolean);
      
      const { data: enrollments } = await supabase
        .from('enrolments')
        .select(`
          student:profiles!enrolments_student_id_fkey(
            id, first_name, last_name, role
          ),
          subject:subjects(id, code, title)
        `)
        .in('subject_id', subjectIdsFromAssignments)
        .eq('status', 'active');

      allStudents = enrollments?.map((e: unknown) => {
        const enrollment = e as { 
          student: { id: string; first_name: string; last_name: string; role: string }; 
          subject: { title?: string; code?: string } | null 
        };
        return {
          ...enrollment.student,
          subjects: [enrollment.subject?.title || enrollment.subject?.code || 'Unknown']
        };
      }).filter(Boolean) || [];

      // Remove duplicates and aggregate subjects
      const studentMap = new Map();
      allStudents.forEach(student => {
        if (studentMap.has(student.id)) {
          studentMap.get(student.id).subjects = [
            ...new Set([...studentMap.get(student.id).subjects, ...student.subjects])
          ];
        } else {
          studentMap.set(student.id, student);
        }
      });
      allStudents = Array.from(studentMap.values());
    }

    // Transform lessons to match UpcomingLessons component format
    const upcomingLessons = lessonsResult.data.slice(0, 5).map(lesson => {
      const startDate = new Date(lesson.start_time);
      const formattedDate = startDate.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      });
      const formattedTime = startDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      
      // Build location string with campus name and room
      let location = 'TBA';
      if (lesson.location_detail) {
        location = lesson.location_detail; // Online lessons
      } else if (lesson.campus?.name && lesson.room?.name) {
        location = `${lesson.campus.name}, ${lesson.room.name}`;
      } else if (lesson.campus?.name) {
        location = lesson.campus.name;
      } else if (lesson.room?.name) {
        location = lesson.room.name;
      } else if (lesson.location) {
        location = lesson.location;
      }

      return {
        id: lesson.id,
        title: lesson.title,
        subject: lesson.subject?.title || lesson.subject?.code || 'Unknown Subject',
        date: startDate.toISOString().split('T')[0],
        time: `${formattedDate} at ${formattedTime}`,
        location,
        type: lesson.location_detail ? 'online' as const : 'in-person' as const,
        instructor: 'You',
        students: lesson.students?.length || 0
      };
    });

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">Welcome back, {tutorProfile.first_name || 'Tutor'}!</h1>
          <p className="text-xl text-muted-foreground">Ready to inspire your students today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <StatCard
            title="Upcoming Lessons"
            value={todaysLessons.length}
            description="Scheduled for today"
            iconName="Calendar"
            gradient
          />
          <StatCard
            title="Total Students"
            value={allStudents.length}
            description="Active students"
            iconName="Users"
            color="success"
          />
          <StatCard
            title="Subjects Teaching"
            value={subjects.length}
            description={subjects.length > 0 ? subjects.map((s: unknown) => (s as { code?: string } | null)?.code).join(', ') : 'No subjects'}
            iconName="BookOpen"
            color="primary"
          />
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="h-20 flex-col space-y-2" asChild>
                <Link href="/dashboard/lessons/create">
                  <Plus className="w-6 h-6" />
                  <span>Schedule Lesson</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/dashboard/users/students">
                  <Eye className="w-6 h-6" />
                  <span>View Students</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Lessons */}
          <UpcomingLessons lessons={upcomingLessons} userRole="tutor" />

          {/* Student Overview */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>My Students</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {allStudents.length > 0 ? (
                <>
                  {allStudents.slice(0, 4).map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {`${student.first_name?.charAt(0) || ''}${student.last_name?.charAt(0) || ''}`.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {`${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student'}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {student.subjects?.slice(0, 2).map((subject: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {student.subjects?.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{student.subjects.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/dashboard/users/students">
                      View All Students
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No students assigned yet</p>
                  <p className="text-sm">Students will appear when they enroll in your subjects</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading tutor dashboard data:', error);
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Welcome back, {tutorProfile?.first_name || 'Tutor'}!</h1>
          <p className="text-xl text-destructive">Unable to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }
}; 