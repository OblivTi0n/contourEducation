import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserById } from '@/lib/user-actions'
import {
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  Calendar,
  MapPin,
  Edit,
  ArrowLeft,
  Users,
  Briefcase,
} from 'lucide-react'

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
  icon: React.ComponentType<any>, 
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
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/Users">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Users
                </Link>
              </Button>
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
            <Button asChild>
              <Link href={`/dashboard/Users/${user.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Link>
            </Button>
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
                <Button asChild>
                  <Link href={`/dashboard/Users/${user.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/Users">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Users
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