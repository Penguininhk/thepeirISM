
'use client';

import * as React from 'react';
import { reportCards, classLists } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Send, Edit, HeartHandshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ReportCard } from '@/lib/data';

const currentYear = new Date().getFullYear();
const semesters = [`Fall ${currentYear}`, `Spring ${currentYear + 1}`];

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [selectedSemester, setSelectedSemester] = React.useState(semesters[0]);
  
  const filteredReports = reportCards.filter(
    (r) => r.semester === selectedSemester
  );

  const reportsByStatus = {
    pending_review: filteredReports.filter((r) => r.status === 'pending_review'),
    released: filteredReports.filter((r) => r.status === 'released'),
    draft: filteredReports.filter((r) => r.status === 'draft'),
  };

  const handleRelease = (reportId: string, studentName: string) => {
    toast({
      title: 'Report Card Released',
      description: `The report card for ${studentName} has been released to the parent and student.`,
    });
  };
  
  const handleSendBack = (reportId: string, studentName: string) => {
     toast({
      title: 'Report Card Sent Back',
      variant: 'destructive',
      description: `The report card for ${studentName} has been sent back for revision.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Report Cards</h1>
          <p className="text-muted-foreground">Review, release, and manage all student report cards.</p>
        </div>
         <Select onValueChange={setSelectedSemester} defaultValue={selectedSemester}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>

      <Tabs defaultValue="pending_review">
        <TabsList>
          <TabsTrigger value="pending_review">
            Pending Review ({reportsByStatus.pending_review.length})
          </TabsTrigger>
          <TabsTrigger value="released">
            Released ({reportsByStatus.released.length})
          </TabsTrigger>
           <TabsTrigger value="draft">
            Drafts ({reportsByStatus.draft.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending_review" className="mt-4">
          <ReportList 
            reports={reportsByStatus.pending_review} 
            onRelease={handleRelease} 
            onSendBack={handleSendBack}
          />
        </TabsContent>
        <TabsContent value="released" className="mt-4">
           <ReportList reports={reportsByStatus.released} />
        </TabsContent>
         <TabsContent value="draft" className="mt-4">
           <ReportList reports={reportsByStatus.draft} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ReportListProps {
  reports: ReportCard[];
  onRelease?: (id: string, name: string) => void;
  onSendBack?: (id: string, name: string) => void;
}

function ReportList({ reports, onRelease, onSendBack }: ReportListProps) {
  if (reports.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No report cards in this category.</p>
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{report.student.name}</CardTitle>
                    <CardDescription>{report.course.name}</CardDescription>
                  </div>
                   <Badge 
                     variant={report.status === 'released' ? 'default' : report.status === 'pending_review' ? 'secondary' : 'outline'}
                     className={cn({
                       'bg-yellow-100 text-yellow-800 border-yellow-200': report.status === 'pending_review',
                     })}
                   >
                     {report.status.replace('_', ' ')}
                   </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-baseline p-3 bg-muted rounded-md">
                <span className="text-sm font-medium text-muted-foreground">Grade</span>
                <span className="text-2xl font-bold text-primary">{report.grade}</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Teacher Comments:</h4>
                <p className="text-sm text-muted-foreground border-l-2 pl-3">{report.comments}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  - {report.teacher.name}
                </p>
              </div>
              {report.status === 'pending_review' && onRelease && onSendBack && (
                 <div className="flex gap-2 pt-2">
                   <Button size="sm" className="w-full" onClick={() => onRelease(report.id, report.student.name)}>
                     <HeartHandshake className="mr-2 h-4 w-4" /> Release to Parent
                   </Button>
                   <Button size="sm" variant="destructive" className="w-full" onClick={() => onSendBack(report.id, report.student.name)}>
                     <Send className="mr-2 h-4 w-4" /> Send Back
                   </Button>
                 </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
  )
}
