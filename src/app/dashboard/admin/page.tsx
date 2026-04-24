
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Bell, BookOpen } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview and quick actions for managing the school portal.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group overflow-hidden transition-all hover:shadow-xl flex flex-col h-full">
          <div className="relative h-40 w-full">
            <Image 
              src={getImageUrl('admin-user-management')} 
              alt="User Management" 
              fill={true}
              style={{ objectFit: 'cover' }}
              data-ai-hint="people working"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>
              View, approve, and manage all user accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-end">
            <Button asChild>
              <Link href="/dashboard/admin/users">
                Manage Users <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden transition-all hover:shadow-xl flex flex-col h-full">
           <div className="relative h-40 w-full">
            <Image 
              src={getImageUrl('admin-announcements')} 
              alt="Announcements" 
              fill={true}
              style={{ objectFit: 'cover' }}
              data-ai-hint="megaphone broadcast"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Announcements
            </CardTitle>
            <CardDescription>
              Create and distribute school-wide announcements.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-end">
            <Button asChild>
              <Link href="/dashboard/admin/announcements">
                Manage Announcements <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
         <Card className="group overflow-hidden transition-all hover:shadow-xl flex flex-col h-full">
           <div className="relative h-40 w-full">
            <Image 
              src={getImageUrl('admin-course-catalog')} 
              alt="Course Catalog" 
              fill={true}
              style={{ objectFit: 'cover' }}
              data-ai-hint="library books"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Course Catalog
            </CardTitle>
            <CardDescription>
              Add, edit, and manage the school's course offerings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-end">
            <Button asChild>
              <Link href="/dashboard/admin/courses">
                Manage Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
