
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { teacherAssignments, assignmentSubmissions, users, privateComments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Send, Paperclip, Link as LinkIcon, Users, HeartHandshake } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import type { Submission, Assignment, PrivateComment } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function GradeAssignmentPage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = use(params);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const { toast } = useToast();
  
  const [assignment, setAssignment] = useState<Assignment | undefined>(undefined);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [comments, setComments] = useState<PrivateComment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (assignmentId) {
      setAssignment(teacherAssignments.find((a) => a.id === assignmentId));
      setSubmissions(assignmentSubmissions.filter((s) => s.assignmentId === assignmentId));
    }
  }, [assignmentId]);

  useEffect(() => {
    if (selectedStudent && assignmentId) {
      const relatedComments = privateComments.filter(c => c.assignmentId === assignmentId && c.studentId === selectedStudent.id);
      setComments(relatedComments);
    } else {
      setComments([]);
    }
    setNewComment('');
  }, [selectedStudent, assignmentId]);

  if (!assignment) {
    return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading assignment...</div>;
  }
  
  const handleReturnGrade = (notifyParent: boolean) => {
    toast({
      title: "Grade Returned",
      description: `The grade for ${selectedStudent?.name} has been returned.${notifyParent ? ' The parent has also been notified.' : ''}`,
    });
    setSelectedStudent(null);
  }

  const handleAddComment = () => {
    if (newComment.trim() && selectedStudent && assignmentId) {
      setComments(prev => [...prev, {
        id: `comment-${Date.now()}`,
        assignmentId,
        studentId: selectedStudent.id,
        authorId: 'usr-teach-001',
        content: newComment,
        timestamp: new Date().toISOString(),
      }]);
      setNewComment('');
      toast({ title: "Comment posted." });
    }
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  const studentList = Array.from(new Set(assignmentSubmissions.filter(s => s.assignmentId === assignmentId).map(s => s.student.id)))
    .map(studentId => {
        const submission = assignmentSubmissions.find(s => s.student.id === studentId && s.assignmentId === assignmentId);
        return {
            ...submission?.student,
            status: submission?.status || 'pending',
            grade: submission?.grade
        }
    });

  const submission = selectedStudent ? submissions.find(s => s.student.id === selectedStudent.id) : null;
  
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))]">
      <div className="w-64 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b">
            <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
                <Link href="/dashboard/teacher/classwork">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
            </Button>
            <h1 className="text-lg font-bold font-headline truncate">{assignment.title}</h1>
            <p className="text-sm text-muted-foreground">{assignment.course.name}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
            {studentList.map(student => (
                <button 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className={cn(
                        "w-full text-left p-3 border-b hover:bg-accent/50 transition-colors",
                        selectedStudent?.id === student.id && "bg-accent text-accent-foreground"
                    )}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{student.name}</span>
                        {student.grade !== undefined && <span className="text-xs font-bold">{student.grade}/{assignment.maxPoints}</span>}
                    </div>
                     <Badge variant={student.status === 'graded' ? 'default' : student.status === 'submitted' ? 'secondary' : 'outline'} className="mt-1 text-xs">
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                </button>
            ))}
        </div>
      </div>
      
      {selectedStudent ? (
        <div className="flex-1 flex md:grid md:grid-cols-3">
          <div className="flex-1 md:col-span-2 p-6 overflow-y-auto space-y-6">
            <h2 className="text-2xl font-bold">Submission from {selectedStudent.name}</h2>
             <div className="p-6 bg-muted rounded-lg border min-h-[300px]">
                 <p className="text-muted-foreground text-center">Student's submitted work would be displayed here for review.</p>
             </div>
             <div>
                <h3 className="font-semibold mb-2">Attachments from Teacher</h3>
                 {assignment.attachments && assignment.attachments.length > 0 ? (
                    <div className="space-y-3">
                        {assignment.attachments.map((att, index) => (
                            <a key={index} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                            <Card className="hover:bg-muted/50 transition-colors">
                                <CardContent className="p-3 flex items-center gap-4">
                                <div className="p-2 bg-muted rounded-md">
                                    {att.type === 'link' ? <LinkIcon className="h-5 w-5 text-primary"/> : <Paperclip className="h-5 w-5 text-primary"/>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-primary truncate">{att.name}</p>
                                    <p className="text-sm text-muted-foreground">{att.type === 'link' ? 'Web Link' : 'File'}</p>
                                </div>
                                </CardContent>
                            </Card>
                            </a>
                        ))}
                    </div>
                ) : <p className="text-sm text-muted-foreground">No attachments were provided.</p>}
             </div>
          </div>
          <div className="border-l bg-card p-4 space-y-6 flex flex-col">
              <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Grade</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <Input id="grade" type="number" className="text-lg w-24" placeholder="--" defaultValue={submission?.grade} />
                        <span className="text-lg text-muted-foreground">/ {assignment.maxPoints}</span>
                    </div>
                </CardContent>
              </Card>
               <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Private Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 overflow-y-auto pr-2">
                    {comments.map(comment => {
                    const author = users.find(u => u.id === comment.authorId);
                    return (
                        <div key={comment.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={author?.avatarUrl} />
                                <AvatarFallback>{author ? getInitials(author.name) : 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{author?.name}</p>
                                <p className="text-sm">{comment.content}</p>
                            </div>
                        </div>
                    )
                    })}
                </CardContent>
                <div className="p-4 border-t">
                    <div className="relative">
                        <Textarea 
                        placeholder="Add a private comment..."
                        className="pr-12"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button 
                        size="icon" 
                        className="absolute right-2 top-2 h-7 w-9"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        >
                        <Send className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
              </Card>
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleReturnGrade(false)}>
                  <Check className="mr-2 h-4 w-4" /> Return to Student
                </Button>
                <Button variant="secondary" onClick={() => handleReturnGrade(true)}>
                  <HeartHandshake className="mr-2 h-4 w-4" /> Return & Notify Parent
                </Button>
              </div>
          </div>
        </div>
      ) : (
         <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
            <div>
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-xl font-semibold">Select a student</h2>
                <p>Choose a student from the list to view their submission and start grading.</p>
            </div>
         </div>
      )}
    </div>
  );
}
