
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileSignature, DollarSign, Lightbulb, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FormsPage() {
  const formTypes = [
    {
      title: "Application Forms",
      description: "Apply for clubs, programs, or special permissions.",
      icon: <ClipboardList className="h-6 w-6 text-primary" />,
    },
    {
      title: "Suggestion Box",
      description: "Share your ideas to improve the school community.",
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
    },
    {
      title: "Finance & Payments",
      description: "Access forms related to fees, payments, or financial aid.",
      icon: <DollarSign className="h-6 w-6 text-primary" />,
    },
    {
        title: "General Forms",
        description: "Find other miscellaneous school forms here.",
        icon: <FileSignature className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Forms & Documents</h1>
        <p className="text-muted-foreground">Find and fill out necessary school forms.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {formTypes.map((form) => (
          <Card key={form.title}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-3 bg-primary/10 rounded-md">
                {form.icon}
              </div>
              <div>
                <CardTitle>{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
                <Button variant="outline">View Forms</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
