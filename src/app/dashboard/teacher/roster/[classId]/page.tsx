
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { classLists } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function generateStaticParams() {
  return classLists.map((cl) => ({
    classId: cl.id,
  }));
}

export default function ClassRosterPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);

  const [classInfo, setClassInfo] = useState<any>(undefined);

  useEffect(() => {
    if (classId) {
      setClassInfo(classLists.find((c) => c.id === classId));
    }
  }, [classId]);

  if (!classInfo) {
    return <div>Class not found</div>;
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
        <Link href="/dashboard/teacher">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold font-headline">Class Roster</h1>
        <p className="text-muted-foreground">
          Showing all students enrolled in <span className="font-semibold text-primary">{classInfo.course.name}</span>
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classInfo.students.map((student: any) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatarUrl} alt={student.name} />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.id}</TableCell>
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
