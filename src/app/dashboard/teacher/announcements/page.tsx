
'use client';

import { useState } from "react";
import { announcements, classLists, teacherProfile } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function TeacherAnnouncementsPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const myClasses = classLists.filter(cl => cl.course.teacher.id === teacherProfile.id);

  const handleCreateAnnouncement = () => {
    // In a real app, this would submit to a server action/API
    toast({
      title: "Announcement Posted",
      description: "Your new announcement has been successfully posted.",
    });
    setOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Announcements</h1>
          <p className="text-muted-foreground">Create and view announcements for your students.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Compose a new announcement for the entire school or a specific class.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" placeholder="e.g. Upcoming Field Trip"/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea id="content" className="col-span-3" placeholder="Enter announcement details..." />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">
                  Audience
                </Label>
                 <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school-wide">School-wide</SelectItem>
                    {myClasses.map(cl => (
                      <SelectItem key={cl.id} value={cl.id}>{cl.course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Options</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox id="notify-parents" />
                  <Label htmlFor="notify-parents" className="font-normal">
                    Notify Parents
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleCreateAnnouncement}>Post Announcement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Posted Announcements</h2>
        {announcements.map((ann) => (
          <Card key={ann.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{ann.title}</CardTitle>
                {ann.classId ? (
                   <Badge variant="secondary">
                    <School className="mr-2 h-4 w-4" />
                    {classLists.find(cl => cl.course.id === ann.classId)?.course.name || "Class Specific"}
                  </Badge>
                ) : (
                  <Badge variant="outline">School-wide</Badge>
                )}
              </div>
              <CardDescription>
                Posted on {format(new Date(ann.date), 'MMMM d, yyyy')} by {ann.author.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ann.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
