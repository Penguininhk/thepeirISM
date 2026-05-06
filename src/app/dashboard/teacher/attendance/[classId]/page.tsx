
import { use } from 'react';
import { classLists } from '@/lib/data';
import TakeAttendanceClient from '@/components/teacher/take-attendance-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return classLists.map((cl) => ({
    classId: cl.id,
  }));
}

export default function TakeAttendancePage({ params }: { params: Promise<{ classId: string }> }) {
  const resolvedParams = use(params);
  return <TakeAttendanceClient classId={resolvedParams.classId} />;
}
