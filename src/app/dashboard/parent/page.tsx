

import Link from "next/link";
import { parentProfile, announcements, teacherAssignments, availableCourses, users } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, CalendarCheck, Megaphone, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ClientTime } from "@/components/client-time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ParentDashboard() {
  // For simplicity, we'll focus on the first child in the mock data.
  const student = parentProfile.children[0];

  if (!student) {
    return <div>No student data available.</div>;
  }

  const upcomingAssignments = student.assignments
    .filter((a) => a.status === 'pending')
    .map(ass => {
        const fullAssignment = teacherAssignments.find(fullAss => fullAss.id === ass.id);
        return { ...ass, ...fullAssignment };
    })
    .slice(0, 3);
  
  const recentAnnouncements = announcements.slice(0, 2);

  const attendancePercentage = (
    (student.attendance.filter(a => a.status === 'present' || a.status === 'late').length / student.attendance.length) * 100
  ).toFixed(0);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Parent of: <span className="font-bold">{student.name}</span></span>
                </CardTitle>
                <CardDescription>This is an overview of your child's current academic status.</CardDescription>
            </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Megaphone className="h-5 w-5 text-primary" />
              <span>Recent Announcements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentAnnouncements.map((ann) => (
                <li key={ann.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">
                     <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground">{ann.content.substring(0, 100)}...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(ann.date), 'MMMM d, yyyy')} by {ann.author.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
             <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/dashboard/parent/announcements">
                  View All Announcements <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookOpenCheck className="h-5 w-5 text-primary" />
              <span>Upcoming Assignments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAssignments.map((ass) => (
                  <TableRow key={ass.id}>
                    <TableCell className="font-medium">{ass.title}</TableCell>
                    <TableCell>{ass.course.name}</TableCell>
                    <TableCell className="text-right">
                      <ClientTime timestamp={ass.dueDate} formatString="MMM d" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
         <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2 font-headline">
              <CalendarCheck className="h-5 w-5 text-primary" />
              <span>Attendance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Attendance</span>
              <span className="font-bold text-primary">{attendancePercentage}%</span>
            </div>
            <Progress value={Number(attendancePercentage)} className="mt-2 h-2" />
             <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href="/dashboard/parent/attendance">
                  View Detailed Record <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quick Contacts</CardTitle>
            <CardDescription>Contact your child's teachers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {student.courses.map((course) => {
              const courseDetails = availableCourses.find(c => c.id === course.id || c.name === course.name);
              const teacherName = courseDetails?.teacher.name;
              const teacher = users.find(u => u.name === teacherName);
              
              return (
              <div key={course.id} className="flex items-center justify-between rounded-md border p-3">
                 <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={teacher?.avatarUrl || ''} />
                        <AvatarFallback>{getInitials(course.teacher.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{course.teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{course.name}</p>
                    </div>
                 </div>
                 <Button variant="outline" size="sm">Email</Button>
               </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
