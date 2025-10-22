
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, GripVertical, Type, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type FormField = {
  id: number;
  type: 'text' | 'textarea' | 'select';
  label: string;
  options?: string[];
};

export default function NewFormPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [fieldCounter, setFieldCounter] = useState(0);

  const addField = (type: 'text' | 'textarea' | 'select') => {
    const newField: FormField = {
      id: fieldCounter,
      type,
      label: `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      ...(type === 'select' && { options: ['Option 1'] }),
    };
    setFields([...fields, newField]);
    setFieldCounter(fieldCounter + 1);
  };

  const removeField = (id: number) => {
    setFields(fields.filter(field => field.id !== id));
  };
  
  const handlePublish = () => {
    toast({
      title: "Form Published!",
      description: "The new form is now available for users to fill out.",
    });
    router.push('/dashboard/forms');
  };

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forms
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Create a New Form</h1>
          <p className="text-muted-foreground">Build a custom form for your students or the school.</p>
        </div>
        <Button onClick={handlePublish}>Publish Form</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
                <Input placeholder="Form Title" className="text-2xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 h-auto"/>
                <Separator className="my-2"/>
                <Textarea placeholder="Form description (optional)" className="border-0 shadow-none focus-visible:ring-0 p-0"/>
            </CardContent>
          </Card>

          {fields.map(field => (
            <Card key={field.id}>
              <CardContent className="p-4 flex items-start gap-4">
                 <GripVertical className="h-5 w-5 text-muted-foreground mt-3 cursor-grab"/>
                 <div className="flex-grow space-y-2">
                    <Input defaultValue={field.label} className="font-semibold"/>
                    {field.type === 'text' && <Input placeholder="Sample short-answer text" disabled/>}
                    {field.type === 'textarea' && <Textarea placeholder="Sample long-answer text" disabled/>}
                    {field.type === 'select' && (
                        <div className="space-y-2">
                            {field.options?.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Input defaultValue={opt}/>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm">Add Option</Button>
                        </div>
                    )}
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                    <Trash2 className="h-5 w-5 text-destructive"/>
                 </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Add Field</CardTitle>
                    <CardDescription>Add new input fields to your form.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => addField('text')}>
                        <Type className="mr-2 h-4 w-4"/> Short Answer
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => addField('textarea')}>
                        <List className="mr-2 h-4 w-4"/> Paragraph
                    </Button>
                     <Button variant="outline" className="w-full justify-start" onClick={() => addField('select')}>
                        <List className="mr-2 h-4 w-4"/> Multiple Choice
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
