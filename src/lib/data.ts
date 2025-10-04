// This file contains mock data. It will be replaced by Firebase data services.

import { Timestamp } from "firebase/firestore";


export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
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
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  classIds?: string[];
  schoolWide?: boolean;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  maxPoints: number;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate: Timestamp;
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
