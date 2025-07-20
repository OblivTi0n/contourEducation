import { CampusForm } from '@/components/campuses/CampusForm'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function CreateCampusPage() {
  return (
    <DashboardLayout userRole="admin">
      <CampusForm mode="create" />
    </DashboardLayout>
  )
} 