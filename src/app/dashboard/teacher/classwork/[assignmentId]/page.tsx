
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { teacherAssignments, assignmentSubmissions } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, BookCheck, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import type { Submission } from '@/lib/data';

export default function GradeAssignmentPage({ params }: { params: { assignmentId: string } }) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();
  
  const assignment = teacherAssignments.find((a) => a.id === params.assignmentId);
  const submissions = assignmentSubmissions.filter((s) => s.assignmentId === params.assignmentId);

  if (!assignment) {
    return <div>Assignment not found</div>;
  }
  
  const handleGradeSubmission = () => {
    toast({
      title: "Grade Submitted",
      description: `The grade for ${selectedSubmission?.student.name} has been recorded.`,
    });
    setSelectedSubmission(null);
  }

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/teacher/classwork">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classwork
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold font-headline">{assignment.title}</h1>
        <p className="text-muted-foreground">Due: {format(parseISO(assignment.dueDate), 'MMMM d, yyyy')} - Max Points: {assignment.maxPoints}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>Review submissions and enter grades.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={sub.student.avatarUrl} alt={sub.student.name} />
                          <AvatarFallback>{getInitials(sub.student.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{sub.student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(parseISO(sub.submittedAt), 'MMM d, h:mm a')}</TableCell>
                    <TableCell>
                       <Badge variant={sub.status === 'graded' ? 'default' : 'secondary'}>
                        {sub.status === 'graded' ? <BookCheck className="mr-2 h-4 w-4"/> : <Clock className="mr-2 h-4 w-4"/>}
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {sub.grade ? `${sub.grade} / ${assignment.maxPoints}` : '--'}
                    </TableCell>
                    <TableCell className="text-right">
                       <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedSubmission(sub)}>
                           {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                          </Button>
                       </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           </div>
        </CardContent>
      </Card>
      
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={(isOpen) => !isOpen && setSelectedSubmission(null)}>
           <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Grade Submission</DialogTitle>
              <DialogDescription>
                Reviewing submission from <span className="font-semibold">{selectedSubmission.student.name}</span> for <span className="font-semibold">{assignment.title}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="p-4 bg-muted rounded-md border">
                 <p className="text-sm text-muted-foreground">Student's submitted work would be displayed here for review. This could be text, a link to a file, or an embedded document.</p>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="grade" className="text-right">
                   Grade
                 </Label>
                 <Input id="grade" type="number" className="col-span-1" placeholder="--" defaultValue={selectedSubmission.grade} />
                 <span className="col-span-2 text-muted-foreground">/ {assignment.maxPoints} points</span>
               </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="feedback" className="text-right pt-2">
                  Feedback
                </Label>
                <Textarea id="feedback" className="col-span-3" placeholder="Provide constructive feedback..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setSelectedSubmission(null)}>Cancel</Button>
              <Button type="submit" onClick={handleGradeSubmission}>
                <Check className="mr-2 h-4 w-4" />
                Submit Grade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
