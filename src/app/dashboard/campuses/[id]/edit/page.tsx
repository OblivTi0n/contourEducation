import { notFound } from 'next/navigation'
import { CampusForm } from '@/components/campuses/CampusForm'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { getCampusById } from '@/lib/campus-actions'

interface EditCampusPageProps {
  params: {
    id: string
  }
}

export default async function EditCampusPage({ params }: EditCampusPageProps) {
  try {
    const campus = await getCampusById(params.id)
    
    return (
      <DashboardLayout userRole="admin">
        <CampusForm campus={campus} mode="edit" />
      </DashboardLayout>
    )
  } catch (error) {
    console.error('Error loading campus:', error)
    notFound()
  }
} 