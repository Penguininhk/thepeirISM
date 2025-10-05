
'use client';

import { studentProfile } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUp, BookCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ClassworkPage() {

  const assignmentsByCourse = studentProfile.assignments.reduce((acc, assignment) => {
    const courseName = assignment.course.name;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(assignment);
    return acc;
  }, {} as Record<string, typeof studentProfile.assignments>);

  const getStatusInfo = (status: 'pending' | 'submitted' | 'graded') => {
    switch (status) {
      case 'pending':
        return { icon: <Clock className="h-4 w-4" />, text: 'Pending', color: 'bg-gray-400' };
      case 'submitted':
        return { icon: <FileUp className="h-4 w-4" />, text: 'Submitted', color: 'bg-blue-500' };
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignments.map((assignment) => {
                const statusInfo = getStatusInfo(assignment.status);
                return (
                  <Card key={assignment.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>Due: {assignment.dueDate}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant={
                            assignment.status === 'graded' ? 'default' :
                            assignment.status === 'submitted' ? 'secondary' : 'outline'
                          }
                          className={cn("text-white", statusInfo.color)}
                        >
                          {statusInfo.icon}
                          <span className="ml-1.5">{statusInfo.text}</span>
                        </Badge>
                        {assignment.status === 'graded' && assignment.grade && (
                          <div className="flex items-baseline gap-2">
                             <span className="font-bold text-lg text-primary">{assignment.grade.percentage}%</span>
                             <span className="text-sm font-medium text-muted-foreground">({assignment.grade.letter})</span>
                          </div>
                        )}
                      </div>
                      <div>
                        {assignment.status === 'pending' && (
                          <Button variant="outline" className="w-full">
                            Open in Classroom
                          </Button>
                        )}
                        {(assignment.status === 'submitted' || assignment.status === 'graded') && (
                           <Button variant="ghost" className="w-full">
                            View in Classroom
                          </Button>
                        )}
                      </div>
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
