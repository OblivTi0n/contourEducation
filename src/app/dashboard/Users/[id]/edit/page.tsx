import { notFound } from 'next/navigation'
import { UserForm } from '@/components/users/UserForm'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { getUserById } from '@/lib/user-actions'

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  try {
    const user = await getUserById(params.id)
    
    return (
      <DashboardLayout userRole="admin">
        <UserForm user={user} mode="edit" />
      </DashboardLayout>
    )
  } catch (error) {
    console.error('Error loading user:', error)
    notFound()
  }
} 