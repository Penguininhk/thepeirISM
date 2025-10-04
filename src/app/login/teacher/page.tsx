import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLogo from "@/components/app-logo";

export default function TeacherLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <AppLogo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-headline">Teacher Login</CardTitle>
          <CardDescription>Enter your credentials to access the faculty portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.reed@school.edu"
                defaultValue="e.reed@school.edu"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" defaultValue="password123" required />
            </div>
            <Link href="/dashboard/teacher" passHref>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Not a teacher?{" "}
            <Link href="/login/student" className="underline">
              Login as a student
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
