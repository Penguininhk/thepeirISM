
'use client';

import * as React from 'react';
import { resources, studentProfile } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, Book, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const typeIcons = {
  guide: FileText,
  video: Video,
  paper: Book,
};

export default function ResourceHubPage() {
  const myCourses = studentProfile.courses;
  const courseIds = myCourses.map(c => c.id);

  const myResources = resources.filter(r => courseIds.includes(r.courseId));

  const resourcesByCourse = myCourses.map(course => ({
    ...course,
    resources: myResources.filter(r => r.courseId === course.id),
  }));

  const defaultTab = myCourses[0]?.id || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Resource Hub</h1>
        <p className="text-muted-foreground">Curated study guides, videos, and materials for your courses.</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${myCourses.length}, minmax(0, 1fr))` }}>
          {myCourses.map(course => (
            <TabsTrigger key={course.id} value={course.id}>{course.name}</TabsTrigger>
          ))}
        </TabsList>
        {resourcesByCourse.map(course => (
          <TabsContent key={course.id} value={course.id} className="mt-6">
            {course.resources.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {course.resources.map(resource => {
                  const Icon = typeIcons[resource.type];
                  return (
                    <Link href={resource.url} key={resource.id} target="_blank" passHref>
                        <Card className="h-full flex flex-col group hover:border-primary transition-all">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Icon className="h-5 w-5 text-primary" />
                                        {resource.title}
                                    </span>
                                     <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </CardTitle>
                                <CardDescription>{resource.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-end">
                                <Badge variant="outline">{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</Badge>
                            </CardContent>
                        </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>No resources have been added for this course yet.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
