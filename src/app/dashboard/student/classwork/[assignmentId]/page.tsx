
import { use } from 'react';
import { teacherAssignments } from '@/lib/data';
import StudentAssignmentDetailClient from '@/components/student/assignment-detail-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return teacherAssignments.map((assignment) => ({
    assignmentId: assignment.id,
  }));
}

export default function StudentAssignmentDetailPage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const resolvedParams = use(params);
  return <StudentAssignmentDetailClient assignmentId={resolvedParams.assignmentId} />;
}
