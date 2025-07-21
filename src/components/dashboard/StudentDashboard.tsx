import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { StatCard } from "./StatCard";
import { UpcomingLessons } from "./UpcomingLessons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, TrendingUp, Download, FileText, Video } from "lucide-react";
import { fetchLessons } from "@/lib/lesson-actions";
import { getUserById } from "@/lib/user-actions";

// Helper function to decode JWT and extract claims
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

export const StudentDashboard = async () => {
  const supabase = await createClient();
  
  // Get the current session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    redirect('/login');
  }

  const user = session.user;
  let userRole: string = 'student'; // Default fallback

  // Decode JWT to extract user role
  if (session.access_token) {
    const decodedToken = decodeJWT(session.access_token);
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role;
    }
  }

  // Ensure this is actually a student
  if (userRole !== 'student') {
    redirect('/dashboard');
  }

  try {
    // Fetch student's lessons with proper filtering
    const lessonsResult = await fetchLessons(
      1, // page
      50, // limit - get more to show variety
      undefined, // search
      'start_time', // sortBy
      'asc', // sortOrder
      'scheduled', // status - only scheduled lessons
      undefined, // subject_id
      undefined, // campus_id
      'student', // user_role
      user.id // user_id
    );

    // Get student's profile with enrolments
    const studentProfile = await getUserById(user.id);

    // Filter lessons to get upcoming ones (today onwards)
    const now = new Date();
    const upcomingLessons = lessonsResult.data.filter(lesson => 
      new Date(lesson.start_time) >= now
    );

    // Get this week's lessons
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    const thisWeekLessons = upcomingLessons.filter(lesson => 
      new Date(lesson.start_time) <= oneWeekFromNow
    );

    // Get active enrolments count
    const activeEnrolments = studentProfile.enrolments?.filter(e => e.status === 'active') || [];

    // Transform lessons to match the expected format for UpcomingLessons component
    const transformedLessons = upcomingLessons.slice(0, 10).map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      subject: lesson.subject?.title || lesson.subject?.code || 'Unknown Subject',
      date: lesson.start_time.split('T')[0],
      time: new Date(lesson.start_time).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      location: lesson.location || lesson.campus?.name || 'Online',
      type: (lesson.location_detail || lesson.campus) ? 'in-person' : 'online' as "in-person" | "online",
      instructor: lesson.tutors?.[0] ? 
        `${lesson.tutors[0].first_name || ''} ${lesson.tutors[0].last_name || ''}`.trim() : 
        'TBA',
      students: lesson.students?.length || 0
    }));

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, {studentProfile.first_name || 'Student'}!
          </h1>
          <p className="text-xl text-muted-foreground">Ready to excel in your VCE studies?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          <StatCard
            title="Upcoming Lessons"
            value={thisWeekLessons.length.toString()}
            description="This week"
            iconName="Calendar"
            gradient
          />
          <StatCard
            title="Subjects Enrolled"
            value={activeEnrolments.length.toString()}
            description="Active subjects"
            iconName="BookOpen"
            color="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Lessons */}
          <UpcomingLessons lessons={transformedLessons} userRole="student" />

          {/* Subject Enrolments */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Your Subjects</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeEnrolments.length > 0 ? (
                <>
                  {activeEnrolments.slice(0, 4).map((enrolment) => (
                    <div
                      key={enrolment.subject_id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-medium">
                            {enrolment.subject.code} - {enrolment.subject.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Enrolled: {new Date(enrolment.enrol_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeEnrolments.length > 4 && (
                    <p className="text-sm text-muted-foreground text-center">
                      And {activeEnrolments.length - 4} more subjects...
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No subjects enrolled yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lessonsResult.data.slice(0, 5).map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {lesson.subject?.title} • {new Date(lesson.start_time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {lesson.status === 'completed' ? 'Completed' : 
                   lesson.status === 'cancelled' ? 'Cancelled' : 
                   new Date(lesson.start_time) > new Date() ? 'Upcoming' : 'Scheduled'}
                </div>
              </div>
            ))}
            {lessonsResult.data.length === 0 && (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No lessons scheduled yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error loading student dashboard:', error);
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }
}; 