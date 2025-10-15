
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { availableCourses } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";
import type { Course } from "@/lib/data";

const blocks = ["A", "B", "C", "D", "E", "F"];
const terms = ["Term 1", "Term 2", "Term 3"];

export default function CourseSelectionPage() {
  const router = useRouter();

  const getCoursesByBlockAndTerm = (block: string, term: number): Course[] => {
    return availableCourses.filter(course => course.block === block && course.term === term);
  };
  
  const handleSubmit = () => {
    router.push('/dashboard/student/courses/confirm');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Course Selection</h1>
        <p className="text-muted-foreground">Select your course preferences for each block and term.</p>
      </div>

      <Tabs defaultValue="Term 1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {terms.map(term => (
            <TabsTrigger key={term} value={term}>{term}</TabsTrigger>
          ))}
        </TabsList>
        {terms.map((term, termIndex) => (
          <TabsContent key={term} value={term}>
            <Card>
              <CardHeader>
                <CardTitle>{term} Course Choices</CardTitle>
                <CardDescription>Select a 1st, 2nd, and 3rd choice for each block.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {blocks.map(block => {
                  const blockCourses = getCoursesByBlockAndTerm(block, termIndex + 1);
                  return (
                    <div key={block} className="p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Block {block}</h3>
                      {blockCourses.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-3">
                          {[1, 2, 3].map(choice => (
                             <div key={choice}>
                              <label className="text-sm font-medium text-muted-foreground">Choice {choice}</label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${choice === 1 ? '1st' : choice === 2 ? '2nd' : '3rd'} choice`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {blockCourses.map(course => (
                                    <SelectItem key={course.id} value={course.id}>
                                      {course.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No courses available for this block in {term}.</p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button size="lg" onClick={handleSubmit}>
          <CheckCircle className="mr-2 h-5 w-5" />
          Submit All Selections
        </Button>
      </div>
    </div>
  );
}
