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

export default function AttendancePage() {
  const presentDays = studentProfile.attendance.filter(a => a.status === 'present').length;
  const lateDays = studentProfile.attendance.filter(a => a.status === 'late').length;
  const absentDays = studentProfile.attendance.filter(a => a.status === 'absent').length;
  const totalDays = studentProfile.attendance.length;
  const attendancePercentage = ((presentDays + lateDays) / totalDays * 100).toFixed(0);

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
          <CardTitle>Attendance Log</CardTitle>
          <CardDescription>Chronological record of your attendance status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentProfile.attendance.map((record) => (
                  <TableRow key={record.date}>
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
        </CardContent>
      </Card>
    </div>
  );
}
