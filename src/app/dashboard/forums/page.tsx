
import Link from "next/link";
import { forums } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";

export default function ForumsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Discussion Forums</h1>
          <p className="text-muted-foreground">Connect with students and teachers.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forums.map((forum) => (
          <Card key={forum.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{forum.title}</CardTitle>
              <CardDescription>{forum.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <span>{forum.threadCount} threads</span>
                <span>{forum.postCount} posts</span>
              </div>
              <Button asChild variant="outline">
                <Link href={`/dashboard/forums/${forum.id}`}>
                  Enter Forum <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
