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
      setAttachments(prev => [...prev, { type: 'link', name: linkUrl, url: linkUrl }]);
      setLinkUrl('');
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-headline">Create Assignment</h1>
        </div>
        <Button onClick={handleCreateAssignment}>Create Assignment</Button>
      </header>

      <main className="flex-1 p-6 grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-lg">Title</Label>
                  <Input id="title" placeholder="e.g. Chapter 5 Reading Quiz" className="text-2xl p-6" />
                </div>
                <div>
                  <Label htmlFor="description">Instructions</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter assignment instructions..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Attachments
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Label htmlFor="file-upload" className="flex-1">
                    <Button variant="outline" className="w-full" asChild>
                      <span><Upload className="mr-2 h-4 w-4" /> Upload File</span>
                    </Button>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple />
                  </Label>
                  <div className="flex-1 flex gap-2">
                    <Input 
                      placeholder="Add a web link" 
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                    />
                    <Button onClick={handleAddLink}><LinkIcon className="mr-2 h-4 w-4" /> Add Link</Button>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((att, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                        <div className="flex items-center gap-2 truncate">
                          {att.type === 'file' ? <Upload className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                          <span className="truncate">{att.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
