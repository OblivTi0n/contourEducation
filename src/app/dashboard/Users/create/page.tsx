import { UserForm } from '@/components/users/UserForm'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function CreateUserPage() {
  return (
    <DashboardLayout userRole="admin">
      <UserForm mode="create" />
    </DashboardLayout>
  )
} 