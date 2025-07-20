"use client";

import { StatCard } from "./StatCard";
import { UpcomingLessons } from "./UpcomingLessons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, TrendingUp, Download, FileText, Video } from "lucide-react";

// Mock data
const mockLessons = [
  {
    id: "1",
    title: "Mathematics Advanced",
    subject: "VCE Math Methods 3/4",
    date: "2024-07-22",
    time: "2:00 PM",
    location: "Room 101",
    type: "in-person" as const,
    instructor: "Dr. Sarah Johnson",
    students: 8
  },
  {
    id: "2",
    title: "English Literature Review",
    subject: "VCE English 3/4",
    date: "2024-07-23",
    time: "10:00 AM",
    location: "Virtual Classroom",
    type: "online" as const,
    instructor: "Prof. Michael Chen",
    students: 12
  }
];

const mockResources = [
  { id: "1", title: "Calculus Practice Problems", subject: "Math Methods", type: "PDF", uploadDate: "2024-07-20" },
  { id: "2", title: "Essay Writing Guide", subject: "English", type: "Video", uploadDate: "2024-07-19" },
  { id: "3", title: "Chemistry Lab Report Template", subject: "Chemistry", type: "PDF", uploadDate: "2024-07-18" }
];

export const StudentDashboard = () => {
  return (
    <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">Welcome back, Student!</h1>
          <p className="text-xl text-muted-foreground">Ready to excel in your VCE studies?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          <StatCard
            title="Upcoming Lessons"
            value={mockLessons.length}
            description="This week"
            icon={Calendar}
            gradient
          />
          <StatCard
            title="Subjects Enrolled"
            value="5"
            description="Active subjects"
            icon={BookOpen}
            color="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Lessons */}
          <UpcomingLessons lessons={mockLessons} userRole="student" />

          {/* Recent Resources */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Recent Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {resource.type === "Video" ? (
                      <Video className="w-5 h-5 text-primary" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary" />
                    )}
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {resource.subject} • {resource.uploadDate}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { subject: "VCE Math Methods 3/4", progress: 75, color: "bg-primary" },
                { subject: "VCE English 3/4", progress: 82, color: "bg-success" },
                { subject: "VCE Chemistry 3/4", progress: 68, color: "bg-warning" },
                { subject: "VCE Physics 3/4", progress: 71, color: "bg-primary" }
              ].map((item) => (
                <div key={item.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.subject}</span>
                    <span className="text-muted-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}; 