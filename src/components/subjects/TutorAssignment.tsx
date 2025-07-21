"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  UserMinus,
  Crown,
  ArrowLeft,
  Loader2,
  Users,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import {
  assignTutorToSubject,
  removeTutorFromSubject,
  updateTutorLeadStatus,
  fetchAvailableTutors,
  type SubjectWithTutors
} from "@/lib/subject-actions";

interface TutorAssignmentProps {
  subject: SubjectWithTutors;
  availableTutors: Array<{
    id: string;
    first_name: string;
    last_name: string;
    role: string;
  }>;
}

export const TutorAssignment = ({ subject, availableTutors }: TutorAssignmentProps) => {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState<string>("");
  const [isLeadTutor, setIsLeadTutor] = useState(false);

  // Get tutors not assigned to this subject
  const assignedTutorIds = subject.tutor_subjects.map(ts => ts.tutor_id);
  const unassignedTutors = availableTutors.filter(tutor => 
    !assignedTutorIds.includes(tutor.id)
  );

  const handleAssignTutor = async () => {
    if (!selectedTutorId) return;

    startTransition(async () => {
      const result = await assignTutorToSubject(selectedTutorId, subject.id, isLeadTutor);
      if (result.success) {
        setDialogOpen(false);
        setSelectedTutorId("");
        setIsLeadTutor(false);
        window.location.reload();
      } else {
        alert(`Failed to assign tutor: ${result.error}`);
      }
    });
  };

  const handleRemoveTutor = async (tutorId: string, tutorName: string) => {
    if (!confirm(`Are you sure you want to remove ${tutorName} from this subject?`)) {
      return;
    }

    startTransition(async () => {
      const result = await removeTutorFromSubject(tutorId, subject.id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(`Failed to remove tutor: ${result.error}`);
      }
    });
  };

  const handleToggleLeadStatus = async (tutorId: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await updateTutorLeadStatus(tutorId, subject.id, !currentStatus);
      if (result.success) {
        window.location.reload();
      } else {
        alert(`Failed to update lead status: ${result.error}`);
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <h1 className="text-3xl font-bold">Manage Tutors</h1>
          <p className="text-muted-foreground">
            Assign tutors to {subject.code} - {subject.title}
          </p>
        </div>
      </div>

      {/* Subject Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Subject Information</span>
            <Badge variant="outline" className="font-mono">
              {subject.code}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Title:</span> {subject.title}
            </div>
            <div>
              <span className="font-medium">Created:</span> {formatDate(subject.created_at)}
            </div>
            <div>
              <span className="font-medium">Assigned Tutors:</span> {subject.tutor_subjects.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Tutors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Assigned Tutors ({subject.tutor_subjects.length})
            </span>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Tutor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Tutor to Subject</DialogTitle>
                  <DialogDescription>
                    Select a tutor to assign to {subject.code} - {subject.title}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {unassignedTutors.length === 0 ? (
                    <div className="text-center py-4">
                      <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        All available tutors are already assigned to this subject.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="tutor-select">Select Tutor</Label>
                        <Select value={selectedTutorId} onValueChange={setSelectedTutorId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a tutor..." />
                          </SelectTrigger>
                          <SelectContent>
                            {unassignedTutors.map((tutor) => (
                              <SelectItem key={tutor.id} value={tutor.id}>
                                {tutor.first_name} {tutor.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lead-tutor"
                          checked={isLeadTutor}
                          onCheckedChange={(checked) => setIsLeadTutor(checked === true)}
                        />
                        <Label htmlFor="lead-tutor" className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Set as Lead Tutor
                        </Label>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleAssignTutor} 
                          disabled={!selectedTutorId || isPending}
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Assigning...
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Assign Tutor
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subject.tutor_subjects.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tutors assigned</h3>
              <p className="text-muted-foreground mb-4">
                Assign tutors to this subject to enable lesson scheduling.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subject.tutor_subjects
                .filter((assignment) => assignment.profiles !== null)
                .map((assignment) => (
                <div
                  key={assignment.tutor_id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">
                        {assignment.profiles.first_name} {assignment.profiles.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Assigned: {formatDate(assignment.assigned_at)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        Tutor
                      </Badge>
                      {assignment.is_lead_tutor && (
                        <Badge variant="default" className="text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Lead
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => 
                        handleToggleLeadStatus(assignment.tutor_id, assignment.is_lead_tutor)
                      }
                      disabled={isPending}
                    >
                      <Crown className="w-4 h-4 mr-1" />
                      {assignment.is_lead_tutor ? "Remove Lead" : "Make Lead"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => 
                        handleRemoveTutor(
                          assignment.tutor_id, 
                          `${assignment.profiles.first_name} ${assignment.profiles.last_name}`
                        )
                      }
                      disabled={isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <UserMinus className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tutor Assignment Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">Lead Tutors</h4>
            <p className="text-sm text-muted-foreground">
              Lead tutors have primary responsibility for the subject and can make decisions 
              about lesson planning and curriculum. You can have multiple lead tutors per subject.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Regular Tutors</h4>
            <p className="text-sm text-muted-foreground">
              Regular tutors assist with lesson delivery and student support. They can be assigned 
              to specific lessons within the subject.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Managing Assignments</h4>
            <p className="text-sm text-muted-foreground">
              You can promote tutors to lead status or remove them entirely. Changes take effect 
              immediately and will be reflected in lesson assignments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 