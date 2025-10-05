
'use client';

import { useState } from "react";
import Link from "next/link";
import { teacherProfile, teacherAssignments, classLists, assignmentSubmissions } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, ClipboardCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeacherClassworkPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const myClasses = classLists.filter(cl => cl.course.teacher.id === teacherProfile.id);
  const myAssignments = teacherAssignments.filter(assign => myClasses.some(cl => cl.course.id === assign.course.id));
  
  const assignmentsByCourse = myAssignments.reduce((acc, assignment) => {
    const courseName = assignment.course.name;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(assignment);
    return acc;
  }, {} as Record<string, typeof myAssignments>);

  const handleCreateAssignment = () => {
    toast({
      title: "Assignment Created",
      description: "The new assignment has been posted for your students.",
    });
    setOpen(false);
  };
  
  const getSubmissionCount = (assignmentId: string) => {
    return assignmentSubmissions.filter(sub => sub.assignmentId === assignmentId).length;
  };

  const defaultTab = Object.keys(assignmentsByCourse)[0] || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Classwork</h1>
          <p className="text-muted-foreground">Create, view, and grade assignments for your classes.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Fill out the details for the new assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">
                  Class
                </Label>
                 <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {myClasses.map(cl => (
                      <SelectItem key={cl.id} value={cl.id}>{cl.course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" placeholder="e.g. Chapter 5 Reading Quiz"/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea id="description" className="col-span-3" placeholder="Enter assignment instructions..." />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input id="dueDate" type="date" className="col-span-3"/>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="points" className="text-right">
                  Max Points
                </Label>
                <Input id="points" type="number" className="col-span-3" placeholder="e.g. 100"/>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleCreateAssignment}>Create Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
         <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(assignmentsByCourse).length}, minmax(0, 1fr))` }}>
          {Object.keys(assignmentsByCourse).map((courseName) => (
            <TabsTrigger key={courseName} value={courseName}>{courseName}</TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(assignmentsByCourse).map(([courseName, assignments]) => (
          <TabsContent key={courseName} value={courseName} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignments.map((assignment) => {
                const submissionCount = getSubmissionCount(assignment.id);
                return (
                  <Card key={assignment.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>Due: {format(parseISO(assignment.dueDate), 'MMM d, yyyy')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                       <div className="space-y-2 mb-4">
                         <div className="flex items-center text-sm text-muted-foreground">
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            <span>{submissionCount} Submissions</span>
                          </div>
                           <div className="flex items-center text-sm text-muted-foreground">
                             <Users className="mr-2 h-4 w-4" />
                            <span>{classLists.find(cl => cl.course.id === assignment.course.id)?.students.length} Students</span>
                          </div>
                       </div>
                       <Button asChild className="w-full">
                         <Link href={`/dashboard/teacher/classwork/${assignment.id}`}>
                           Grade Submissions <ArrowRight className="ml-2 h-4 w-4" />
                         </Link>
                       </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
