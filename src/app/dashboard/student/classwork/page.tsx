
'use client';

import { studentProfile, teacherAssignments } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUp, BookCheck, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ClientTime } from "@/components/client-time";

export default function ClassworkPage() {

  const assignmentsByCourse = studentProfile.assignments.reduce((acc, assignment) => {
    const fullAssignment = teacherAssignments.find(a => a.id === assignment.id);
    if (!fullAssignment) return acc;

    const courseName = fullAssignment.course.name;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push({ ...assignment, ...fullAssignment});
    return acc;
  }, {} as Record<string, (typeof studentProfile.assignments[0] & typeof teacherAssignments[0])[]>);

  const getStatusInfo = (status: 'pending' | 'submitted' | 'graded') => {
    switch (status) {
      case 'pending':
        return { icon: <Clock className="h-4 w-4" />, text: 'Assigned', color: 'bg-gray-400' };
      case 'submitted':
        return { icon: <FileUp className="h-4 w-4" />, text: 'Turned In', color: 'bg-blue-500' };
      case 'graded':
        return { icon: <BookCheck className="h-4 w-4" />, text: 'Graded', color: 'bg-green-600' };
    }
  }

  const defaultTab = Object.keys(assignmentsByCourse)[0] || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Classwork</h1>
        <p className="text-muted-foreground">Track your assignments, submissions, and grades for each course.</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(assignmentsByCourse).length}, minmax(0, 1fr))` }}>
          {Object.keys(assignmentsByCourse).map((courseName) => (
            <TabsTrigger key={courseName} value={courseName}>{courseName}</TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(assignmentsByCourse).map(([courseName, assignments]) => (
          <TabsContent key={courseName} value={courseName} className="mt-6">
            <div className="space-y-4">
              {assignments.map((assignment) => {
                const statusInfo = getStatusInfo(assignment.status);
                return (
                  <Link key={assignment.id} href={`/dashboard/student/classwork/${assignment.id}`} passHref>
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className={cn("p-3 rounded-full text-white", statusInfo.color)}>
                              {statusInfo.icon}
                           </div>
                           <div>
                              <p className="font-semibold">{assignment.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Due: <ClientTime timestamp={assignment.dueDate} />
                              </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-4">
                            {assignment.status === 'graded' && assignment.grade && (
                              <div className="text-right">
                                 <span className="font-bold text-lg text-primary">{assignment.grade.percentage}%</span>
                                 <p className="text-sm font-medium text-muted-foreground">({assignment.grade.letter})</p>
                              </div>
                            )}
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                         </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
