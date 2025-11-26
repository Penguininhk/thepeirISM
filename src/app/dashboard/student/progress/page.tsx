
'use client';

import * as React from 'react';
import { studentProfile, teacherAssignments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const chartConfig = {
  grade: {
    label: 'Grade (%)',
    color: 'hsl(var(--primary))',
  },
  present: { label: 'Present', color: 'hsl(var(--chart-1))' },
  late: { label: 'Late', color: 'hsl(var(--chart-2))' },
  absent: { label: 'Absent', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

export default function ProgressPage() {
  const gradeData = studentProfile.assignments
    .filter(a => a.status === 'graded' && a.grade)
    .map(a => ({
      name: teacherAssignments.find(ta => ta.id === a.id)?.title.substring(0, 15) + '...' || 'Assignment',
      grade: a.grade?.percentage,
    }))
    .slice(-10); // Show last 10 graded assignments

  const attendanceData = [
    { name: 'Present', value: studentProfile.attendance.filter(a => a.status === 'present').length, fill: 'var(--color-present)' },
    { name: 'Late', value: studentProfile.attendance.filter(a => a.status === 'late').length, fill: 'var(--color-late)' },
    { name: 'Absent', value: studentProfile.attendance.filter(a => a.status === 'absent').length, fill: 'var(--color-absent)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Progress</h1>
        <p className="text-muted-foreground">Visualize your academic performance and trends.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Grade Trends</CardTitle>
            <CardDescription>Your percentage scores on recent assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart data={gradeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="grade" stroke="var(--color-grade)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>A breakdown of your attendance record.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-[300px] w-full max-w-[250px]">
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={attendanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
