
import { studentProfile } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SchedulePage() {
  const { schedule } = studentProfile;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Weekly Schedule</h1>
        <p className="text-muted-foreground">Your class schedule for the current term.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">Block</TableHead>
                  <TableHead className="w-2/6">Course</TableHead>
                  <TableHead className="w-1/6">Course Code</TableHead>
                  <TableHead className="w-1/6">Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((item) => (
                  <TableRow key={item.block}>
                    <TableCell className="font-semibold text-lg">{item.block}</TableCell>
                    {item.course ? (
                      <>
                        <TableCell className="font-medium">{item.course.name}</TableCell>
                        <TableCell>
                           <Badge variant="outline">{item.course.code}</Badge>
                        </TableCell>
                        <TableCell>{item.course.room}</TableCell>
                      </>
                    ) : (
                      <TableCell colSpan={3} className="text-muted-foreground text-center">
                        -- Free Block --
                      </TableCell>
                    )}
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
