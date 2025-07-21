import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserById } from '@/lib/user-actions'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import {
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  Edit,
  ArrowLeft,
  Briefcase,
  BookOpen,
  Crown,
} from 'lucide-react'

// Helper function to decode JWT and extract claims
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

interface UserDetailPageProps {
  params: {
    id: string
  }
}

const roleColors = {
  admin: "bg-red-100 text-red-800",
  tutor: "bg-blue-100 text-blue-800",
  student: "bg-green-100 text-green-800",
} as const;

function InfoItem({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ComponentType<{ className?: string }>, 
  label: string, 
  value: string | number | null | undefined 
}) {
  if (!value) return null;
  
  return (
    <div className="flex items-start space-x-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const supabase = await createClient()
  
  // Check authentication and permissions
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    redirect('/login')
  }

  let userRole: string = 'student' // Default fallback
  const currentUserId = session.user.id

  // Decode JWT to extract user role
  if (session.access_token) {
    const decodedToken = decodeJWT(session.access_token)
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role
    }
  }

  // Authorization check: 
  // - Admins can view all users
  // - Tutors can view all users but only edit their own profile
  // - Students can only view their own profile
  if (userRole === 'student' && currentUserId !== params.id) {
    redirect('/dashboard')
  }

  try {
    const user = await getUserById(params.id)
    
    const getUserFullName = () => {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No name';
    };

    const getUserInitials = () => {
      const firstName = user.first_name?.charAt(0) || '';
      const lastName = user.last_name?.charAt(0) || '';
      return (firstName + lastName).toUpperCase() || '?';
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {userRole === 'admin' ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/users">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Users
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{getUserFullName()}</h1>
                  <Badge className={roleColors[user.role]}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            {/* Only show edit button if user is admin or viewing their own profile */}
            {(userRole === 'admin' || currentUserId === params.id) && (
              <Button asChild>
                <Link href={`/dashboard/users/${user.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  {currentUserId === params.id ? 'Edit Profile' : 'Edit User'}
                </Link>
              </Button>
            )}
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoItem icon={User} label="Full Name" value={getUserFullName()} />
                  <InfoItem icon={Mail} label="Contact Email" value={user.contact_email} />
                  <InfoItem icon={Phone} label="Phone Number" value={user.phone_number} />
                </div>
                <div className="space-y-4">
                  <InfoItem icon={Users} label="Role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
                  <InfoItem icon={School} label="School" value={user.school_name} />
                  {user.role === 'student' && user.vce_year_level && (
                    <InfoItem icon={GraduationCap} label="VCE Year Level" value={`Year ${user.vce_year_level}`} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-specific Information */}
          {user.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <School className="w-5 h-5" />
                  <span>Student Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoItem icon={School} label="School Name" value={user.school_name} />
                    <InfoItem icon={GraduationCap} label="VCE Year Level" value={user.vce_year_level ? `Year ${user.vce_year_level}` : undefined} />
                  </div>
                </div>
                
                {(user.parent_guardian_name || user.parent_guardian_email || user.parent_guardian_phone) && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Parent/Guardian Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoItem icon={User} label="Name" value={user.parent_guardian_name} />
                      <InfoItem icon={Mail} label="Email" value={user.parent_guardian_email} />
                      <InfoItem icon={Phone} label="Phone" value={user.parent_guardian_phone} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {user.role === 'tutor' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Tutor Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem icon={Briefcase} label="Job Title" value={user.job_title} />
                {user.bio && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Bio</p>
                    <p className="text-sm leading-relaxed">{user.bio}</p>
                  </div>
                )}
                {user.qualifications && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Qualifications</p>
                    <div className="text-sm">
                      {JSON.stringify(user.qualifications, null, 2)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Subject Assignments */}
          {(user.role === 'tutor' || user.role === 'student') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>
                    {user.role === 'tutor' ? 'Subject Assignments' : 'Subject Enrolments'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.role === 'tutor' && user.tutor_subjects && user.tutor_subjects.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      Subjects this tutor is currently Tutoring
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.tutor_subjects.map((assignment) => (
                        <div
                          key={assignment.subject_id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">
                              {assignment.subject.code} - {assignment.subject.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                            </div>
                          </div>
                          {assignment.is_lead_tutor && (
                            <Badge variant="default" className="text-xs flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              Lead Tutor
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : user.role === 'student' && user.enrolments && user.enrolments.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      Subjects this student is enrolled in
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.enrolments.map((enrolment) => (
                        <div
                          key={enrolment.subject_id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">
                              {enrolment.subject.code} - {enrolment.subject.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Enrolled: {new Date(enrolment.enrol_date).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge 
                            variant={enrolment.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {enrolment.status.charAt(0).toUpperCase() + enrolment.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {user.role === 'tutor' 
                        ? 'No subjects assigned' 
                        : 'No subjects enrolled'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Emergency Contact */}
          {(user.emergency_contact_name || user.emergency_contact_phone) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem icon={User} label="Name" value={user.emergency_contact_name} />
                  <InfoItem icon={Phone} label="Phone" value={user.emergency_contact_phone} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                {/* Only show edit button if user is admin or viewing their own profile */}
                {(userRole === 'admin' || currentUserId === params.id) && (
                  <Button asChild>
                    <Link href={`/dashboard/users/${user.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      {currentUserId === params.id ? 'Edit Profile' : 'Edit User'}
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link href={userRole === 'admin' ? '/dashboard/users' : '/dashboard'}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {userRole === 'admin' ? 'Back to Users' : 'Back to Dashboard'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    )
  } catch (error) {
    console.error('Error loading user:', error)
    notFound()
  }
} 