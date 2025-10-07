import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, User } from "lucide-react";
import AppLogo from "@/components/app-logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#DDE6ED,transparent)]"></div>
      </div>
      
      <main className="flex w-full max-w-4xl flex-col items-center text-center">
        <AppLogo className="mb-8 h-40 w-40" />
        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-6xl font-headline">
          Welcome to The PIER
        </h1>
        <p className="mt-4 max-w-xl text-lg text-foreground/80">
          The Harbour School's official portal for students and faculty. Access your dashboard to stay updated with announcements, classwork, and more.
        </p>
        
        <h2 className="mt-12 text-center text-lg font-semibold text-foreground/90">
            Sign In Options
        </h2>
        <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/login/student" passHref>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3">
                  <User className="h-6 w-6 text-primary transition-colors group-hover:text-accent" />
                  <span className="font-headline">Student</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                <Button variant="link" className="mt-4 p-0">
                  Teacher Login
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} The Harbour School. Hong Kong.</p>
        <p className="mt-1">
            <Link href="/login/admin" className="underline hover:text-primary">
                Administrator Login
            </Link>
        </p>
      </footer>
    </div>
  );
}
