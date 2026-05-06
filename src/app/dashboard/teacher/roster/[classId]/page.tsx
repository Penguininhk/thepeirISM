
import { use } from 'react';
import { classLists } from '@/lib/data';
import ClassRosterClient from '@/components/teacher/class-roster-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return classLists.map((cl) => ({
    classId: cl.id,
  }));
}

export default function ClassRosterPage({ params }: { params: Promise<{ classId: string }> }) {
  const resolvedParams = use(params);
  return <ClassRosterClient classId={resolvedParams.classId} />;
}
