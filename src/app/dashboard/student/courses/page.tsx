
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, School, GraduationCap } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';

export default function CourseSelectionHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Course Selection</h1>
        <p className="text-muted-foreground">Choose the appropriate division to select your courses.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Link href="/dashboard/student/courses/high-school">
          <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-48 w-full">
              <Image 
                src={getImageUrl('course-calculus')} 
                alt="High School" 
                layout="fill" 
                objectFit="cover"
                data-ai-hint="chalkboard equations"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <GraduationCap /> High School
                </h2>
              </div>
            </div>
            <CardHeader>
              <CardTitle>High School Selection</CardTitle>
              <CardDescription>Select trimester-based courses for grades 9-12.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-end text-sm font-semibold text-primary group-hover:text-accent">
                Proceed to Selection <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/student/courses/middle-school">
           <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
             <div className="relative h-48 w-full">
              <Image 
                src={getImageUrl('course-life-science')}
                alt="Middle School" 
                layout="fill" 
                objectFit="cover"
                data-ai-hint="microscope"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <School /> Middle School
                </h2>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Middle School Selection</CardTitle>
              <CardDescription>Select your Science and Social Studies courses for the year.</CardDescription>
            </CardHeader>
             <CardContent>
              <div className="flex items-center justify-end text-sm font-semibold text-primary group-hover:text-accent">
                Proceed to Selection <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
