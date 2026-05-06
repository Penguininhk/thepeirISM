
import { teacherAssignments } from '@/lib/data';
import StudentAssignmentDetailClient from '@/components/student/assignment-detail-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return teacherAssignments.map((assignment) => ({
    assignmentId: assignment.id,
  }));
}

export default async function StudentAssignmentDetailPage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const resolvedParams = await params;
  return <StudentAssignmentDetailClient assignmentId={resolvedParams.assignmentId} />;
}
