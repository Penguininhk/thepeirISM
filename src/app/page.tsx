import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, User, ShieldCheck } from "lucide-react";
import AppLogo from "@/components/app-logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9D6E2,transparent)]"></div>
      </div>
      
      <main className="flex w-full max-w-4xl flex-col items-center text-center">
        <AppLogo className="mb-8 h-16 w-16" />
        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-6xl font-headline">
          Welcome to The PIER
        </h1>
        <p className="mt-4 max-w-xl text-lg text-foreground/80">
          The Harbour School's official portal for students and faculty. Access your dashboard to stay updated with announcements, classwork, and more.
        </p>

        <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-3">
          <Link href="/login/student" passHref>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3">
                  <User className="h-6 w-6 text-primary transition-colors group-hover:text-accent" />
                  <span className="font-headline">Student</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View assignments, track attendance, and select courses.
                </p>
                <Button variant="link" className="mt-4 p-0">
                  Student Login
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/login/teacher" passHref>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3">
                  <School className="h-6 w-6 text-primary transition-colors group-hover:text-accent" />
                  <span className="font-headline">Teacher</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage classes, post announcements, and take attendance.
                </p>
                <Button variant="link" className="mt-4 p-0">
                  Teacher Login
                </Button>
              </CardContent>
            </Card>
          </Link>
          
           <Link href="/login/admin" passHref>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary transition-colors group-hover:text-accent" />
                  <span className="font-headline">Admin</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage users, approve accounts, and oversee school data.
                </p>
                <Button variant="link" className="mt-4 p-0">
                  Admin Login
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} The Harbour School. Hong Kong.</p>
      </footer>
    </div>
  );
}
