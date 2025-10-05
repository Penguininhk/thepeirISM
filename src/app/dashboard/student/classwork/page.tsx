
import { studentProfile } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClassworkPage() {

  const assignmentsByCourse = studentProfile.assignments.reduce((acc, assignment) => {
    const courseName = assignment.course.name;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(assignment);
    return acc;
  }, {} as Record<string, typeof studentProfile.assignments>);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Classwork</h1>
        <p className="text-muted-foreground">Track your assignments, submissions, and grades for each course.</p>
      </div>

      <Accordion type="multiple" defaultValue={Object.keys(assignmentsByCourse)} className="w-full space-y-4">
        {Object.entries(assignmentsByCourse).map(([courseName, assignments]) => (
          <AccordionItem key={courseName} value={courseName} className="border-b-0">
             <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                  {courseName}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Assignment</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action / Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
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
                </AccordionContent>
              </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

