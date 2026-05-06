
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { forms, teacherProfile, parentProfile } from '@/lib/data';
import type { Form as FormType } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function FormPageClient({ formId }: { formId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [form, setForm] = useState<FormType | undefined>();

  const userRole = (() => {
      if (!pathname) return 'student';
      if (pathname.startsWith('/dashboard/teacher')) return teacherProfile.role;
      if (pathname.startsWith('/dashboard/parent')) return parentProfile.role;
      if (pathname.startsWith('/dashboard/admin')) return 'admin';
      return 'student';
  })();

  const canManageForm = userRole === 'teacher' || userRole === 'admin';

  useEffect(() => {
    if (formId) {
      const foundForm = forms.find(f => f.id === formId);
      setForm(foundForm);
    }
  }, [formId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Form Submitted!",
        description: `Your response for "${form?.title}" has been recorded.`
    });
    router.back();
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Form not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Forms
        </Button>
        {canManageForm && (
          <Button variant="secondary" onClick={() => router.push(`/dashboard/forms/${formId}/responses`)}>
            <FileText className="mr-2 h-4 w-4" />
            View Responses
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">{form.title}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
              {form.fields.map((field) => (
              <Card key={field.id}>
                  <CardContent className="pt-6">
                      <div className="space-y-2">
                          <Label htmlFor={String(field.id)} className="text-base font-semibold">{field.label}</Label>
                          {field.type === 'text' && <Input id={String(field.id)} />}
                          {field.type === 'textarea' && <Textarea id={String(field.id)} />}
                          {field.type === 'select' && (
                              <RadioGroup id={String(field.id)}>
                                  {field.options?.map((option: string, index: number) => (
                                      <div key={index} className="flex items-center space-x-2">
                                          <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                                          <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                                      </div>
                                  ))}
                              </RadioGroup>
                          )}
                      </div>
                  </CardContent>
              </Card>
              ))}
              <div className="flex justify-end">
                  <Button type="submit" size="lg">
                      <Send className="mr-2 h-4 w-4"/>
                      Submit Form
                  </Button>
              </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
