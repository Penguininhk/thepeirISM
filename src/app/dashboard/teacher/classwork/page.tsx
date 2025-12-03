
'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { teacherProfile, teacherAssignments, classLists, assignmentSubmissions } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, ClipboardCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeacherClassworkPage() {
  const router = useRouter();

  const myClasses = classLists.filter(cl => teacherProfile.courses.some(c => c.id === cl.course.id));
  const myAssignments = teacherAssignments.filter(assign => myClasses.some(cl => cl.course.id === assign.course.id));
  
  const assignmentsByCourse = myAssignments.reduce((acc, assignment) => {
    const courseName = assignment.course.name;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(assignment);
    return acc;
  }, {} as Record<string, typeof myAssignments>);

  const getSubmissionCount = (assignmentId: string) => {
    return assignmentSubmissions.filter(sub => sub.assignmentId === assignmentId && sub.status !== 'pending').length;
  };

  const defaultTab = Object.keys(assignmentsByCourse)[0] || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Classwork</h1>
          <p className="text-muted-foreground">Create, view, and grade assignments for your classes.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/teacher/classwork/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
         <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(assignmentsByCourse).length || 1}, minmax(0, 1fr))` }}>
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
                      <CardDescription>Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}</CardDescription>
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
