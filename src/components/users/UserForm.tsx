"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  Briefcase,
  FileText,
  Users,
  Save,
  X,
  BookOpen,
  Crown,
} from "lucide-react";
import { 
  CreateUserData, 
  UpdateUserData, 
  UserProfile, 
  UserRole, 
  SubjectAssignment,
  StudentEnrolment,
  createUser, 
  updateUser,
  getAvailableSubjects,
  assignTutorToSubjects,
  enrollStudentInSubjects
} from "@/lib/user-actions";

interface UserFormProps {
  user?: UserProfile;
  mode: 'create' | 'edit';
}

interface FormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  contact_email: string;
  phone_number: string;
  school_name: string;
  vce_year_level: number | undefined;
  parent_guardian_name: string;
  parent_guardian_email: string;
  parent_guardian_phone: string;
  job_title: string;
  bio: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

interface Subject {
  id: string;
  code: string;
  title: string;
}

const initialFormData: FormData = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: 'student',
  contact_email: '',
  phone_number: '',
  school_name: '',
  vce_year_level: undefined,
  parent_guardian_name: '',
  parent_guardian_email: '',
  parent_guardian_phone: '',
  job_title: '',
  bio: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
};

export function UserForm({ user, mode }: UserFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>(() => {
    if (mode === 'edit' && user) {
      return {
        email: user.contact_email || '',
        password: '', // Never pre-fill password
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role,
        contact_email: user.contact_email || '',
        phone_number: user.phone_number || '',
        school_name: user.school_name || '',
        vce_year_level: user.vce_year_level || undefined,
        parent_guardian_name: user.parent_guardian_name || '',
        parent_guardian_email: user.parent_guardian_email || '',
        parent_guardian_phone: user.parent_guardian_phone || '',
        job_title: user.job_title || '',
        bio: user.bio || '',
        emergency_contact_name: user.emergency_contact_name || '',
        emergency_contact_phone: user.emergency_contact_phone || '',
      };
    }
    
    // For create mode, check if role is pre-selected via search params
    const preSelectedRole = searchParams.get('role') as UserRole;
    return {
      ...initialFormData,
      role: preSelectedRole || 'student'
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Subject assignment state
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [tutorSubjects, setTutorSubjects] = useState<SubjectAssignment[]>([]);
  const [studentEnrolments, setStudentEnrolments] = useState<StudentEnrolment[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  // Load available subjects on component mount
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setIsLoadingSubjects(true);
        const subjects = await getAvailableSubjects();
        setAvailableSubjects(subjects || []);
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  // Initialize subject assignments for edit mode
  useEffect(() => {
    if (mode === 'edit' && user) {
      // Initialize tutor subjects
      if (user.role === 'tutor' && user.tutor_subjects && Array.isArray(user.tutor_subjects)) {
        const mappedTutorSubjects = user.tutor_subjects.map(ts => ({
          subject_id: ts.subject_id,
          is_lead_tutor: ts.is_lead_tutor
        }));
        setTutorSubjects(mappedTutorSubjects);
      } else if (user.role === 'tutor') {
        setTutorSubjects([]);
      }
      
      // Initialize student enrolments
      if (user.role === 'student' && user.enrolments && Array.isArray(user.enrolments)) {
        const mappedEnrolments = user.enrolments.map(e => ({
          subject_id: e.subject_id,
          status: e.status
        }));
        setStudentEnrolments(mappedEnrolments);
      } else if (user.role === 'student') {
        setStudentEnrolments([]);
      }
    }
  }, [mode, user]);

  // Debug logging
  useEffect(() => {
    console.log('UserForm Debug:', {
      mode,
      userRole: user?.role,
      userEnrolments: user?.enrolments,
      userTutorSubjects: user?.tutor_subjects,
      studentEnrolments,
      tutorSubjects,
      availableSubjects: availableSubjects.length,
      isLoadingSubjects
    });
  }, [mode, user, studentEnrolments, tutorSubjects, availableSubjects, isLoadingSubjects]);

  // Clear subject assignments when role changes
  useEffect(() => {
    setTutorSubjects([]);
    setStudentEnrolments([]);
  }, [formData.role]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields for all users
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address';
    }

    // Password validation for create mode
    if (mode === 'create') {
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Account email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Role-specific validations
    if (formData.role === 'student') {
      if (!formData.school_name.trim()) {
        newErrors.school_name = 'School name is required for students';
      }
      if (formData.vce_year_level && (formData.vce_year_level < 7 || formData.vce_year_level > 12)) {
        newErrors.vce_year_level = 'VCE year level must be between 7 and 12';
      }
    }

    if (formData.role === 'tutor') {
      if (!formData.bio.trim()) {
        newErrors.bio = 'Bio is required for tutors';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        if (mode === 'create') {
          const createData: CreateUserData = {
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
            contact_email: formData.contact_email || formData.email,
            phone_number: formData.phone_number || undefined,
            school_name: formData.school_name || undefined,
            vce_year_level: formData.vce_year_level || undefined,
            parent_guardian_name: formData.parent_guardian_name || undefined,
            parent_guardian_email: formData.parent_guardian_email || undefined,
            parent_guardian_phone: formData.parent_guardian_phone || undefined,
            job_title: formData.job_title || undefined,
            bio: formData.bio || undefined,
            emergency_contact_name: formData.emergency_contact_name || undefined,
            emergency_contact_phone: formData.emergency_contact_phone || undefined,
          };
          const createdUser = await createUser(createData);
          
          // Handle subject assignments for newly created user
          if (formData.role === 'tutor' && tutorSubjects.length > 0) {
            await assignTutorToSubjects(createdUser.id, tutorSubjects);
          } else if (formData.role === 'student' && studentEnrolments.length > 0) {
            await enrollStudentInSubjects(createdUser.id, studentEnrolments);
          }
        } else if (user) {
          const updateData: UpdateUserData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
            contact_email: formData.contact_email,
            phone_number: formData.phone_number || undefined,
            school_name: formData.school_name || undefined,
            vce_year_level: formData.vce_year_level || undefined,
            parent_guardian_name: formData.parent_guardian_name || undefined,
            parent_guardian_email: formData.parent_guardian_email || undefined,
            parent_guardian_phone: formData.parent_guardian_phone || undefined,
            job_title: formData.job_title || undefined,
            bio: formData.bio || undefined,
            emergency_contact_name: formData.emergency_contact_name || undefined,
            emergency_contact_phone: formData.emergency_contact_phone || undefined,
          };
          await updateUser(user.id, updateData);
          
          // Handle subject assignments for updated user
          if (formData.role === 'tutor') {
            await assignTutorToSubjects(user.id, tutorSubjects);
          } else if (formData.role === 'student') {
            await enrollStudentInSubjects(user.id, studentEnrolments);
          }
        }
        
        router.push('/dashboard/users');
        router.refresh();
      } catch (error) {
        console.error('Error saving user:', error);
        setErrors({ submit: 'Failed to save user. Please try again.' });
      }
    });
  };

  const updateFormData = (field: keyof FormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getUserInitials = () => {
    const firstName = formData.first_name?.charAt(0) || '';
    const lastName = formData.last_name?.charAt(0) || '';
    return (firstName + lastName).toUpperCase() || '?';
  };

  const roleColors = {
    admin: "bg-red-100 text-red-800",
    tutor: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
  } as const;

  // Subject assignment helper functions
  const handleTutorSubjectToggle = (subjectId: string) => {
    setTutorSubjects(prev => {
      const exists = prev.find(ts => ts.subject_id === subjectId);
      if (exists) {
        return prev.filter(ts => ts.subject_id !== subjectId);
      } else {
        return [...prev, { subject_id: subjectId, is_lead_tutor: false }];
      }
    });
  };

  const handleTutorLeadToggle = (subjectId: string) => {
    setTutorSubjects(prev =>
      prev.map(ts =>
        ts.subject_id === subjectId
          ? { ...ts, is_lead_tutor: !ts.is_lead_tutor }
          : ts
      )
    );
  };

  const handleStudentEnrolmentToggle = (subjectId: string) => {
    setStudentEnrolments(prev => {
      const exists = prev.find(e => e.subject_id === subjectId);
      if (exists) {
        return prev.filter(e => e.subject_id !== subjectId);
      } else {
        return [...prev, { subject_id: subjectId, status: 'active' }];
      }
    });
  };

  const handleStudentStatusChange = (subjectId: string, status: 'active' | 'completed' | 'dropped') => {
    setStudentEnrolments(prev =>
      prev.map(e =>
        e.subject_id === subjectId
          ? { ...e, status }
          : e
      )
    );
  };

  const isSubjectAssignedToTutor = (subjectId: string) => {
    return tutorSubjects.some(ts => ts.subject_id === subjectId);
  };

  const isTutorLeadForSubject = (subjectId: string) => {
    const assignment = tutorSubjects.find(ts => ts.subject_id === subjectId);
    return assignment?.is_lead_tutor || false;
  };

  const isStudentEnrolledInSubject = (subjectId: string) => {
    return studentEnrolments.some(e => e.subject_id === subjectId);
  };

  const getStudentEnrolmentStatus = (subjectId: string) => {
    const enrolment = studentEnrolments.find(e => e.subject_id === subjectId);
    return enrolment?.status || 'active';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'create' 
              ? 'Add a new user to the system' 
              : `Update information for ${formData.first_name} ${formData.last_name}`
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          {formData.role && (
            <Badge className={roleColors[formData.role]}>
              {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  placeholder="Enter first name"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  placeholder="Enter last name"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value: UserRole) => updateFormData('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => updateFormData('contact_email', e.target.value)}
                  placeholder="Enter contact email"
                />
                {errors.contact_email && (
                  <p className="text-sm text-red-600">{errors.contact_email}</p>
                )}
              </div>
            </div>

            {mode === 'create' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Account Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="Enter account login email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => updateFormData('phone_number', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Role-specific fields */}
        {formData.role === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <School className="w-5 h-5" />
                <span>Student Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school_name">School Name *</Label>
                  <Input
                    id="school_name"
                    value={formData.school_name}
                    onChange={(e) => updateFormData('school_name', e.target.value)}
                    placeholder="Enter school name"
                  />
                  {errors.school_name && (
                    <p className="text-sm text-red-600">{errors.school_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vce_year_level">VCE Year Level</Label>
                  <Select 
                    value={formData.vce_year_level?.toString() || ''} 
                    onValueChange={(value) => updateFormData('vce_year_level', value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Year 7</SelectItem>
                      <SelectItem value="8">Year 8</SelectItem>
                      <SelectItem value="9">Year 9</SelectItem>
                      <SelectItem value="10">Year 10</SelectItem>
                      <SelectItem value="11">Year 11</SelectItem>
                      <SelectItem value="12">Year 12</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.vce_year_level && (
                    <p className="text-sm text-red-600">{errors.vce_year_level}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parent_guardian_name">Parent/Guardian Name</Label>
                  <Input
                    id="parent_guardian_name"
                    value={formData.parent_guardian_name}
                    onChange={(e) => updateFormData('parent_guardian_name', e.target.value)}
                    placeholder="Enter parent/guardian name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent_guardian_email">Parent/Guardian Email</Label>
                  <Input
                    id="parent_guardian_email"
                    type="email"
                    value={formData.parent_guardian_email}
                    onChange={(e) => updateFormData('parent_guardian_email', e.target.value)}
                    placeholder="Enter parent/guardian email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent_guardian_phone">Parent/Guardian Phone</Label>
                  <Input
                    id="parent_guardian_phone"
                    value={formData.parent_guardian_phone}
                    onChange={(e) => updateFormData('parent_guardian_phone', e.target.value)}
                    placeholder="Enter parent/guardian phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {formData.role === 'tutor' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>Tutor Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => updateFormData('job_title', e.target.value)}
                  placeholder="e.g., Mathematics Teacher, PhD Student"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  placeholder="Tell us about your teaching experience, qualifications, and expertise..."
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-sm text-red-600">{errors.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject Assignments for Tutors */}
        {formData.role === 'tutor' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Subject Assignments</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select the subjects this tutor is qualified to teach
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingSubjects ? (
                <p className="text-sm text-muted-foreground">Loading subjects...</p>
              ) : availableSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subjects available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableSubjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`tutor-subject-${subject.id}`}
                        checked={isSubjectAssignedToTutor(subject.id)}
                        onCheckedChange={() => handleTutorSubjectToggle(subject.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`tutor-subject-${subject.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {subject.code} - {subject.title}
                        </label>
                        {isSubjectAssignedToTutor(subject.id) && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                              id={`lead-tutor-${subject.id}`}
                              checked={isTutorLeadForSubject(subject.id)}
                              onCheckedChange={() => handleTutorLeadToggle(subject.id)}
                            />
                            <label
                              htmlFor={`lead-tutor-${subject.id}`}
                              className="text-xs text-muted-foreground cursor-pointer flex items-center"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Lead tutor for this subject
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tutorSubjects.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    Selected Subjects ({tutorSubjects.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tutorSubjects.map((assignment) => {
                      const subject = availableSubjects.find(s => s.id === assignment.subject_id);
                      if (!subject) return null;
                      return (
                        <Badge key={assignment.subject_id} variant="secondary">
                          {subject.code}
                          {assignment.is_lead_tutor && (
                            <Crown className="w-3 h-3 ml-1" />
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Subject Enrolments for Students */}
        {formData.role === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Subject Enrolments</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select the subjects this student is enrolled in
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingSubjects ? (
                <p className="text-sm text-muted-foreground">Loading subjects...</p>
              ) : availableSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subjects available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableSubjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`student-subject-${subject.id}`}
                        checked={isStudentEnrolledInSubject(subject.id)}
                        onCheckedChange={() => handleStudentEnrolmentToggle(subject.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`student-subject-${subject.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {subject.code} - {subject.title}
                        </label>
                        {isStudentEnrolledInSubject(subject.id) && (
                          <div className="mt-2">
                            <Select
                              value={getStudentEnrolmentStatus(subject.id)}
                              onValueChange={(status: 'active' | 'completed' | 'dropped') =>
                                handleStudentStatusChange(subject.id, status)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="dropped">Dropped</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {studentEnrolments.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    Enrolled Subjects ({studentEnrolments.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {studentEnrolments.map((enrolment) => {
                      const subject = availableSubjects.find(s => s.id === enrolment.subject_id);
                      if (!subject) return null;
                      return (
                        <Badge 
                          key={enrolment.subject_id} 
                          variant={enrolment.status === 'active' ? 'default' : 'secondary'}
                        >
                          {subject.code} ({enrolment.status})
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact (for all users) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Emergency Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => updateFormData('emergency_contact_name', e.target.value)}
                  placeholder="Enter emergency contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => updateFormData('emergency_contact_phone', e.target.value)}
                  placeholder="Enter emergency contact phone"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <div className="flex items-center space-x-3">
            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            )}
            <Button type="submit" disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending 
                ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                : (mode === 'create' ? 'Create User' : 'Update User')
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 