import { notFound } from 'next/navigation'
import { UserForm } from '@/components/users/UserForm'
import { getUserById } from '@/lib/user-actions'

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  try {
    const user = await getUserById(params.id)
    
    return <UserForm user={user} mode="edit" />
  } catch (error) {
    console.error('Error loading user:', error)
    notFound()
  }
} 