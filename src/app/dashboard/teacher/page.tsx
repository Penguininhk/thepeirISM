
import Link from "next/link";
import { classLists, announcements, teacherProfile } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, CalendarPlus, PlusCircle, Users, BookMarked } from "lucide-react";

export default function TeacherDashboard() {
  const myAnnouncements = announcements.filter(ann => ann.author.id === teacherProfile.id);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Users className="h-5 w-5 text-primary" />
              <span>My Classes</span>
            </CardTitle>
            <CardDescription>Manage attendance and view rosters for your classes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {classLists.filter(cl => cl.course.teacher.id === teacherProfile.id).map((cl) => (
              <Card key={cl.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{cl.course.name}</CardTitle>
                  <CardDescription>{cl.course.code}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{cl.students.length} students</span>
                  </div>
                   <Button asChild className="w-full" variant="outline">
                    <Link href={`/dashboard/teacher/roster/${cl.id}`}>
                      <Users className="mr-2 h-4 w-4" /> View Roster
                    </Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/dashboard/teacher/attendance/${cl.id}`}>
                      <CalendarPlus className="mr-2 h-4 w-4" /> Take Attendance
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
           <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookMarked className="h-5 w-5 text-primary" />
              <span>Classwork</span>
            </CardTitle>
             <CardDescription>Create, view, and grade assignments.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild className="w-full">
              <Link href="/dashboard/teacher/classwork">
                Manage Classwork <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Bell className="h-5 w-5 text-primary" />
              <span>Announcements</span>
            </CardTitle>
             <CardDescription>Create and manage school or class announcements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full mb-4">
              <Link href="/dashboard/teacher/announcements">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Announcement
              </Link>
            </Button>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Recent Postings:</h4>
               {myAnnouncements.slice(0, 2).map(ann => (
                  <div key={ann.id} className="text-sm p-2 border-l-2 border-primary/20 bg-muted/50 rounded-r-md">
                    <p className="truncate font-medium">{ann.title}</p>
                    <p className="text-xs text-muted-foreground">{ann.classId ? `For ${classLists.find(cl => cl.course.id === ann.classId)?.course.name}` : "School-wide"}</p>
                  </div>
               ))}
            </div>
             <Button asChild variant="outline" size="sm" className="w-full mt-4">
               <Link href="/dashboard/teacher/announcements">
                Manage All Announcements <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
