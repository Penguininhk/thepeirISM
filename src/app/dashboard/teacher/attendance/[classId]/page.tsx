
import { classLists } from '@/lib/data';
import TakeAttendanceClient from '@/components/teacher/take-attendance-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return classLists.map((cl) => ({
    classId: cl.id,
  }));
}

export default async function TakeAttendancePage({ params }: { params: Promise<{ classId: string }> }) {
  const resolvedParams = await params;
  return <TakeAttendanceClient classId={resolvedParams.classId} />;
}
