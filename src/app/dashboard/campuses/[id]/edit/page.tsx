import { notFound } from 'next/navigation'
import { CampusForm } from '@/components/campuses/CampusForm'
import { getCampusById } from '@/lib/campus-actions'

interface EditCampusPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCampusPage({ params }: EditCampusPageProps) {
  try {
    const { id } = await params
    const campus = await getCampusById(id)
    
    return <CampusForm campus={campus} mode="edit" />
  } catch (error) {
    console.error('Error loading campus:', error)
    notFound()
  }
} 