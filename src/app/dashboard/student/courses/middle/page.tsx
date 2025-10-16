
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { middleSchoolCourses } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CheckCircle, FlaskConical, Landmark } from "lucide-react";
import type { Course } from "@/lib/data";

export default function MiddleSchoolCourseSelectionPage() {
  const router = useRouter();

  const scienceCourses = middleSchoolCourses.filter(c => c.category === 'Science');
  const socialStudiesCourses = middleSchoolCourses.filter(c => c.category === 'Social Studies');

  const handleSubmit = () => {
    // In a real app, you'd save this data to a state management solution
    // to be displayed on the confirmation page.
    router.push('/dashboard/student/courses/middle/confirm');
  };

  const CourseCategorySelection = ({ title, icon, courses, numChoices }: { title: string; icon: React.ReactNode; courses: Course[], numChoices: number }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {icon} {title}
        </CardTitle>
        <CardDescription>Select {numChoices} courses from the options below. Order from most to least preferred.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: numChoices }, (_, i) => (
          <div key={i}>
            <label className="text-sm font-medium text-muted-foreground">Choice {i + 1}</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`Select your ${i === 0 ? '1st' : '2nd'} choice`} />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
       <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/student/courses">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course Selection Hub
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold font-headline">Middle School Course Selection</h1>
        <p className="text-muted-foreground">Select your preferences for Science and Social Studies.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <CourseCategorySelection 
          title="Science"
          icon={<FlaskConical className="text-blue-500" />}
          courses={scienceCourses}
          numChoices={2}
        />
        <CourseCategorySelection 
          title="Social Studies"
          icon={<Landmark className="text-amber-600" />}
          courses={socialStudiesCourses}
          numChoices={2}
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <Button size="lg" onClick={handleSubmit}>
          <CheckCircle className="mr-2 h-5 w-5" />
          Review Selections
        </Button>
      </div>
    </div>
  );
}
