
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { School, User } from "lucide-react";
import AppLogo from "@/components/app-logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
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
        <div className="mt-6 grid w-full max-w-sm grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/login/student" passHref>
            <Card className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 h-24">
              <CardHeader className="relative z-10 flex h-full items-center justify-center">
                <CardTitle className="flex items-center justify-center gap-3">
                  <User className="h-6 w-6 text-primary transition-colors group-hover:text-accent" />
                  <span className="font-headline">Student</span>
                </CardTitle>
              </CardHeader>
               <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="waves-svg absolute bottom-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                  <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                  </defs>
                  <g className="waves">
                    <use href="#gentle-wave" x="48" y="0" fill="hsl(var(--accent) / 0.1)" />
                    <use href="#gentle-wave" x="48" y="3" fill="hsl(var(--accent) / 0.15)" />
                    <use href="#gentle-wave" x="48" y="5" fill="hsl(var(--accent) / 0.05)" />
                    <use href="#gentle-wave" x="48" y="7" fill="hsl(var(--accent) / 0.2)" />
                  </g>
                </svg>
              </div>
            </Card>
          </Link>

          <Link href="/login/teacher" passHref>
            <Card className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 h-24">
              <CardHeader className="relative z-10 flex h-full items-center justify-center">
                <CardTitle className="flex items-center justify-center gap-3">
                  <School className="h-6 w-6 text-primary transition-colors group-hover:text-accent" />
                  <span className="font-headline">Teacher</span>
                </CardTitle>
              </CardHeader>
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="waves-svg absolute bottom-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                  <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                  </defs>
                  <g className="waves">
                    <use href="#gentle-wave" x="48" y="0" fill="hsl(var(--accent) / 0.1)" />
                    <use href="#gentle-wave" x="48" y="3" fill="hsl(var(--accent) / 0.15)" />
                    <use href="#gentle-wave" x="48" y="5" fill="hsl(var(--accent) / 0.05)" />
                    <use href="#gentle-wave" x="48" y="7" fill="hsl(var(--accent) / 0.2)" />
                  </g>
                </svg>
              </div>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Adriel Tan, Hong Kong.</p>
        <p className="mt-1">
            <Link href="/login/admin" className="underline hover:text-primary">
                Administrator Login
            </Link>
        </p>
      </footer>
    </div>
  );
}
