
'use client';

import * as React from 'react';
import { studentProfile } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AttendancePage() {
  const presentDays = studentProfile.attendance.filter(a => a.status === 'present').length;
  const lateDays = studentProfile.attendance.filter(a => a.status === 'late').length;
  const absentDays = studentProfile.attendance.filter(a => a.status === 'absent').length;
  const totalDays = studentProfile.attendance.length;
  const attendancePercentage = ((presentDays + lateDays) / totalDays * 100).toFixed(0);

  const attendanceByCourse = studentProfile.courses.map(course => {
    return {
      courseName: course.name,
      records: studentProfile.attendance.filter(a => a.course.name === course.name),
    };
  });
  
  const defaultTab = attendanceByCourse[0]?.courseName || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Attendance</h1>
        <p className="text-muted-foreground">A detailed record of your attendance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{attendancePercentage}%</div>
            <Progress value={Number(attendancePercentage)} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Present</CardTitle>
            <CardDescription>Days marked as present.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{presentDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Late</CardTitle>
            <CardDescription>Days marked as late.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{lateDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Absent</CardTitle>
            <CardDescription>Days marked as absent.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-destructive">{absentDays}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Log by Course</CardTitle>
          <CardDescription>Chronological record of your attendance status for each class.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${attendanceByCourse.length}, minmax(0, 1fr))` }}>
              {attendanceByCourse.map(({ courseName }) => (
                <TabsTrigger key={courseName} value={courseName}>{courseName}</TabsTrigger>
              ))}
            </TabsList>
            {attendanceByCourse.map(({ courseName, records }) => (
              <TabsContent key={courseName} value={courseName} className="mt-4">
                 <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record, index) => (
                        <TableRow key={`${courseName}-attendance-${index}`}>
                          <TableCell className="font-medium">{record.date}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              className={cn({
                                "bg-green-500 text-white": record.status === "present",
                                "bg-yellow-500 text-white": record.status === "late",
                                "bg-red-500 text-white": record.status === "absent",
                              })}
                            >
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                 </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
