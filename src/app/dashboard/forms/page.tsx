'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { forms, teacherProfile } from "@/lib/data"; // Assuming user role can be determined
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature, ArrowRight, PlusCircle } from "lucide-react";

// A simple mock function to determine user role. In a real app, this would come from auth context.
const useUserRole = () => {
    // For now, let's pretend we are a teacher to show the create button.
    // In a real scenario, you might have a hook like: const { user } = useAuth();
    return teacherProfile.role;
}

export default function FormsPage() {
  const router = useRouter();
  const userRole = useUserRole();

  const canCreateForms = userRole === 'teacher' || userRole === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Forms & Documents</h1>
          <p className="text-muted-foreground">Find, fill out, and manage school forms.</p>
        </div>
        {canCreateForms && (
           <Button onClick={() => router.push('/dashboard/teacher/forms/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Form
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Link key={form.id} href={`/dashboard/forms/${form.id}`} passHref>
            <Card className="group flex flex-col h-full hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader>
                <CardTitle className="flex items-start gap-3">
                    <FileSignature className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <span className="flex-1">{form.title}</span>
                </CardTitle>
                <CardDescription>{form.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end justify-between">
                    <span className="text-xs text-muted-foreground">
                        {form.submissionCount} Submissions
                    </span>
                    <div className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        View Form <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
