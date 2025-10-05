// This file contains mock data. It will be replaced by Firebase data services.
import { z } from 'zod';

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  classIds?: string[];
};

export type Course = {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  classIds?: string[];
};

export type Announcement = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: Date | string; // Use serializable types
  updatedAt?: Date | string;
  classIds?: string[];
  schoolWide?: boolean;
};

export type Assignment = {
  id:string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date | string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  maxPoints: number;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate: Date | string;
  content: string; // URL to file or text content
  grade?: number;
  teacherFeedback?: string;
};

export type Class = {
  id: string;
  courseId: string;
  name: string;
  schedule: string;
  studentIds?: string[];
}

export type ActionLog = {
  id: string;
  timestamp: any; // Allow for Firestore Timestamp on server, string on client
  adminId: string;
  actionType: 'user_status_update' | 'user_created';
  details: string;
};


export const UpdateUserStatusInputSchema = z.object({
  userId: z.string().describe('The ID of the user to update.'),
  status: z.enum(['approved', 'rejected']).describe('The new status for the user.'),
  email: z.string().email().describe('The email of the user to notify.'),
  role: z.enum(['student', 'teacher', 'admin']).describe('The role of the user.'),
});
export type UpdateUserStatusInput = z.infer<typeof UpdateUserStatusInputSchema>;


// The following data is kept for page structure reference and will be removed.
export const studentProfile = {
  id: 'usr-001',
  name: 'Alice Johnson',
  email: 'alice@school.edu',
  role: 'student',
  avatarUrl: 'https://picsum.photos/seed/1/100/100',
  attendance: [
    { date: '2024-05-20', status: 'present' },
  ],
  courses: [],
  assignments: [],
};

export const teacherProfile = {
  id: 'usr-teach-001',
  name: 'Dr. Evelyn Reed',
  email: 'e.reed@school.edu',
  role: 'teacher',
  avatarUrl: 'https://picsum.photos/seed/4/100/100',
  courses: [],
};

export const announcements = [
  { id: 'ann-001', title: 'School-wide Science Fair', content: 'The annual science fair is scheduled for next month.', author: { name: 'Dr. Evelyn Reed', id: 'usr-teach-001' }, date: '2024-05-15T10:00:00Z' },
];

export const classLists = [
  { id: 'cl-101', course: { name: 'Marine Biology', code: 'SCI-301', teacher: { id: 'usr-teach-001'} }, students: [] },
];

export const availableCourses = [
  { id: 'crs-201', name: 'Calculus I', code: 'MATH-301', description: 'An introduction to differential and integral calculus.', teacher: { name: 'Mr. David Chen'}, imageUrl: 'https://picsum.photos/seed/105/600/400' },
];
