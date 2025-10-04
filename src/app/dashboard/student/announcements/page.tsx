import { announcements } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Announcements</h1>
          <p className="text-muted-foreground">Stay up-to-date with the latest news from the school.</p>
        </div>
      </div>
      <div className="space-y-4">
        {announcements.map((ann, index) => (
          <Card key={ann.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{ann.title}</CardTitle>
                {ann.classId ? (
                  <Badge variant="secondary">
                    <School className="mr-2 h-4 w-4" />
                    Class Specific
                  </Badge>
                ) : (
                  <Badge variant="outline">School-wide</Badge>
                )}
              </div>
              <CardDescription>
                Posted on {format(parseISO(ann.date), 'MMMM d, yyyy')} by {ann.author.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ann.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
