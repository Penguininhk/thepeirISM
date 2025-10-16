
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Edit, FlaskConical, Landmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for selections
const mockSelections = {
  "Science": ["Life Science", "Earth Science"],
  "Social Studies": ["Ancient Civilizations", "World Geography"],
};

const icons = {
    "Science": <FlaskConical className="text-blue-500" />,
    "Social Studies": <Landmark className="text-amber-600" />,
}

export default function ConfirmMiddleSchoolSelectionsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleConfirm = () => {
    toast({
      title: "Course Selections Confirmed!",
      description: "Your choices have been successfully submitted for the upcoming school year.",
    });
    router.push('/dashboard/student');
  };

  const handleEdit = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={handleEdit}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Course Selection
      </Button>

      <div>
        <h1 className="text-3xl font-bold font-headline">Confirm Your Selections</h1>
        <p className="text-muted-foreground">Please review your course choices below before finalizing your submission.</p>
      </div>

      <div className="space-y-8">
        {Object.entries(mockSelections).map(([category, choices]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {icons[category as keyof typeof icons]}
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {choices.map((choice, index) => (
                       <div key={index} className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50">
                         <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                         <div className="flex-1">
                          <p className="font-medium">{choice}</p>
                          <p className="text-xs text-muted-foreground">
                            {index === 0 ? "1st Choice" : "2nd Choice"}
                          </p>
                         </div>
                       </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" size="lg" onClick={handleEdit}>
          <Edit className="mr-2 h-5 w-5" />
          Make Changes
        </Button>
        <Button size="lg" onClick={handleConfirm}>
          <CheckCircle className="mr-2 h-5 w-5" />
          Confirm & Submit
        </Button>
      </div>
    </div>
  );
}
