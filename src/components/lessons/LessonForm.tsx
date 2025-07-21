"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  X, 
  Plus,
  Save,
  ArrowLeft
} from "lucide-react";
import { Lesson, CreateLessonData, UpdateLessonData } from "@/lib/lesson-actions";
import { createClient } from "@/lib/supabase";

interface LessonFormProps {
  lesson?: Lesson;
  mode: "create" | "edit";
  subjects: Array<{ id: string; code: string; title: string }>;
  campuses: Array<{ id: string; name: string }>;
  rooms: Array<{ id: string; name: string; campus_id: string }>;
  availableTutors: Array<{ id: string; first_name?: string; last_name?: string }>;
  enrolledStudents: Array<{ id: string; first_name?: string; last_name?: string }>;
  onSubmit: (data: CreateLessonData | UpdateLessonData) => Promise<void>;
  isSubmitting?: boolean;
}

export const LessonForm: React.FC<LessonFormProps> = ({
  lesson,
  mode,
  subjects,
  campuses,
  rooms,
  availableTutors,
  enrolledStudents,
  onSubmit,
  isSubmitting = false,
}) => {
  const router = useRouter();
  const supabase = createClient();
  
  // Form state
  const [formData, setFormData] = useState({
    subject_id: lesson?.subject_id || "",
    title: lesson?.title || "",
    start_time: lesson?.start_time ? lesson.start_time.slice(0, 16) : "",
    end_time: lesson?.end_time ? lesson.end_time.slice(0, 16) : "",
    location: lesson?.location || "",
    campus_id: lesson?.campus_id || "",
    room_id: lesson?.room_id || "",
    location_detail: lesson?.location_detail || "",
    status: lesson?.status || "scheduled" as const,
  });
  
  const [selectedTutors, setSelectedTutors] = useState<string[]>(
    lesson?.tutors?.map(t => t.id) || []
  );
  
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    lesson?.students?.map(s => s.id) || []
  );
  
  // Filtered participants based on selected subject
  const [filteredTutors, setFilteredTutors] = useState(availableTutors);
  const [filteredStudents, setFilteredStudents] = useState(enrolledStudents);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  
  const [isOnline, setIsOnline] = useState(!!lesson?.location_detail);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter rooms based on selected campus
  const availableRooms = rooms.filter(room => 
    !formData.campus_id || room.campus_id === formData.campus_id
  );

  // Client-side function to get tutors for a subject
  const getTutorsForSubject = async (subjectId: string) => {
    try {
      const { data: tutorSubjects } = await supabase
        .from('tutor_subjects')
        .select('tutor_id')
        .eq('subject_id', subjectId);
      
      const tutorIds = tutorSubjects?.map(ts => ts.tutor_id) || [];
      
      if (tutorIds.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('role', 'tutor')
        .in('id', tutorIds)
        .order('first_name');
      
      if (error) {
        console.error('Error fetching tutors for subject:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching tutors for subject:', error);
      return [];
    }
  };

  // Client-side function to get students for a subject
  const getStudentsForSubject = async (subjectId: string) => {
    try {
      const { data: enrolments } = await supabase
        .from('enrolments')
        .select('student_id')
        .eq('subject_id', subjectId)
        .eq('status', 'active');
      
      const studentIds = enrolments?.map(e => e.student_id) || [];
      
      if (studentIds.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('role', 'student')
        .in('id', studentIds)
        .order('first_name');
      
      if (error) {
        console.error('Error fetching students for subject:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching students for subject:', error);
      return [];
    }
  };

  // Fetch subject-specific tutors and students when subject changes
  useEffect(() => {
    const fetchSubjectParticipants = async () => {
      if (!formData.subject_id) {
        setFilteredTutors([]);
        setFilteredStudents([]);
        return;
      }

      setIsLoadingParticipants(true);
      try {
        const [subjectTutors, subjectStudents] = await Promise.all([
          getTutorsForSubject(formData.subject_id),
          getStudentsForSubject(formData.subject_id)
        ]);

        setFilteredTutors(subjectTutors);
        setFilteredStudents(subjectStudents);
      } catch (error) {
        console.error('Error fetching subject participants:', error);
        // Use empty arrays on error
        setFilteredTutors([]);
        setFilteredStudents([]);
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    fetchSubjectParticipants();
  }, [formData.subject_id]);

  // Clear selections when subject changes (except in edit mode with existing lesson)
  useEffect(() => {
    if (mode === "create" || (mode === "edit" && formData.subject_id !== lesson?.subject_id)) {
      // Clear selections that are no longer valid for the new subject
      setSelectedTutors(prev => prev.filter(tutorId => 
        filteredTutors.some(tutor => tutor.id === tutorId)
      ));
      setSelectedStudents(prev => prev.filter(studentId => 
        filteredStudents.some(student => student.id === studentId)
      ));
    }
  }, [filteredTutors, filteredStudents, mode, formData.subject_id, lesson?.subject_id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.subject_id) newErrors.subject_id = "Subject is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    
    if (formData.start_time && formData.end_time) {
      const start = new Date(formData.start_time);
      const end = new Date(formData.end_time);
      
      if (start >= end) {
        newErrors.end_time = "End time must be after start time";
      }
      
      if (start < new Date()) {
        newErrors.start_time = "Start time cannot be in the past";
      }
    }
    
    if (!isOnline) {
      if (!formData.campus_id) newErrors.campus_id = "Campus is required for in-person lessons";
      if (!formData.room_id) newErrors.room_id = "Room is required for in-person lessons";
    } else {
      if (!formData.location_detail?.trim()) {
        newErrors.location_detail = "Meeting link is required for online lessons";
      }
    }
    
    if (selectedTutors.length === 0) {
      newErrors.tutors = "At least one tutor must be assigned";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const submitData: CreateLessonData | UpdateLessonData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        campus_id: isOnline ? undefined : formData.campus_id || undefined,
        room_id: isOnline ? undefined : formData.room_id || undefined,
        location_detail: isOnline ? formData.location_detail : undefined,
        tutor_ids: selectedTutors,
        student_ids: selectedStudents,
      };
      
      if (mode === "edit" && lesson) {
        (submitData as UpdateLessonData).id = lesson.id;
      }
      
      await onSubmit(submitData);
      
      // Redirect after successful submission
      router.push("/dashboard/lessons");
    } catch (error) {
      console.error("Error submitting lesson:", error);
      setErrors({ submit: "Failed to save lesson. Please try again." });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If start_time changes and end_time is now invalid, clear end_time
      if (field === 'start_time' && prev.end_time && value) {
        const startTime = new Date(value);
        const endTime = new Date(prev.end_time);
        if (endTime <= startTime) {
          newData.end_time = '';
        }
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    // Clear end_time error if start_time changes and makes end_time invalid
    if (field === 'start_time' && errors.end_time) {
      setErrors(prev => ({ ...prev, end_time: "" }));
    }
  };

  const handleLocationTypeChange = (online: boolean) => {
    setIsOnline(online);
    if (online) {
      setFormData(prev => ({ ...prev, campus_id: "", room_id: "", location: "" }));
    } else {
      setFormData(prev => ({ ...prev, location_detail: "" }));
    }
    setErrors(prev => ({ 
      ...prev, 
      campus_id: "", 
      room_id: "", 
      location_detail: "" 
    }));
  };

  const toggleTutor = (tutorId: string) => {
    setSelectedTutors(prev => 
      prev.includes(tutorId) 
        ? prev.filter(id => id !== tutorId)
        : [...prev, tutorId]
    );
    if (errors.tutors) {
      setErrors(prev => ({ ...prev, tutors: "" }));
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const getUserDisplayName = (user: { first_name?: string; last_name?: string }) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.first_name || user.last_name || "Unknown User";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {mode === "create" ? "Schedule New Lesson" : "Edit Lesson"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create" 
              ? "Create a new lesson and assign participants" 
              : "Update lesson details and manage participants"
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject_id">Subject *</Label>
              {subjects.length === 0 ? (
                <div className="p-3 border border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    No subjects available. Please contact an administrator to assign subjects to you.
                  </p>
                </div>
              ) : (
                <Select 
                  value={formData.subject_id} 
                  onValueChange={(value) => handleInputChange("subject_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.code} - {subject.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.subject_id && (
                <p className="text-sm text-destructive">{errors.subject_id}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Introduction to Calculus"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange("start_time", e.target.value)}
                />
                {errors.start_time && (
                  <p className="text-sm text-destructive">{errors.start_time}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time *</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  min={formData.start_time || new Date().toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange("end_time", e.target.value)}
                />
                {errors.end_time && (
                  <p className="text-sm text-destructive">{errors.end_time}</p>
                )}
              </div>
            </div>

            {/* Status (only for edit mode) */}
            {mode === "edit" && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "scheduled" | "completed" | "cancelled") => 
                    handleInputChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location Type */}
            <div className="space-y-3">
              <Label>Lesson Type</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="in-person"
                    name="location-type"
                    checked={!isOnline}
                    onChange={() => handleLocationTypeChange(false)}
                  />
                  <Label htmlFor="in-person">In-Person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="online"
                    name="location-type"
                    checked={isOnline}
                    onChange={() => handleLocationTypeChange(true)}
                  />
                  <Label htmlFor="online">Online</Label>
                </div>
              </div>
            </div>

            {isOnline ? (
              /* Online lesson fields */
              <div className="space-y-2">
                <Label htmlFor="location_detail">Meeting Link *</Label>
                <Input
                  id="location_detail"
                  value={formData.location_detail}
                  onChange={(e) => handleInputChange("location_detail", e.target.value)}
                  placeholder="https://zoom.us/j/..."
                />
                {errors.location_detail && (
                  <p className="text-sm text-destructive">{errors.location_detail}</p>
                )}
              </div>
            ) : (
              /* In-person lesson fields */
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campus_id">Campus *</Label>
                  <Select 
                    value={formData.campus_id} 
                    onValueChange={(value) => {
                      handleInputChange("campus_id", value);
                      // Reset room when campus changes
                      setFormData(prev => ({ ...prev, room_id: "" }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses.map((campus) => (
                        <SelectItem key={campus.id} value={campus.id}>
                          {campus.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.campus_id && (
                    <p className="text-sm text-destructive">{errors.campus_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room_id">Room *</Label>
                  <Select 
                    value={formData.room_id} 
                    onValueChange={(value) => handleInputChange("room_id", value)}
                    disabled={!formData.campus_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.room_id && (
                    <p className="text-sm text-destructive">{errors.room_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Additional Location Details</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Building A, Level 2"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formData.subject_id 
                ? "Select tutors assigned to this subject and enrolled students"
                : "Please select a subject first to see available participants"
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tutors */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Assigned Tutors *</Label>
                <Badge variant="secondary">
                  {selectedTutors.length} selected
                </Badge>
              </div>
              
              {isLoadingParticipants ? (
                <p className="text-sm text-muted-foreground">Loading tutors...</p>
              ) : !formData.subject_id ? (
                <p className="text-sm text-muted-foreground">
                  Select a subject to see available tutors
                </p>
              ) : filteredTutors.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tutors assigned to this subject
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {filteredTutors.map((tutor) => (
                    <div key={tutor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tutor-${tutor.id}`}
                        checked={selectedTutors.includes(tutor.id)}
                        onCheckedChange={() => toggleTutor(tutor.id)}
                      />
                      <Label htmlFor={`tutor-${tutor.id}`} className="text-sm">
                        {getUserDisplayName(tutor)}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.tutors && (
                <p className="text-sm text-destructive">{errors.tutors}</p>
              )}
            </div>

            {/* Students */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Enrolled Students</Label>
                <Badge variant="secondary">
                  {selectedStudents.length} selected
                </Badge>
              </div>
              
              {isLoadingParticipants ? (
                <p className="text-sm text-muted-foreground">Loading students...</p>
              ) : !formData.subject_id ? (
                <p className="text-sm text-muted-foreground">
                  Select a subject to see enrolled students
                </p>
              ) : filteredStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No students enrolled in this subject
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleStudent(student.id)}
                      />
                      <Label htmlFor={`student-${student.id}`} className="text-sm">
                        {getUserDisplayName(student)}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || subjects.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting 
              ? "Saving..." 
              : mode === "create" 
                ? "Schedule Lesson" 
                : "Update Lesson"
            }
          </Button>
        </div>

        {errors.submit && (
          <p className="text-sm text-destructive text-center">{errors.submit}</p>
        )}
      </form>
    </div>
  );
}; 