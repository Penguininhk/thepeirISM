
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { forms } from '@/lib/data';
import type { Form as FormType } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock responses
const mockResponses = [
    { responseId: 'resp-001', student: 'Alice Johnson', submissionDate: '2025-05-20', data: { 'Reason for Absence': 'Family matter.' } },
    { responseId: 'resp-002', student: 'Bob Williams', submissionDate: '2025-05-21', data: { 'Reason for Absence': 'Doctor\'s appointment.' } },
    { responseId: 'resp-003', student: 'Charlie Brown', submissionDate: '2025-05-22', data: { 'Reason for Absence': 'Travel.' } },
];

export default function FormResponsesPage({ params }: { params: { formId: string } }) {
  const resolvedParams = use(params);
  const { formId } = resolvedParams;
  const router = useRouter();
  const [form, setForm] = useState<FormType | undefined>();

  useEffect(() => {
    if (formId) {
      const foundForm = forms.find(f => f.id === formId);
      setForm(foundForm);
    }
  }, [formId]);

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Form not found.</p>
      </div>
    );
  }

  const fieldLabels = form.fields.map(f => f.label);

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Form
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Responses for "{form.title}"</CardTitle>
          <CardDescription>Viewing all {mockResponses.length} submissions.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Submission Date</TableHead>
                            {fieldLabels.map(label => <TableHead key={label}>{label}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockResponses.map(response => (
                            <TableRow key={response.responseId}>
                                <TableCell className="font-medium">{response.student}</TableCell>
                                <TableCell>{response.submissionDate}</TableCell>
                                {fieldLabels.map(label => (
                                    <TableCell key={label}>{response.data[label as keyof typeof response.data] || '--'}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
