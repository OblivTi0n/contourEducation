import { notFound } from "next/navigation";
import { fetchSubjectById, fetchAvailableTutors } from "@/lib/subject-actions";
import { TutorAssignment } from "@/components/subjects/TutorAssignment";

interface TutorAssignmentPageProps {
  params: {
    id: string;
  };
}

export default async function TutorAssignmentPage({ params }: TutorAssignmentPageProps) {
  const [subject, availableTutors] = await Promise.all([
    fetchSubjectById(params.id),
    fetchAvailableTutors(),
  ]);

  if (!subject) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TutorAssignment 
        subject={subject} 
        availableTutors={availableTutors} 
      />
    </div>
  );
} 