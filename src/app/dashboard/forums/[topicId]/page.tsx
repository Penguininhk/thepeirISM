'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forums, forumTopics } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ForumTopicPage({ params }: { params: { topicId: string } }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const forum = forums.find((f) => f.id === params.topicId);
  const topics = forumTopics.filter((t) => t.forumId === params.topicId);

  if (!forum) {
    return <div>Forum not found</div>;
  }
  
  const handleCreateThread = () => {
    toast({
      title: "Thread Created",
      description: "Your new discussion thread has been posted.",
    });
    setOpen(false);
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/forums">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Forums
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">{forum.title}</h1>
          <p className="text-muted-foreground">{forum.description}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Thread
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
              <DialogDescription>
                Create a new thread in the "{forum.title}" forum.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" placeholder="e.g. Question about homework"/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Message
                </Label>
                <Textarea id="content" className="col-span-3" placeholder="Start the conversation..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleCreateThread}>Post Thread</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Topic</TableHead>
                  <TableHead className="text-center">Replies</TableHead>
                  <TableHead className="text-center">Last Post</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell>
                      <div className="font-medium hover:underline cursor-pointer">{topic.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        by 
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={topic.author.avatarUrl} alt={topic.author.name} />
                          <AvatarFallback>{getInitials(topic.author.name)}</AvatarFallback>
                        </Avatar>
                        {topic.author.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{topic.replyCount}</TableCell>
                    <TableCell className="text-center">
                        <div className="text-sm">
                            {formatDistanceToNow(new Date(topic.lastPost.timestamp), { addSuffix: true })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            by {topic.lastPost.author.name}
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
