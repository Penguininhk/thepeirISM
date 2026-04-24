
'use client';

import * as React from 'react';
import { schoolExtensionActivities, teacherProfile, parentProfile } from '@/lib/data';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlusCircle, Edit, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const useUserRole = () => {
    const pathname = usePathname();
    if (!pathname) return 'student';
    if (pathname.startsWith('/dashboard/teacher')) return teacherProfile.role;
    if (pathname.startsWith('/dashboard/parent')) return parentProfile.role;
    if (pathname.startsWith('/dashboard/admin')) return 'admin';
    return 'student';
}

export default function SeaCoursesPage() {
    const { toast } = useToast();
    const userRole = useUserRole();
    const canManage = userRole === 'admin' || userRole === 'teacher';

    const handleRegister = (courseName: string) => {
        toast({
            title: "Registration Submitted",
            description: `Your interest in ${courseName} has been recorded. You will be contacted with payment and confirmation details.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold font-headline">School Extension Activities</h1>
                <p className="text-muted-foreground">Browse and manage extracurricular courses for Primary and Middle School.</p>
                </div>
                {canManage && (
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Course
                </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {schoolExtensionActivities.map((course) => (
                <Card key={course.id} className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
                    <div className="relative h-40 w-full">
                        <Image 
                            src={course.imageUrl} 
                            alt={course.name} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-2 right-2">
                           <Badge variant="secondary">{course.ageGroup}</Badge>
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle>{course.name}</CardTitle>
                        <CardDescription>
                            <span className="font-semibold">{course.term}</span> &middot; {course.schedule}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                        <p className="text-sm text-muted-foreground mb-4 flex-grow">{course.description}</p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                            <span>Instructor: {course.instructor}</span>
                            <span className="font-bold text-lg text-primary flex items-center"><DollarSign className="h-4 w-4" />{course.price}</span>
                        </div>
                        {canManage ? (
                            <div className="flex gap-2">
                                <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                <Button variant="secondary" className="w-full"><Users className="mr-2 h-4 w-4" /> Enrollments</Button>
                            </div>
                        ) : (
                            <Button className="w-full" onClick={() => handleRegister(course.name)}>Register</Button>
                        )}
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>
    );
}
