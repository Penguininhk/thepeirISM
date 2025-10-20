
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { teacherAssignments, studentProfile, users, privateComments } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Paperclip, Link as LinkIcon, Plus, Send, User } from "lucide-react";
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { PrivateComment } from '@/lib/data';

export default function StudentAssignmentDetailPage({ params }: { params: { assignmentId: string } }) {
  const resolvedParams = use(params);
  const { assignmentId } = resolvedParams;
  const router = useRouter();
  const { toast } = useToast();

  const [assignment, setAssignment] = useState<typeof teacherAssignments[0] | undefined>();
  const [comments, setComments] = useState<PrivateComment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (assignmentId) {
      const foundAssignment = teacherAssignments.find(a => a.id === assignmentId);
      setAssignment(foundAssignment);
      const relatedComments = privateComments.filter(c => c.assignmentId === assignmentId && c.studentId === studentProfile.id);
      setComments(relatedComments);
    }
  }, [assignmentId]);

  if (!assignment) {
    return <div>Loading...</div>;
  }
  
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would be a server action
      setComments(prev => [...prev, {
        id: `comment-${Date.now()}`,
        assignmentId,
        studentId: studentProfile.id,
        authorId: studentProfile.id,
        content: newComment,
        timestamp: new Date().toISOString(),
      }]);
      setNewComment('');
      toast({ title: "Comment posted." });
    }
  };
  
  const handleSubmitWork = () => {
     toast({ title: "Assignment Turned In!", description: "Your work has been submitted to the teacher." });
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Button variant="outline" size="sm" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Classwork
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Main Assignment Details */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-full">
                <User className="h-6 w-6"/>
            </div>
            <div>
                <h1 className="text-3xl font-bold font-headline">{assignment.title}</h1>
                <p className="text-muted-foreground">
                    {assignment.course.name} &middot; Due {format(new Date(assignment.dueDate), 'MMMM d, yyyy')}
                </p>
                <p className="font-semibold mt-1">{assignment.maxPoints} points</p>
            </div>
          </div>

          <Separator />

          <p className="text-foreground/90 whitespace-pre-wrap">{assignment.instructions}</p>

          {/* Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="space-y-3">
              {assignment.attachments.map((att, index) => (
                <a key={index} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-3 flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-md">
                        {att.type === 'link' ? <LinkIcon className="h-5 w-5 text-primary"/> : <Paperclip className="h-5 w-5 text-primary"/>}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{att.name}</p>
                        <p className="text-sm text-muted-foreground">{att.type === 'link' ? 'Web Link' : 'File'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Your Work Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add or create
              </Button>
              <Button className="w-full" onClick={handleSubmitWork}>Mark as done</Button>
            </CardContent>
          </Card>

          {/* Private Comments Card */}
          <Card>
            <CardHeader>
              <CardTitle>Private Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {comments.map(comment => {
                  const author = users.find(u => u.id === comment.authorId);
                  return (
                     <div key={comment.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={author?.avatarUrl} />
                            <AvatarFallback>{author ? getInitials(author.name) : 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{author?.name}</p>
                            <p className="text-sm">{comment.content}</p>
                        </div>
                     </div>
                  )
                })}
              </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
