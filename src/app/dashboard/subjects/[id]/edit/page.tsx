import { notFound, redirect } from "next/navigation";
import { fetchSubjectById } from "@/lib/subject-actions";
import { SubjectForm } from "@/components/subjects/SubjectForm";
import { createClient } from "@/lib/supabase-server";

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

interface EditSubjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSubjectPage({ params }: EditSubjectPageProps) {
  const supabase = await createClient()
  
  // Check authentication and permissions (secure method)
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  let userRole: string = 'student' // Default fallback

  // Get session only to extract user role from access token
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    const decodedToken = decodeJWT(session.access_token)
    if (decodedToken && decodedToken.user_role) {
      userRole = decodedToken.user_role
    }
  }

  // Only allow admins to edit subjects
  if (userRole !== 'admin') {
    redirect('/dashboard/subjects')
  }

  const { id } = await params;
  const subject = await fetchSubjectById(id);

  if (!subject) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SubjectForm subject={subject} isEdit={true} />
    </div>
  );
} 