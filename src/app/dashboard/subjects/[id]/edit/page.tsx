import { notFound } from "next/navigation";
import { fetchSubjectById } from "@/lib/subject-actions";
import { SubjectForm } from "@/components/subjects/SubjectForm";

interface EditSubjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditSubjectPage({ params }: EditSubjectPageProps) {
  const subject = await fetchSubjectById(params.id);

  if (!subject) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SubjectForm subject={subject} isEdit={true} />
    </div>
  );
} 