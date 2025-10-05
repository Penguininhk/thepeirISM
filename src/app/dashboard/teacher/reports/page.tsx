'use client';

import * as React from 'react';
import { reportCards, classLists, teacherProfile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Check, Send, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ReportCard, Student } from '@/lib/data';

const semesters = ['Fall 2023', 'Spring 2024'];

export default function TeacherReportsPage() {
  const { toast } = useToast();
  const myClasses = classLists.filter(
    (cl) => cl.course.teacher.id === teacherProfile.id
  );

  const [selectedClassId, setSelectedClassId] = React.useState(myClasses[0]?.id || '');
  const [selectedSemester, setSelectedSemester] = React.useState(semesters[0]);
  const [editingReport, setEditingReport] = React.useState<ReportCard | null>(null);

  const selectedClass = myClasses.find((cl) => cl.id === selectedClassId);

  const getStudentReport = (studentId: string): ReportCard | undefined => {
    return reportCards.find(
      (r) =>
        r.student.id === studentId &&
        r.classId === selectedClassId &&
        r.semester === selectedSemester
    );
  };
  
  const handleSaveDraft = (studentName: string) => {
    toast({
      title: 'Draft Saved',
      description: `Report card draft for ${studentName} has been saved.`,
    });
  };

  const handleSubmitReview = (studentName: string) => {
    toast({
      title: 'Submitted for Review',
      description: `Report card for ${studentName} sent to administration.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Write Report Cards</h1>
          <p className="text-muted-foreground">Select a class and semester to begin.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select onValueChange={setSelectedClassId} value={selectedClassId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {myClasses.map((cl) => (
                <SelectItem key={cl.id} value={cl.id}>
                  {cl.course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedSemester} value={selectedSemester}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedClass ? (
        <div className="grid gap-6 md:grid-cols-2">
          {selectedClass.students.map((student) => {
            const report = getStudentReport(student.id);
            return (
              <ReportCardForm 
                key={student.id} 
                student={student}
                report={report} 
                onSave={handleSaveDraft} 
                onSubmit={handleSubmitReview}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">Please select a class to view report card forms.</p>
      )}
    </div>
  );
}

interface ReportCardFormProps {
  student: Student | { id: string; name: string };
  report?: ReportCard;
  onSave: (studentName: string) => void;
  onSubmit: (studentName: string) => void;
}

function ReportCardForm({ student, report, onSave, onSubmit }: ReportCardFormProps) {
  const isEditable = !report || report.status === 'draft';
  return (
     <Card className={cn(!isEditable && "bg-muted/50")}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>Enter grade and comments below.</CardDescription>
            </div>
            {report && (
              <Badge variant={report.status === 'released' ? 'default' : report.status === 'pending_review' ? 'secondary' : 'outline'}>
                {report.status.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="w-24">
              <label htmlFor={`grade-${student.id}`} className="text-sm font-medium">Grade</label>
              <Input id={`grade-${student.id}`} defaultValue={report?.grade} placeholder="e.g. A-" disabled={!isEditable} />
            </div>
            <div className="flex-1">
               <label htmlFor={`comments-${student.id}`} className="text-sm font-medium">Comments</label>
              <Textarea id={`comments-${student.id}`} defaultValue={report?.comments} placeholder="Write your comments..." className="min-h-[100px]" disabled={!isEditable}/>
            </div>
          </div>
          {isEditable && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onSave(student.name)}>
                <Edit className="mr-2 h-4 w-4" /> Save Draft
              </Button>
              <Button size="sm" onClick={() => onSubmit(student.name)}>
                <Send className="mr-2 h-4 w-4" /> Submit for Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
  )
}
