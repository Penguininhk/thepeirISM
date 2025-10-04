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
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClassworkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Classwork</h1>
        <p className="text-muted-foreground">Track your assignments, submissions, and grades.</p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Assignment</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action / Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentProfile.assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{assignment.title}</TableCell>
                <TableCell>{assignment.course.name}</TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      assignment.status === "graded" ? "default" :
                      assignment.status === "submitted" ? "secondary" : "outline"
                    }
                    className={cn(
                      assignment.status === "graded" && "bg-green-600 text-white",
                    )}
                  >
                    {assignment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {assignment.status === "pending" && (
                    <Button variant="outline" size="sm">
                      <FileUp className="mr-2 h-4 w-4" />
                      Submit
                    </Button>
                  )}
                  {assignment.status === "graded" && (
                    <span className="font-bold text-lg">{assignment.grade}</span>
                  )}
                  {assignment.status === "submitted" && (
                    <span className="text-sm text-muted-foreground">Awaiting Grade</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
