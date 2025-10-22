
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { forms } from '@/lib/data';
import type { Form as FormType } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function FormPage({ params }: { params: { formId: string } }) {
  const resolvedParams = use(params);
  const { formId } = resolvedParams;
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<FormType | undefined>();

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
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Forms
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">{form.title}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
      </Card>
      
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
    </div>
  );
}
