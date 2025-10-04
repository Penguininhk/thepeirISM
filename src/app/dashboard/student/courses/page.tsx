import Image from "next/image";
import { availableCourses, studentProfile } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CourseSelectionPage() {
  const enrolledCourseIds = new Set(studentProfile.courses.map(c => c.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Course Selection</h1>
        <p className="text-muted-foreground">Enroll in courses for the upcoming semester.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.has(course.id);
          return (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="relative h-40 w-full mb-4">
                  <Image
                    src={course.imageUrl}
                    alt={course.name}
                    fill
                    className="rounded-lg object-cover"
                    data-ai-hint="classroom subject"
                  />
                </div>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
                <Badge variant="secondary" className="w-fit">{course.teacher.name}</Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={isEnrolled} variant={isEnrolled ? "secondary" : "default"}>
                  {isEnrolled ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Enrolled
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Enroll Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
