
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Paperclip, Link as LinkIcon, Upload, X } from 'lucide-react';
import { teacherProfile, classLists } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type Attachment = {
  type: 'file' | 'link';
  name: string;
  url?: string;
};

export default function NewAssignmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [linkUrl, setLinkUrl] = useState('');

  const myClasses = classLists.filter(cl => teacherProfile.courses.some(c => c.id === cl.course.id));

  const handleCreateAssignment = () => {
    // In a real app, this would submit all the form data
    toast({
      title: 'Assignment Created',
      description: 'The new assignment has been posted for your students.',
    });
    router.push('/dashboard/teacher/classwork');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        type: 'file' as const,
        name: file.name,
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleAddLink = () => {
    if (linkUrl && linkUrl.trim() !== '') {
      try {
        const url = new URL(linkUrl);
        setAttachments(prev => [...prev, { type: 'link', name: url.hostname, url: url.href }]);
        setLinkUrl('');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid URL",
          description: "Please enter a valid web address.",
        });
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col bg-muted/20">
      <header className="flex items-center justify-between p-4 border-b bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold font-headline hidden sm:block">Create Assignment</h1>
        </div>
        <Button onClick={handleCreateAssignment}>Assign</Button>
      </header>

      <main className="flex-1 p-6 grid md:grid-cols-3 gap-6 overflow-y-auto">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="sr-only">Title</Label>
                  <Input id="title" placeholder="e.g. Chapter 5 Reading Quiz" className="text-2xl p-6 border-0 shadow-none focus-visible:ring-0" />
                </div>
                 <Separator />
                <div>
                  <Label htmlFor="description" className="sr-only">Instructions</Label>
                  <Textarea
                    id="description"
                    placeholder="Instructions (optional)"
                    className="min-h-[200px] border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                <Paperclip className="h-5 w-5" />
                Attachments
              </h3>
              <div className="space-y-4">
                 {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((att, index) => (
                      <div key={index} className="flex items-center justify-between p-2 pl-4 bg-muted/50 border rounded-md text-sm">
                        <div className="flex items-center gap-3 truncate">
                          {att.type === 'file' ? <Paperclip className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                          <span className="truncate font-medium">{att.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeAttachment(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Label htmlFor="file-upload" className="flex-1">
                    <Button variant="outline" className="w-full" asChild>
                      <span><Upload className="mr-2 h-4 w-4" /> File</span>
                    </Button>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple />
                  </Label>
                  <div className="flex-1 flex gap-2">
                    <Input 
                      placeholder="Add a web link" 
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                    />
                    <Button onClick={handleAddLink}><LinkIcon className="mr-2 h-4 w-4" /> Add</Button>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="class">For</Label>
                <Select>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {myClasses.map(cl => (
                      <SelectItem key={cl.id} value={cl.id}>{cl.course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input id="points" type="number" placeholder="e.g. 100" />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
