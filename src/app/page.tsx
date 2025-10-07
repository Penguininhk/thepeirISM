import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, User } from "lucide-react";
import AppLogo from "@/components/app-logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--background)),transparent)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-48">
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.1}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.8}} />
              </linearGradient>
            </defs>
            <path 
              fill="url(#wave-gradient)"
              d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,144C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
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
