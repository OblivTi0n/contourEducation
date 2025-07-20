"use client";

import { DashboardLayout } from "./DashboardLayout";
import { StatCard } from "./StatCard";
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
  BarChart3,
  Plus,
  Eye,
  GraduationCap
} from "lucide-react";
import Link from "next/link";

// Mock data
const mockSubjects = [
  { id: "1", name: "VCE Math Methods 3/4", students: 45, tutors: 3, lessons: 28 },
  { id: "2", name: "VCE Chemistry 3/4", students: 38, tutors: 2, lessons: 24 },
  { id: "3", name: "VCE English 3/4", students: 52, tutors: 4, lessons: 32 },
  { id: "4", name: "VCE Physics 3/4", students: 29, tutors: 2, lessons: 18 }
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
              <Button className="h-20 flex-col space-y-2" asChild>
                <Link href="/dashboard/Users/create">
                  <UserPlus className="w-6 h-6" />
                  <span>Add User</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/dashboard/Users">
                  <Users className="w-6 h-6" />
                  <span>View Users</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/dashboard/subjects">
                  <BookOpen className="w-6 h-6" />
                  <span>View Subjects</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/dashboard/campuses">
                  <Calendar className="w-6 h-6" />
                  <span>View Campuses</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        </div>
      </div>
    </DashboardLayout>
  );
};