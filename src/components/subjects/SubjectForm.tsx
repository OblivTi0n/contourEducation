"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { createSubject, updateSubject, type Subject } from "@/lib/subject-actions";

interface SubjectFormProps {
  subject?: Subject;
  isEdit?: boolean;
}

interface FormData {
  code: string;
  title: string;
}

interface FormErrors {
  code?: string;
  title?: string;
  general?: string;
}

export const SubjectForm = ({ subject, isEdit = false }: SubjectFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState<FormData>({
    code: subject?.code || "",
    title: subject?.title || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate code
    if (!formData.code.trim()) {
      newErrors.code = "Subject code is required";
    } else if (formData.code.length < 2) {
      newErrors.code = "Subject code must be at least 2 characters";
    } else if (formData.code.length > 20) {
      newErrors.code = "Subject code must be less than 20 characters";
    } else if (!/^[A-Z0-9\s\/-]+$/i.test(formData.code)) {
      newErrors.code = "Subject code can only contain letters, numbers, spaces, hyphens, and forward slashes";
    }

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Subject title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Subject title must be at least 3 characters";
    } else if (formData.title.length > 200) {
      newErrors.title = "Subject title must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        const result = isEdit && subject
          ? await updateSubject(subject.id, {
              code: formData.code.trim(),
              title: formData.title.trim(),
            })
          : await createSubject({
              code: formData.code.trim(),
              title: formData.title.trim(),
            });

        if (result.success) {
          router.push("/dashboard/subjects");
        } else {
          setErrors({ general: result.error || "An error occurred" });
        }
      } catch (error) {
        setErrors({ general: "An unexpected error occurred" });
      }
    });
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/subjects">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Subject" : "Create Subject"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit 
              ? "Update the subject information below" 
              : "Add a new VCE subject to the system"
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Code */}
              <div className="space-y-2">
                <Label htmlFor="code">
                  Subject Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="e.g., MATH3/4, CHEM1/2"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  className={errors.code ? "border-destructive" : ""}
                  maxLength={20}
                />
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  A unique identifier for the subject (e.g., MATH3/4, CHEM1/2)
                </p>
              </div>

              {/* Subject Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Subject Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., VCE Mathematics Methods 3/4"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                  maxLength={200}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  The full name of the subject as it appears in course materials
                </p>
              </div>
            </div>

            {/* Character Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-xs text-muted-foreground text-right">
                {formData.code.length}/20 characters
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {formData.title.length}/200 characters
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" asChild>
                <Link href="/dashboard/subjects">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? "Update Subject" : "Create Subject"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subject Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">Subject Code Format</h4>
            <p className="text-sm text-muted-foreground">
              Use standard VCE subject codes like &quot;MATH3/4&quot;, &quot;CHEM1/2&quot;, &quot;ENG3/4&quot;. 
              Keep them short and consistent with VCE naming conventions.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Subject Title</h4>
            <p className="text-sm text-muted-foreground">
              Use the full official name of the subject. For example: &quot;VCE Mathematics Methods 3/4&quot;, 
              &quot;VCE Chemistry 1/2&quot;, &quot;VCE English 3/4&quot;.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">After Creation</h4>
            <p className="text-sm text-muted-foreground">
              Once created, you can assign tutors to this subject and manage their lead status. 
              Students can then be enrolled in the subject for lessons.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 