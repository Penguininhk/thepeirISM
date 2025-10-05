// This file contains mock data for "The PIER" showcase app.

import { PlaceHolderImages } from '@/lib/placeholder-images';

// Helper function to find an image URL by its ID from the placeholder data
const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';

export type Student = {
  id: string;
  name: string;
  email: string;
  role: 'student';
  avatarUrl: string;
  attendance: { date: string; status: 'present' | 'late' | 'absent' }[];
  courses: { id: string; name: string; code: string; teacher: { name: string } }[];
  assignments: {
    id: string;
    title: string;
    course: { name: string };
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: string;
  }[];
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  role: 'teacher';
  avatarUrl: string;
  courses: { id: string; name: string; }[];
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  author: { name: string; id: string };
  date: string; // ISO format
  classId?: string; // If it's for a specific class
};

export type ClassInfo = {
  id: string;
  course: {
    name: string;
    code: string;
    teacher: { id: string; };
  };
  students: {
    id: string;
    name: string;
    avatarUrl: string;
  }[];
};

export type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher: { name: string };
  imageUrl: string;
};

// --- MOCK DATA ---

export const teacherProfile: Teacher = {
  id: 'usr-teach-001',
  name: 'Dr. Evelyn Reed',
  email: 'e.reed@school.edu',
  role: 'teacher',
  avatarUrl: getImageUrl('user-avatar-2'),
  courses: [
    { id: 'crs-101', name: 'Marine Biology' },
    { id: 'crs-102', name: 'Creative Writing' },
  ],
};

export const studentProfile: Student = {
  id: 'usr-stud-001',
  name: 'Alice Johnson',
  email: 'alice@school.edu',
  role: 'student',
  avatarUrl: getImageUrl('user-avatar-1'),
  attendance: [
    { date: '2024-05-20', status: 'present' },
    { date: '2024-05-21', status: 'present' },
    { date: '2024-05-22', status: 'late' },
    { date: '2024-05-23', status: 'present' },
    { date: '2024-05-24', status: 'absent' },
  ],
  courses: [
    { id: 'crs-101', name: 'Marine Biology', code: 'SCI-301', teacher: { name: 'Dr. Evelyn Reed' } },
    { id: 'crs-201', name: 'Calculus I', code: 'MATH-301', teacher: { name: 'Mr. David Chen' } },
    { id: 'crs-401', name: 'Digital Art', code: 'ART-210', teacher: { name: 'Ms. Chloe Kim' } },
  ],
  assignments: [
    { id: 'asg-001', title: 'Coral Reef Ecosystem Essay', course: { name: 'Marine Biology' }, dueDate: '2024-06-05', status: 'graded', grade: 'A-' },
    { id: 'asg-002', title: 'Derivative Practice Problems', course: { name: 'Calculus I' }, dueDate: '2024-06-08', status: 'submitted' },
    { id: 'asg-003', title: 'Final Project Proposal', course: { name: 'Digital Art' }, dueDate: '2024-06-12', status: 'pending' },
    { id: 'asg-004', title: 'Poetry Analysis', course: { name: 'Creative Writing' }, dueDate: '2024-06-15', status: 'pending' },
  ],
};

export const announcements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'School-wide Science Fair',
    content: 'The annual science fair is scheduled for next month. All students are encouraged to participate. Please see your science teacher for more details on project submission guidelines and deadlines. We look forward to seeing your innovative projects!',
    author: { name: 'Dr. Evelyn Reed', id: 'usr-teach-001' },
    date: '2024-05-15T10:00:00Z',
  },
  {
    id: 'ann-002',
    title: 'Library Closure for Maintenance',
    content: 'Please be advised that the school library will be closed this Friday for system upgrades and maintenance. Make sure to check out any books you need before then. The online catalog will also be temporarily unavailable.',
    author: { name: 'School Administration', id: 'usr-admin-001' },
    date: '2024-05-20T09:00:00Z',
  },
  {
    id: 'ann-003',
    title: 'Marine Biology Mid-term Reminder',
    content: 'This is a reminder that the Marine Biology mid-term exam is next Wednesday. It will cover all topics from the beginning of the semester up to the chapter on deep-sea ecosystems. A study guide has been posted.',
    author: { name: 'Dr. Evelyn Reed', id: 'usr-teach-001' },
    date: '2024-05-22T14:00:00Z',
    classId: 'crs-101',
  },
];

export const classLists: ClassInfo[] = [
  {
    id: 'cl-101',
    course: { name: 'Marine Biology', code: 'SCI-301', teacher: { id: 'usr-teach-001' } },
    students: [
      { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
      { id: 'usr-stud-002', name: 'Bob Williams', avatarUrl: getImageUrl('user-avatar-3') },
      { id: 'usr-stud-003', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    ],
  },
  {
    id: 'cl-102',
    course: { name: 'Creative Writing', code: 'ENG-205', teacher: { id: 'usr-teach-001' } },
    students: [
      { id: 'usr-stud-004', name: 'Diana Prince', avatarUrl: getImageUrl('user-avatar-4') },
      { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
      { id: 'usr-stud-005', name: 'Eve Adams', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    ],
  },
];

export const availableCourses: Course[] = [
    { id: 'crs-101', name: 'Marine Biology', code: 'SCI-301', description: 'Explore the wonders of marine ecosystems, from coral reefs to the deep sea.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-marine-biology') },
    { id: 'crs-201', name: 'Calculus I', code: 'MATH-301', description: 'An introduction to differential and integral calculus, focusing on limits and derivatives.', teacher: { name: 'Mr. David Chen'}, imageUrl: getImageUrl('course-calculus') },
    { id: 'crs-102', name: 'Creative Writing', code: 'ENG-205', description: 'Develop your voice and craft compelling narratives, poetry, and prose.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-creative-writing') },
    { id: 'crs-301', name: 'World History: 1500-Present', code: 'HIST-202', description: 'Survey major global events and transformations from the early modern period to today.', teacher: { name: 'Mr. Samuel Greene'}, imageUrl: getImageUrl('course-world-history') },
    { id: 'crs-401', name: 'Digital Art & Design', code: 'ART-210', description: 'Learn the fundamentals of digital illustration and graphic design using modern tools.', teacher: { name: 'Ms. Chloe Kim'}, imageUrl: getImageUrl('course-digital-art') },
    { id: 'crs-501', name: 'Introduction to Robotics', code: 'TECH-110', description: 'Build and program your first robot. No prior experience required!', teacher: { name: 'Ms. Inoue Tanaka'}, imageUrl: getImageUrl('course-robotics') },
];
