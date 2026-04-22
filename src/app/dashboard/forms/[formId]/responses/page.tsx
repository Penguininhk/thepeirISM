'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { forms, mockResponses } from '@/lib/data';
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
import { format } from 'date-fns';

export function generateStaticParams() {
  return forms.map((form) => ({
    formId: form.id,
  }));
}

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
                                <TableCell>{format(new Date(response.submissionDate), 'MMM d, yyyy')}</TableCell>
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
