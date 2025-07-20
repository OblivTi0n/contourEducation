"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export interface Subject {
  id: string;
  code: string;
  title: string;
  created_at: string;
}

export interface SubjectWithTutors extends Subject {
  tutor_subjects: Array<{
    tutor_id: string;
    is_lead_tutor: boolean;
    assigned_at: string;
    profiles: {
      id: string;
      first_name: string;
      last_name: string;
      role: string;
    };
  }>;
}

export interface TutorSubjectAssignment {
  tutor_id: string;
  subject_id: string;
  is_lead_tutor: boolean;
  assigned_at: string;
}

// Fetch subjects with optional filters
export async function fetchSubjects(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortBy: string = "title",
  sortOrder: "asc" | "desc" = "asc"
): Promise<{ data: SubjectWithTutors[]; count: number; totalPages: number }> {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from("subjects")
    .select(`
      *,
      tutor_subjects(
        tutor_id,
        is_lead_tutor,
        assigned_at,
        profiles!tutor_subjects_tutor_id_fkey(
          id,
          first_name,
          last_name,
          role
        )
      )
    `)
    .range(offset, offset + limit - 1);

  // Apply search filter
  if (search) {
    query = query.or(`code.ilike.%${search}%,title.ilike.%${search}%`);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching subjects:", error);
    throw new Error("Failed to fetch subjects");
  }

  // Get total count for pagination
  let countQuery = supabase
    .from("subjects")
    .select("*", { count: "exact", head: true });

  if (search) {
    countQuery = countQuery.or(`code.ilike.%${search}%,title.ilike.%${search}%`);
  }

  const { count: totalCount } = await countQuery;

  return {
    data: data || [],
    count: totalCount || 0,
    totalPages: Math.ceil((totalCount || 0) / limit)
  };
}

// Fetch single subject by ID
export async function fetchSubjectById(id: string): Promise<SubjectWithTutors | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subjects")
    .select(`
      *,
      tutor_subjects(
        tutor_id,
        is_lead_tutor,
        assigned_at,
        profiles!tutor_subjects_tutor_id_fkey(
          id,
          first_name,
          last_name,
          role
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching subject:", error);
    return null;
  }

  return data;
}

// Create new subject
export async function createSubject(subjectData: {
  code: string;
  title: string;
}): Promise<{ success: boolean; error?: string; data?: Subject }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subjects")
    .insert([subjectData])
    .select()
    .single();

  if (error) {
    console.error("Error creating subject:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/subjects");
  return { success: true, data };
}

// Update subject
export async function updateSubject(
  id: string,
  subjectData: {
    code: string;
    title: string;
  }
): Promise<{ success: boolean; error?: string; data?: Subject }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subjects")
    .update(subjectData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating subject:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/subjects");
  revalidatePath(`/dashboard/subjects/${id}`);
  return { success: true, data };
}

// Delete subject
export async function deleteSubject(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting subject:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/subjects");
  return { success: true };
}

// Fetch available tutors (profiles with role 'tutor')
export async function fetchAvailableTutors(): Promise<Array<{
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, role")
    .eq("role", "tutor")
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Error fetching tutors:", error);
    return [];
  }

  return data || [];
}

// Assign tutor to subject
export async function assignTutorToSubject(
  tutorId: string,
  subjectId: string,
  isLeadTutor: boolean = false
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tutor_subjects")
    .insert([{
      tutor_id: tutorId,
      subject_id: subjectId,
      is_lead_tutor: isLeadTutor
    }]);

  if (error) {
    console.error("Error assigning tutor to subject:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/subjects");
  revalidatePath(`/dashboard/subjects/${subjectId}`);
  return { success: true };
}

// Remove tutor from subject
export async function removeTutorFromSubject(
  tutorId: string,
  subjectId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tutor_subjects")
    .delete()
    .eq("tutor_id", tutorId)
    .eq("subject_id", subjectId);

  if (error) {
    console.error("Error removing tutor from subject:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/subjects");
  revalidatePath(`/dashboard/subjects/${subjectId}`);
  return { success: true };
}

// Update tutor's lead status for a subject
export async function updateTutorLeadStatus(
  tutorId: string,
  subjectId: string,
  isLeadTutor: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tutor_subjects")
    .update({ is_lead_tutor: isLeadTutor })
    .eq("tutor_id", tutorId)
    .eq("subject_id", subjectId);

  if (error) {
    console.error("Error updating tutor lead status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/subjects");
  revalidatePath(`/dashboard/subjects/${subjectId}`);
  return { success: true };
} 