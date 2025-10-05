'use client';

import * as React from 'react';
import { studentProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Send, Sparkles, X } from "lucide-react";
import { askStudyBuddy, type StudyBuddyInput } from '@/ai/flows/study-buddy-flow';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLogo from '@/components/app-logo';
import { cn } from '@/lib/utils';

export function StudyBuddyBubble() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [course, setCourse] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [conversation, setConversation] = React.useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, isLoading]);

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
    <>
      <div className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isOpen ? "w-[400px] h-[600px] pointer-events-auto" : "w-14 h-14 pointer-events-none"
      )}>
        <Card className={cn(
          "h-full w-full flex flex-col transition-all duration-300 overflow-hidden shadow-2xl",
          isOpen ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center justify-between p-4 border-b bg-card">
              <div className='flex items-center gap-2'>
                <BrainCircuit className="h-6 w-6 text-primary"/>
                <h3 className="font-semibold font-headline">AI Study Buddy</h3>
              </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-6">
            {conversation.length === 0 && (
              <div className="text-center text-muted-foreground pt-16">
                <Sparkles className="h-12 w-12 mx-auto mb-4"/>
                <p className="text-lg">Welcome! I'm here to help.</p>
                <p>Select a course and ask a question to get started.</p>
              </div>
            )}
            {conversation.map((entry, index) => (
              <div key={index} className={`flex items-start gap-3 ${entry.role === 'user' ? 'justify-end' : ''}`}>
                 {entry.role === 'ai' && (
                    <div className="relative h-8 w-8 shrink-0">
                      <AppLogo className="h-full w-full" />
                      <Sparkles className="absolute -bottom-1 -right-1 h-4 w-4 fill-amber-400 text-white" />
                    </div>
                 )}
                <div className={`max-w-xs rounded-lg px-3 py-2 ${entry.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                      {entry.content}
                    </ReactMarkdown>
                </div>
                {entry.role === 'user' && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={studentProfile.avatarUrl} alt={studentProfile.name} />
                        <AvatarFallback>{getInitials(studentProfile.name)}</AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                  <div className="relative h-8 w-8 shrink-0">
                    <AppLogo className="h-full w-full" />
                    <Sparkles className="absolute -bottom-1 -right-1 h-4 w-4 fill-amber-400 text-white" />
                  </div>
                <div className="max-w-xs rounded-lg px-3 py-2 bg-muted w-full space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-card">
            <div className="grid gap-2">
              <Select onValueChange={setCourse} value={course}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a course..." />
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
                  placeholder="Ask a question..."
                  className="pr-12 text-sm min-h-[60px]"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-9"
                  onClick={handleAsk}
                  disabled={!course || !question || isLoading}
                >
                  <Send className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

       <Button
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          isOpen ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
        )}
        onClick={() => setIsOpen(true)}
      >
        <BrainCircuit className="h-7 w-7" />
        <Sparkles className="absolute bottom-1 right-1 h-5 w-5 fill-amber-400 text-white" />
      </Button>
    </>
  );
}
