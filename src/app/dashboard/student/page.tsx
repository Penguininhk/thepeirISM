
import Link from "next/link";
import { studentProfile, announcements } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, CalendarCheck, Megaphone, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";

export default function StudentDashboard() {
  const upcomingAssignments = studentProfile.assignments
    .filter((a) => a.status === 'pending')
    .slice(0, 3);
  
  const recentAnnouncements = announcements.slice(0, 2);

  const attendancePercentage = (
    (studentProfile.attendance.filter(a => a.status === 'present' || a.status === 'late').length / studentProfile.attendance.length) * 100
  ).toFixed(0);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
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
                <Link href="/dashboard/student/announcements">
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
                    <TableCell className="text-right">{format(new Date(ass.dueDate), 'MMM d')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/dashboard/student/classwork">
                View All Classwork <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
           <CardHeader>
            <CardTitle className="font-headline">Join a Class</CardTitle>
            <CardDescription>Enter a class code from your teacher to enroll.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
                <Input type="text" placeholder="Class code" />
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Join</Button>
            </div>
          </CardContent>
        </Card>
        
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
                <Link href="/dashboard/student/attendance">
                  View Detailed Record <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Courses</CardTitle>
            <CardDescription>Quick access to your enrolled courses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {studentProfile.courses.map((course) => (
               <div key={course.id} className="flex items-center justify-between rounded-md border p-3">
                 <div>
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-sm text-muted-foreground">{course.code}</p>
                 </div>
                 <Badge variant="secondary">{course.teacher.name}</Badge>
               </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
