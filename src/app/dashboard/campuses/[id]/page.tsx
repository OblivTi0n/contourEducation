import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { getCampusById } from '@/lib/campus-actions'
import {
  Building,
  MapPin,
  ExternalLink,
  Edit,
  ArrowLeft,
  Calendar,
} from 'lucide-react'

interface CampusDetailPageProps {
  params: {
    id: string
  }
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  maintenance: "bg-yellow-100 text-yellow-800",
} as const;

function InfoItem({ 
  icon: Icon, 
  label, 
  value,
  href
}: { 
  icon: React.ComponentType<any>, 
  label: string, 
  value: string | null | undefined,
  href?: string
}) {
  if (!value) return null;
  
  const content = (
    <div className="flex items-start space-x-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm break-words">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="hover:bg-muted/50 p-2 rounded-lg transition-colors">
        {content}
      </a>
    );
  }

  return content;
}

export default async function CampusDetailPage({ params }: CampusDetailPageProps) {
  try {
    const campus = await getCampusById(params.id)
    
    const getStatusBadge = (status: string) => {
      const normalizedStatus = status.toLowerCase() as keyof typeof statusColors;
      const colorClass = statusColors[normalizedStatus] || "bg-gray-100 text-gray-800";
      
      return (
        <Badge className={colorClass}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <DashboardLayout userRole="admin">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/campuses">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Campuses
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{campus.name}</h1>
                  {getStatusBadge(campus.status)}
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href={`/dashboard/campuses/${campus.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Campus
              </Link>
            </Button>
          </div>

          {/* Campus Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Campus Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoItem icon={Building} label="Campus Name" value={campus.name} />
                  <InfoItem icon={Calendar} label="Created" value={formatDate(campus.created_at)} />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div className="mt-1">{getStatusBadge(campus.status)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                <InfoItem icon={MapPin} label="Address" value={campus.address} />
                {campus.google_maps_link && (
                  <InfoItem 
                    icon={ExternalLink} 
                    label="Google Maps" 
                    value="Open in Google Maps"
                    href={campus.google_maps_link}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link href={`/dashboard/campuses/${campus.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Campus
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/campuses">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Campuses
                  </Link>
                </Button>
                {campus.google_maps_link && (
                  <Button variant="outline" asChild>
                    <a href={campus.google_maps_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Maps
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error('Error loading campus:', error)
    notFound()
  }
} 