"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users, Video, Building } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, isToday } from "date-fns";
import { Lesson } from "@/lib/lesson-actions";

interface ScheduleCalendarProps {
  userRole: "student" | "tutor" | "admin";
  lessons: Lesson[];
}

export const ScheduleCalendar = ({ userRole, lessons }: ScheduleCalendarProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday start
  );

  const weekDays = useMemo(() => {
    const start = currentWeekStart;
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentWeekStart]);

  // Group lessons by day for the current week
  const lessonsByDay = useMemo(() => {
    const result: { [key: string]: Lesson[] } = {};
    
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      result[dayKey] = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.start_time);
        return isSameDay(lessonDate, day);
      }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    });
    
    return result;
  }, [lessons, weekDays]);

  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  const getLocationDisplay = (lesson: Lesson) => {
    if (lesson.location_detail) {
      return { text: 'Virtual Classroom', type: 'online' as const };
    }
    
    if (lesson.room?.name && lesson.campus?.name) {
      return { text: `${lesson.room.name}, ${lesson.campus.name}`, type: 'in-person' as const };
    }
    
    if (lesson.room?.name) {
      return { text: lesson.room.name, type: 'in-person' as const };
    }
    
    if (lesson.location) {
      return { text: lesson.location, type: 'in-person' as const };
    }
    
    return { text: 'Location TBA', type: 'in-person' as const };
  };

  const getInstructorName = (lesson: Lesson) => {
    if (lesson.tutors && lesson.tutors.length > 0) {
      const firstTutor = lesson.tutors[0];
      return `${firstTutor.first_name || ''} ${firstTutor.last_name || ''}`.trim() || 'Instructor';
    }
    return 'Instructor TBA';
  };

  const getStudentCount = (lesson: Lesson) => {
    return lesson.students?.length || 0;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Weekly Schedule</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Today
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentWeekStart, 'MMM dd')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayLessons = lessonsByDay[dayKey] || [];
            const dayName = format(day, 'EEEE');
            const dayDate = format(day, 'MMM dd');
            const isCurrentDay = isToday(day);
            
            return (
              <div key={dayKey} className="space-y-2">
                <div className={`text-center pb-2 border-b ${isCurrentDay ? 'border-primary' : ''}`}>
                  <h3 className={`font-semibold text-sm ${isCurrentDay ? 'text-primary' : ''}`}>
                    {dayName}
                  </h3>
                  <p className={`text-xs ${isCurrentDay ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {dayDate}
                  </p>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {dayLessons.map((lesson) => {
                    const location = getLocationDisplay(lesson);
                    const instructor = getInstructorName(lesson);
                    const studentCount = getStudentCount(lesson);
                    const timeDisplay = `${formatTime(lesson.start_time)} - ${formatTime(lesson.end_time)}`;
                    const duration = formatDuration(lesson.start_time, lesson.end_time);
                    
                    return (
                      <div
                        key={lesson.id}
                        className="p-3 rounded-lg border bg-gradient-to-br from-background to-muted/30 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/50"
                      >
                        <div className="space-y-2">
                          {lesson.subject && (
                            <Badge variant="secondary" className="text-xs">
                              {lesson.subject.code}
                            </Badge>
                          )}
                          <h4 className="font-medium text-sm leading-tight">{lesson.title}</h4>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{timeDisplay}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {location.type === 'online' ? (
                                <Video className="w-3 h-3 flex-shrink-0" />
                              ) : (
                                <Building className="w-3 h-3 flex-shrink-0" />
                              )}
                              <span className="truncate">{location.text}</span>
                            </div>
                            {userRole === "student" && (
                              <div className="text-xs font-medium text-foreground/80">
                                {instructor}
                              </div>
                            )}
                            {userRole !== "student" && studentCount > 0 && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3 flex-shrink-0" />
                                <span>{studentCount} student{studentCount !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Duration: {duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {dayLessons.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm p-4">
                      No lessons
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 