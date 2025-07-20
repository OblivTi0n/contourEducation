import { notFound } from 'next/navigation'
import { CampusForm } from '@/components/campuses/CampusForm'
import { getCampusById } from '@/lib/campus-actions'

interface EditCampusPageProps {
  params: {
    id: string
  }
}

export default async function EditCampusPage({ params }: EditCampusPageProps) {
  try {
    const campus = await getCampusById(params.id)
    
    return <CampusForm campus={campus} mode="edit" />
  } catch (error) {
    console.error('Error loading campus:', error)
    notFound()
  }
} 