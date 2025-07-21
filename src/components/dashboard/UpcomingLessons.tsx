"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  type: "in-person" | "online";
  instructor: string;
  students: number;
}

interface UpcomingLessonsProps {
  lessons: Lesson[];
  userRole: "admin" | "tutor" | "student";
}

export const UpcomingLessons: React.FC<UpcomingLessonsProps> = ({
  lessons,
  userRole,
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span>Upcoming Lessons</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lessons.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No lessons scheduled for today</p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="lesson-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{lesson.title}</h4>
                  <p className="text-sm text-muted-foreground">{lesson.subject}</p>
                </div>
                <Badge variant={lesson.type === "online" ? "default" : "secondary"} className="modern-badge">
                  {lesson.type === "online" ? (
                    <Video className="w-3 h-3 mr-1" />
                  ) : (
                    <MapPin className="w-3 h-3 mr-1" />
                  )}
                  {lesson.type}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{lesson.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{lesson.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{lesson.students} students</span>
                </div>
                <div className="text-muted-foreground">
                  {lesson.instructor}
                </div>
              </div>

              {userRole === "admin" && (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost">
                    Join
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
        
        <Button className="w-full" variant="outline" asChild>
          <Link href="/dashboard/lessons">
            View All Lessons
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}; 