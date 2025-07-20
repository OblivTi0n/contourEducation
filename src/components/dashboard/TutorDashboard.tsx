"use client";

import { StatCard } from "./StatCard";
import { UpcomingLessons } from "./UpcomingLessons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, BookOpen, Clock, Plus, Upload } from "lucide-react";

// Mock data
const mockLessons = [
  {
    id: "1",
    title: "VCE Math Methods - Calculus",
    subject: "Math Methods 3/4",
    date: "2024-07-22",
    time: "2:00 PM",
    location: "Room 101",
    type: "in-person" as const,
    instructor: "You",
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
    instructor: "You",
    students: 12
  },
  {
    id: "3",
    title: "VCE Math Methods - Functions",
    subject: "Math Methods 3/4",
    date: "2024-07-23",
    time: "10:00 AM",
    location: "Room 102",
    type: "in-person" as const,
    instructor: "You",
    students: 6
  }
];

const mockStudents = [
  { id: "1", name: "Emma Wilson", subjects: ["Math Methods", "Chemistry"] },
  { id: "2", name: "James Parker", subjects: ["Math Methods"] },
  { id: "3", name: "Sophie Chen", subjects: ["Chemistry"] },
  { id: "4", name: "Alex Thompson", subjects: ["Math Methods", "Chemistry"] }
];

export const TutorDashboard = () => {
  return (
    <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">Welcome back, Tutor!</h1>
          <p className="text-xl text-muted-foreground">Ready to inspire your students today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <StatCard
            title="Today's Lessons"
            value={mockLessons.filter(l => l.date === "2024-07-22").length}
            description="Scheduled for today"
            icon={Calendar}
            gradient
          />
          <StatCard
            title="Total Students"
            value={mockStudents.length}
            description="Active students"
            icon={Users}
            color="success"
          />
          <StatCard
            title="Subjects Teaching"
            value="2"
            description="Math & Chemistry"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="h-20 flex-col space-y-2">
                <Plus className="w-6 h-6" />
                <span>Schedule Lesson</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Upload className="w-6 h-6" />
                <span>Upload Resources</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Lessons */}
          <UpcomingLessons lessons={mockLessons} userRole="tutor" />

          {/* Student Overview */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>My Students</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <div className="flex items-center space-x-2">
                        {student.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Students
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLessons
                .filter(lesson => lesson.date === "2024-07-22")
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((lesson) => (
                <div key={lesson.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{lesson.time.split(':')[0]}</div>
                    <div className="text-sm text-muted-foreground">{lesson.time.split(' ')[1]}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {lesson.location} • {lesson.students} students
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Start</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}; 