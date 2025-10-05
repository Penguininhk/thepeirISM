import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">This section is for system administration.</p>
          <Button asChild>
            <Link href="/">
              Return to Portal Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
