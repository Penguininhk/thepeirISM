'use client';

import * as React from 'react';
import { studentProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Send, Sparkles } from "lucide-react";
import { askStudyBuddy, type StudyBuddyInput } from '@/ai/flows/study-buddy-flow';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLogo from '@/components/app-logo';

export default function StudyBuddyPage() {
  const [course, setCourse] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [conversation, setConversation] = React.useState<{ role: 'user' | 'ai'; content: string }[]>([]);

  const handleAsk = async () => {
    if (!course || !question) return;

    const userMessage = { role: 'user' as const, content: question };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQuestion('');

    try {
      const input: StudyBuddyInput = { courseName: course, question: question };
      const response = await askStudyBuddy(input);
      const aiMessage = { role: 'ai' as const, content: response };
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking study buddy:", error);
      const errorMessage = { role: 'ai' as const, content: 'Sorry, I had a little trouble thinking. Please try asking again.' };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };
  
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary"/>
          AI Study Buddy
        </h1>
        <p className="text-muted-foreground">Your personal AI tutor, ready to help with any subject.</p>
      </div>

      <div className="flex-grow overflow-y-auto pr-4 space-y-6">
        {conversation.length === 0 && (
          <div className="text-center text-muted-foreground pt-16">
            <Sparkles className="h-12 w-12 mx-auto mb-4"/>
            <p className="text-lg">Welcome! I'm here to help.</p>
            <p>Select a course and ask a question to get started.</p>
          </div>
        )}
        {conversation.map((entry, index) => (
          <div key={index} className={`flex items-start gap-4 ${entry.role === 'user' ? 'justify-end' : ''}`}>
             {entry.role === 'ai' && (
                <div className="relative h-10 w-10 shrink-0">
                  <AppLogo className="h-full w-full" />
                  <Sparkles className="absolute -bottom-1 -right-1 h-5 w-5 fill-amber-400 text-white" />
                </div>
             )}
            <div className={`max-w-2xl rounded-lg px-4 py-3 ${entry.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                  {entry.content}
                </ReactMarkdown>
            </div>
            {entry.role === 'user' && (
                <Avatar className="h-10 w-10">
                    <AvatarImage src={studentProfile.avatarUrl} alt={studentProfile.name} />
                    <AvatarFallback>{getInitials(studentProfile.name)}</AvatarFallback>
                </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
              <div className="relative h-10 w-10 shrink-0">
                <AppLogo className="h-full w-full" />
                <Sparkles className="absolute -bottom-1 -right-1 h-5 w-5 fill-amber-400 text-white" />
              </div>
            <div className="max-w-2xl rounded-lg px-4 py-3 bg-muted w-full space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <Select onValueChange={setCourse} value={course}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course to ask about..." />
                </SelectTrigger>
                <SelectContent>
                  {studentProfile.courses.map(c => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Textarea 
                  placeholder="Ask a question, e.g., 'Can you explain the main causes of the Peloponnesian War?'"
                  className="pr-24"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-16"
                  onClick={handleAsk}
                  disabled={!course || !question || isLoading}
                >
                  <Send className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
