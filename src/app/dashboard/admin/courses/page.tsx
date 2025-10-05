'use client';

import * as React from 'react';
import { availableCourses, classLists, users } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import type { Course } from "@/lib/data";

export default function AdminCoursesPage() {
  const { toast } = useToast();
  const [isNewCourseOpen, setNewCourseOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);

  const teachers = users.filter(u => u.role === 'teacher');
  const blocks = ["A", "B", "C", "D", "E", "F"];
  const terms = [1, 2, 3];
  
  const handleSaveCourse = () => {
    toast({
      title: editingCourse ? "Course Updated" : "Course Created",
      description: `The course details have been successfully saved.`,
    });
    setNewCourseOpen(false);
    setEditingCourse(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Course Catalog</h1>
          <p className="text-muted-foreground">Manage the school's course offerings.</p>
        </div>
        <Dialog open={isNewCourseOpen} onOpenChange={setNewCourseOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Fill in the details for the new course to add it to the catalog.
              </DialogDescription>
            </DialogHeader>
             <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Course Name</Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Course Code</Label>
                <Input id="code" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea id="description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">Teacher</Label>
                 <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label className="text-right">Block & Term</Label>
                 <div className="col-span-3 grid grid-cols-2 gap-2">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Block" /></SelectTrigger>
                      <SelectContent>
                        {blocks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Term" /></SelectTrigger>
                      <SelectContent>
                        {terms.map(t => <SelectItem key={t} value={String(t)}>Term {t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                 </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setNewCourseOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleSaveCourse}>Save Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell><Badge variant="outline">{course.code}</Badge></TableCell>
                    <TableCell>{course.teacher.name}</TableCell>
                    <TableCell>{course.block}</TableCell>
                    <TableCell>{course.term}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
