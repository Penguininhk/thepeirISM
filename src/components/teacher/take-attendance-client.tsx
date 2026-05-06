
'use client';

import { useEffect, useState } from 'react';
import { classLists } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

export default function TakeAttendanceClient({ classId }: { classId: string }) {
  const [classInfo, setClassInfo] = useState<any>(undefined);
  const { toast } = useToast();
  
  useEffect(() => {
    if (classId) {
      setClassInfo(classLists.find(cl => cl.id === classId));
    }
  }, [classId]);

  if (!classInfo) {
    return (
      <div className="text-center p-12">
        <h1 className="text-2xl font-bold">Class not found</h1>
        <p className="text-muted-foreground">The requested class could not be found.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/teacher"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const handleSubmitAttendance = () => {
    toast({
      title: "Attendance Submitted",
      description: `Attendance for ${classInfo.course.name} on ${format(new Date(), 'MMMM d, yyyy')} has been recorded.`,
    });
  }

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
           <Link href="/dashboard/teacher"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Take Attendance</h1>
        <p className="text-muted-foreground">
          For <span className="font-semibold text-primary">{classInfo.course.name}</span> on {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>Mark the attendance status for each student below.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classInfo.students.map((student: any) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatarUrl} alt={student.name} />
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <RadioGroup defaultValue="present" className="flex justify-end gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="present" id={`present-${student.id}`} />
                          <Label htmlFor={`present-${student.id}`}>Present</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="late" id={`late-${student.id}`} />
                          <Label htmlFor={`late-${student.id}`}>Late</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                          <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           </div>
           <div className="flex justify-end mt-6">
              <Button onClick={handleSubmitAttendance}>
                <Check className="mr-2 h-4 w-4" />
                Submit Attendance
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
