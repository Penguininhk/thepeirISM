
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const currentYear = 2025;
// Mock data for selections
const mockSelections = {
  [`Term 1 (${currentYear})`]: {
    "Block A": ["AP Marine Biology", "Oceanography", "Astrophysics"],
    "Block B": ["AP Calculus BC", "Number Theory", "Game Theory"],
    "Block C": ["AP Studio Art: 2D", "Photography", "Study Block"],
    "Block D": ["AP World History", "Study Block", "Study Block"],
    "Block E": ["Intro to Robotics", "Study Block", "Study Block"],
    "Block F": ["AP English Literature", "Study Block", "Study Block"],
  },
  [`Term 2 (${currentYear + 1})`]: {
    "Block A": ["Genetics", "Study Block", "Study Block"],
    "Block B": ["Linear Algebra", "Study Block", "Study Block"],
    "Block C": ["3D Modeling", "Study Block", "Study Block"],
    "Block D": ["AP European History", "Study Block", "Study Block"],
    "Block E": ["Advanced Robotics", "Study Block", "Study Block"],
    "Block F": ["Creative Non-Fiction", "Study Block", "Study Block"],
  },
    [`Term 3 (${currentYear + 1})`]: {
    "Block A": ["Environmental Science", "Study Block", "Study Block"],
    "Block B": ["Statistics", "Study Block", "Study Block"],
    "Block C": ["Animation", "Study Block", "Study Block"],
    "Block D": ["AP US Government", "Study Block", "Study Block"],
    "Block E": ["AI & Machine Learning", "Study Block", "Study Block"],
    "Block F": ["Shakespeare", "Study Block", "Study Block"],
  }
};


export default function ConfirmCourseSelectionsPage() {
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
        {Object.entries(mockSelections).map(([term, blocks]) => (
          <Card key={term}>
            <CardHeader>
              <CardTitle>{term}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(blocks).map(([block, choices]) => (
                <div key={block} className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-3">{block}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {choices.map((choice, index) => (
                       <div key={index} className="flex items-start gap-3">
                         <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                         <div className="flex-1">
                          <p className="font-medium">{choice === 'none' ? 'Study Block' : choice}</p>
                          <p className="text-xs text-muted-foreground">
                            {index === 0 ? "1st Choice" : index === 1 ? "2nd Choice" : "3rd Choice"}
                          </p>
                         </div>
                       </div>
                    ))}
                  </div>
                </div>
              ))}
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
