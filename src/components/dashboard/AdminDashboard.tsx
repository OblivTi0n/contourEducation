"use client";

import { DashboardLayout } from "./DashboardLayout";
import { StatCard } from "./StatCard";
import { UpcomingLessons } from "./UpcomingLessons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  UserPlus,
  Settings,
  FileText,
  BarChart3,
  Plus,
  Eye
} from "lucide-react";

// Mock data
const mockLessons = [
  {
    id: "1",
    title: "VCE Math Methods - Advanced Calculus",
    subject: "Math Methods 3/4",
    date: "2024-07-22",
    time: "2:00 PM",
    location: "Room 101",
    type: "in-person" as const,
    instructor: "Dr. Sarah Johnson",
    students: 8
  },
  {
    id: "2",
    title: "VCE Chemistry - Organic Chemistry",
    subject: "Chemistry 3/4",
    date: "2024-07-22",
    time: "4:00 PM",
    location: "Virtual Classroom",
    type: "online" as const,
    instructor: "Prof. Michael Chen",
    students: 12
  }
];

const mockSubjects = [
  { id: "1", name: "VCE Math Methods 3/4", students: 45, tutors: 3, lessons: 28 },
  { id: "2", name: "VCE Chemistry 3/4", students: 38, tutors: 2, lessons: 24 },
  { id: "3", name: "VCE English 3/4", students: 52, tutors: 4, lessons: 32 },
  { id: "4", name: "VCE Physics 3/4", students: 29, tutors: 2, lessons: 18 }
];

const mockRecentActivity = [
  { id: "1", action: "New student enrolled", details: "Emma Wilson joined VCE Math Methods 3/4", time: "2 hours ago" },
  { id: "2", action: "Lesson completed", details: "VCE Chemistry - Organic Chemistry with 12 students", time: "4 hours ago" },
  { id: "3", action: "Resource uploaded", details: "Calculus Practice Problems by Dr. Sarah Johnson", time: "6 hours ago" },
  { id: "4", action: "New tutor assigned", details: "Prof. Lisa Anderson assigned to VCE English 1/2", time: "1 day ago" }
];

export const AdminDashboard = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">Complete oversight of your tutoring operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          <StatCard
            title="Total Students"
            value="164"
            description="+12 this month"
            icon={Users}
            gradient
          />
          <StatCard
            title="Active Tutors"
            value="11"
            description="All subjects covered"
            icon={UserPlus}
            color="success"
          />
          <StatCard
            title="VCE Subjects"
            value={mockSubjects.length}
            description="Currently offered"
            icon={BookOpen}
            color="primary"
          />
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2">
                <UserPlus className="w-6 h-6" />
                <span>Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Plus className="w-6 h-6" />
                <span>Create Subject</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="w-6 h-6" />
                <span>Schedule Lesson</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Lessons */}
          <UpcomingLessons lessons={mockLessons} userRole="admin" />

          {/* Subject Overview */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Subject Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="subject-stats"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">{subject.name}</h4>
                    <Button size="sm" variant="ghost" className="rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{subject.students}</div>
                      <div className="text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{subject.tutors}</div>
                      <div className="text-muted-foreground">Tutors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{subject.lessons}</div>
                      <div className="text-muted-foreground">Lessons</div>
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                Manage All Subjects
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Trends */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Enrollment Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { month: "January", students: 142, percentage: 85 },
                  { month: "February", students: 156, percentage: 93 },
                  { month: "March", students: 164, percentage: 98 },
                  { month: "April", students: 158, percentage: 95 }
                ].map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{data.month}</span>
                      <span className="text-muted-foreground">{data.students} students</span>
                    </div>
                    <Progress value={data.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{activity.action}</h4>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};