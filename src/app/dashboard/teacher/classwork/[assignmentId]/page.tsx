
import { teacherAssignments } from '@/lib/data';
import GradeAssignmentClient from '@/components/teacher/grade-assignment-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return teacherAssignments.map((assignment) => ({
    assignmentId: assignment.id,
  }));
}

export default async function GradeAssignmentPage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const resolvedParams = await params;
  return <GradeAssignmentClient assignmentId={resolvedParams.assignmentId} />;
}
