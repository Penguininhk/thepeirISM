
import { announcements } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function AnnouncementsPage() {
  const schoolWideAnnouncements = announcements.filter(ann => !ann.classId);
  const classAnnouncements = announcements.filter(ann => ann.classId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Announcements</h1>
          <p className="text-muted-foreground">Stay up-to-date with the latest news.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          School-wide
        </h2>
        {schoolWideAnnouncements.length > 0 ? (
          schoolWideAnnouncements.map((ann) => (
            <Card key={ann.id}>
              <CardHeader>
                <CardTitle>{ann.title}</CardTitle>
                <CardDescription>
                  Posted on {format(parseISO(ann.date), 'MMMM d, yyyy')} by {ann.author.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{ann.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No school-wide announcements at this time.</p>
        )}
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline flex items-center gap-2">
          <School className="h-6 w-6 text-primary" />
          My Classes
        </h2>
        {classAnnouncements.length > 0 ? (
           classAnnouncements.map((ann) => (
            <Card key={ann.id}>
              <CardHeader>
                <CardTitle>{ann.title}</CardTitle>
                <CardDescription>
                  Posted on {format(parseISO(ann.date), 'MMMM d, yyyy')} by {ann.author.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{ann.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No class-specific announcements at this time.</p>
        )}
      </div>
    </div>
  );
}
