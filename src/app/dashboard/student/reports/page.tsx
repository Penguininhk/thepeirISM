
'use client';

import * as React from 'react';
import { reportCards, studentProfile } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText } from 'lucide-react';

const semesters = ['Fall 2024', 'Spring 2025'];

export default function StudentReportsPage() {
  const [selectedSemester, setSelectedSemester] = React.useState(semesters[semesters.length - 1]);

  const studentReports = reportCards
    .filter((r) => r.student.id === studentProfile.id && r.status === 'released' && r.semester === selectedSemester)
    .sort((a, b) => a.course.name.localeCompare(b.course.name));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Report Cards</h1>
          <p className="text-muted-foreground">View your academic performance for each semester.</p>
        </div>
        <div className="w-full sm:w-auto">
          <Select onValueChange={setSelectedSemester} defaultValue={selectedSemester}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {studentReports.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {studentReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            {report.course.name}
                        </CardTitle>
                        <CardDescription>
                            Teacher: {report.teacher.name}
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Final Grade</p>
                        <p className="text-4xl font-bold text-primary">{report.grade}</p>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-sm">Comments</h4>
                <p className="mt-2 text-sm text-muted-foreground border-l-2 pl-4 py-2">
                  {report.comments}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Report cards for {selectedSemester} have not been released yet.</p>
        </div>
      )}
    </div>
  );
}
