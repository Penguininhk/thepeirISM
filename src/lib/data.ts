
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
  attendance: { date: string; status: 'present' | 'late' | 'absent', course: { name: string } }[];
  courses: { id: string; name: string; code: string; teacher: { name: string }; block: string; }[];
  assignments: {
    id: string;
    title: string;
    course: { name: string };
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: { letter: string; percentage: number };
  }[];
  schedule: {
    block: string;
    course: { name: string; code: string; room: string; } | null;
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
    id: string;
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
  block: string;
  term: number;
};

export type Forum = {
  id: string;
  title: string;
  description: string;
  threadCount: number;
  postCount: number;
};

export type ForumTopic = {
  id: string;
  forumId: string;
  title: string;
  author: { id: string, name: string, avatarUrl: string };
  replyCount: number;
  lastPost: {
    author: { id: string, name: string };
    timestamp: string; // ISO 8601
  }
};

export type Assignment = {
    id: string;
    title: string;
    course: { id: string; name: string };
    dueDate: string; // ISO String
    maxPoints: number;
};

export type Submission = {
    id: string;
    assignmentId: string;
    student: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    status: 'submitted' | 'graded';
    submittedAt: string; // ISO String
    grade?: number; // points
};

// --- MOCK DATA ---

export const teacherProfile: Teacher = {
  id: 'usr-teach-001',
  name: 'Dr. Evelyn Reed',
  email: 'e.reed@school.edu',
  role: 'teacher',
  avatarUrl: getImageUrl('user-avatar-2'),
  courses: [
    { id: 'crs-101', name: 'AP Marine Biology' },
    { id: 'crs-102', name: 'AP English Literature' },
  ],
};

const studentCourses = [
  { id: 'crs-101', name: 'AP Marine Biology', code: 'SCI-301', teacher: { name: 'Dr. Evelyn Reed' }, block: 'A' },
  { id: 'crs-201', name: 'AP Calculus BC', code: 'MATH-301', teacher: { name: 'Mr. David Chen' }, block: 'B' },
  { id: 'crs-401', name: 'AP Studio Art: 2D', code: 'ART-210', teacher: { name: 'Ms. Chloe Kim' }, block: 'C' },
  { id: 'crs-301', name: 'AP World History', code: 'HIST-202', teacher: { name: 'Mr. Samuel Greene'}, block: 'D' },
  { id: 'crs-102', name: 'AP English Literature', code: 'ENG-401', teacher: { name: 'Dr. Evelyn Reed'}, block: 'F' },
];

export const studentProfile: Student = {
  id: 'usr-stud-001',
  name: 'Alice Johnson',
  email: 'alice@school.edu',
  role: 'student',
  avatarUrl: getImageUrl('user-avatar-1'),
  attendance: [
    { date: '2024-05-20', status: 'present', course: { name: 'AP Marine Biology'} },
    { date: '2024-05-21', status: 'present', course: { name: 'AP Calculus BC'} },
    { date: '2024-05-22', status: 'late', course: { name: 'AP Studio Art: 2D'} },
    { date: '2024-05-23', status: 'present', course: { name: 'AP World History'} },
    { date: '2024-05-24', status: 'absent', course: { name: 'AP English Literature'} },
    { date: '2024-05-20', status: 'present', course: { name: 'AP Calculus BC'} },
    { date: '2024-05-21', status: 'present', course: { name: 'AP Marine Biology'} },
    { date: '2024-05-22', status: 'present', course: { name: 'AP World History'} },
    { date: '2024-05-23', status: 'late', course: { name: 'AP Calculus BC'} },
    { date: '2024-05-24', status: 'present', course: { name: 'AP Marine Biology'} },
  ],
  courses: studentCourses,
  assignments: [
    { id: 'asg-001', title: 'Coral Reef Ecosystem Essay', course: { name: 'AP Marine Biology' }, dueDate: '2024-06-05', status: 'graded', grade: { letter: 'A-', percentage: 92 } },
    { id: 'asg-002', title: 'Derivative Practice Problems', course: { name: 'AP Calculus BC' }, dueDate: '2024-06-08', status: 'submitted' },
    { id: 'asg-003', title: 'Final Project Proposal', course: { name: 'AP Studio Art: 2D' }, dueDate: '2024-06-12', status: 'pending' },
    { id: 'asg-004', title: 'Poetry Analysis: The Romantics', course: { name: 'AP English Literature' }, dueDate: '2024-06-15', status: 'pending' },
    { id: 'asg-005', title: 'DBQ: The Silk Road', course: { name: 'AP World History' }, dueDate: '2024-06-10', status: 'submitted' },
    { id: 'asg-006', title: 'Whale Migration Patterns Quiz', course: { name: 'AP Marine Biology' }, dueDate: '2024-06-18', status: 'pending' },
  ],
  schedule: [
    { block: 'A', course: { name: 'AP Marine Biology', code: 'SCI-301', room: 'S201' } },
    { block: 'B', course: { name: 'AP Calculus BC', code: 'MATH-301', room: 'M105' } },
    { block: 'C', course: { name: 'AP Studio Art: 2D', code: 'ART-210', room: 'A110' } },
    { block: 'D', course: { name: 'AP World History', code: 'HIST-202', room: 'H302' } },
    { block: 'E', course: null }, // Free block
    { block: 'F', course: { name: 'AP English Literature', code: 'ENG-401', room: 'L212' } },
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
    title: 'AP Marine Biology Mid-term Reminder',
    content: 'This is a reminder that the AP Marine Biology mid-term exam is next Wednesday. It will cover all topics from the beginning of the semester up to the chapter on deep-sea ecosystems. A study guide has been posted.',
    author: { name: 'Dr. Evelyn Reed', id: 'usr-teach-001' },
    date: '2024-05-22T14:00:00Z',
    classId: 'crs-101',
  },
];

export const classLists: ClassInfo[] = [
  {
    id: 'cl-101',
    course: { id: 'crs-101', name: 'AP Marine Biology', code: 'SCI-301', teacher: { id: 'usr-teach-001' } },
    students: [
      { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
      { id: 'usr-stud-002', name: 'Bob Williams', avatarUrl: getImageUrl('user-avatar-3') },
      { id: 'usr-stud-003', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { id: 'usr-stud-006', name: 'Frank Green', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    ],
  },
  {
    id: 'cl-102',
    course: { id: 'crs-102', name: 'AP English Literature', code: 'ENG-401', teacher: { id: 'usr-teach-001' } },
    students: [
      { id: 'usr-stud-004', name: 'Diana Prince', avatarUrl: getImageUrl('user-avatar-4') },
      { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
      { id: 'usr-stud-005', name: 'Eve Adams', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    ],
  },
];

export const availableCourses: Course[] = [
    // Term 1
    { id: 'crs-101-t1', name: 'AP Marine Biology', code: 'SCI-301', description: 'Explore marine ecosystems.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-marine-biology'), block: 'A', term: 1 },
    { id: 'crs-201-t1', name: 'AP Calculus BC', code: 'MATH-301', description: 'Advanced calculus concepts.', teacher: { name: 'Mr. David Chen'}, imageUrl: getImageUrl('course-calculus'), block: 'B', term: 1 },
    { id: 'crs-401-t1', name: 'AP Studio Art: 2D', code: 'ART-210', description: 'Develop your artistic portfolio.', teacher: { name: 'Ms. Chloe Kim'}, imageUrl: getImageUrl('course-digital-art'), block: 'C', term: 1 },
    { id: 'crs-301-t1', name: 'AP World History', code: 'HIST-202', description: 'Survey major global events.', teacher: { name: 'Mr. Samuel Greene'}, imageUrl: getImageUrl('course-world-history'), block: 'D', term: 1 },
    { id: 'crs-501-t1', name: 'Intro to Robotics', code: 'TECH-110', description: 'Build and program robots.', teacher: { name: 'Ms. Inoue Tanaka'}, imageUrl: getImageUrl('course-robotics'), block: 'E', term: 1 },
    { id: 'crs-102-t1', name: 'AP English Literature', code: 'ENG-401', description: 'Analyze classic literature.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-creative-writing'), block: 'F', term: 1 },

    // Term 2
    { id: 'crs-103-t2', name: 'Genetics', code: 'SCI-302', description: 'The study of heredity.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-marine-biology'), block: 'A', term: 2 },
    { id: 'crs-202-t2', name: 'Linear Algebra', code: 'MATH-302', description: 'Matrices, vectors, and spaces.', teacher: { name: 'Mr. David Chen'}, imageUrl: getImageUrl('course-calculus'), block: 'B', term: 2 },
    { id: 'crs-402-t2', name: '3D Modeling', code: 'ART-211', description: 'Create three-dimensional art.', teacher: { name: 'Ms. Chloe Kim'}, imageUrl: getImageUrl('course-digital-art'), block: 'C', term: 2 },
    { id: 'crs-302-t2', name: 'AP European History', code: 'HIST-301', description: 'Renaissance to modern Europe.', teacher: { name: 'Mr. Samuel Greene'}, imageUrl: getImageUrl('course-world-history'), block: 'D', term: 2 },
    { id: 'crs-502-t2', name: 'Advanced Robotics', code: 'TECH-210', description: 'Advanced robotic systems.', teacher: { name: 'Ms. Inoue Tanaka'}, imageUrl: getImageUrl('course-robotics'), block: 'E', term: 2 },
    { id: 'crs-104-t2', name: 'Creative Non-Fiction', code: 'ENG-402', description: 'Writing compelling true stories.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-creative-writing'), block: 'F', term: 2 },
    
    // Term 3
    { id: 'crs-105-t3', name: 'Environmental Science', code: 'SCI-303', description: 'Humans and the environment.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-marine-biology'), block: 'A', term: 3 },
    { id: 'crs-203-t3', name: 'Statistics', code: 'MATH-303', description: 'The science of data.', teacher: { name: 'Mr. David Chen'}, imageUrl: getImageUrl('course-calculus'), block: 'B', term: 3 },
    { id: 'crs-403-t3', name: 'Animation', code: 'ART-212', description: 'Bring your creations to life.', teacher: { name: 'Ms. Chloe Kim'}, imageUrl: getImageUrl('course-digital-art'), block: 'C', term: 3 },
    { id: 'crs-303-t3', name: 'AP US Government', code: 'HIST-302', description: 'Study of the US political system.', teacher: { name: 'Mr. Samuel Greene'}, imageUrl: getImageUrl('course-world-history'), block: 'D', term: 3 },
    { id: 'crs-503-t3', name: 'AI & Machine Learning', code: 'TECH-310', description: 'The future of technology.', teacher: { name: 'Ms. Inoue Tanaka'}, imageUrl: getImageUrl('course-robotics'), block: 'E', term: 3 },
    { id: 'crs-106-t3', name: 'Shakespeare', code: 'ENG-403', description: 'A deep dive into the Bard.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-creative-writing'), block: 'F', term: 3 },
    
    // Add more courses to ensure choices
    { id: 'crs-alt-A1', name: 'Oceanography', code: 'SCI-304', description: 'Study of the oceans.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-marine-biology'), block: 'A', term: 1 },
    { id: 'crs-alt-A2', name: 'Astrophysics', code: 'SCI-401', description: 'The physics of the universe.', teacher: { name: 'Dr. Evelyn Reed'}, imageUrl: getImageUrl('course-marine-biology'), block: 'A', term: 1 },
    { id: 'crs-alt-B1', name: 'Number Theory', code: 'MATH-401', description: 'The properties of integers.', teacher: { name: 'Mr. David Chen'}, imageUrl: getImageUrl('course-calculus'), block: 'B', term: 1 },
    { id: 'crs-alt-B2', name: 'Game Theory', code: 'MATH-402', description: 'The study of strategic decision making.', teacher: { name: 'Mr. David Chen'}, imageUrl: getImageUrl('course-calculus'), block: 'B', term: 1 },
    { id: 'crs-alt-C1', name: 'Photography', code: 'ART-101', description: 'Learn the art of the camera.', teacher: { name: 'Ms. Chloe Kim'}, imageUrl: getImageUrl('course-digital-art'), block: 'C', term: 1 }
];

export const forums: Forum[] = [
  { id: "gen-discuss", title: "General Discussion", description: "A place to chat about school life, events, and more.", threadCount: 1, postCount: 2 },
  { id: "event-planning", title: "Event Planning", description: "Organize and plan upcoming school events and activities.", threadCount: 1, postCount: 2 },
  { id: "tech-support", title: "Tech Support", description: "Get help with portal issues, software, or hardware problems.", threadCount: 1, postCount: 2 },
  { id: "course-sci-301", title: "Class Help: AP Marine Biology", description: "Discussion and study group for AP Marine Biology.", threadCount: 1, postCount: 2 },
];

export const forumTopics: ForumTopic[] = [
  { 
    id: "thread-001",
    forumId: "gen-discuss",
    title: "Thoughts on the new lunch menu?",
    author: { id: "usr-stud-001", name: "Alice Johnson", avatarUrl: getImageUrl('user-avatar-1') },
    replyCount: 1,
    lastPost: {
      author: { id: "usr-teach-001", name: "Dr. Evelyn Reed" },
      timestamp: "2024-05-28T14:00:00Z",
    }
  },
  { 
    id: "thread-002",
    forumId: "event-planning",
    title: "Brainstorming for the End-of-Year party",
    author: { id: "usr-teach-001", name: "Dr. Evelyn Reed", avatarUrl: getImageUrl('user-avatar-2') },
    replyCount: 1,
    lastPost: {
      author: { id: "usr-stud-001", name: "Alice Johnson" },
      timestamp: "2024-05-29T11:20:00Z",
    }
  },
  { 
    id: "thread-003",
    forumId: "tech-support",
    title: "My laptop won't connect to the school WiFi",
    author: { id: "usr-stud-002", name: "Bob Williams", avatarUrl: getImageUrl('user-avatar-3') },
    replyCount: 1,
    lastPost: {
      author: { id: "usr-admin-001", name: "Admin" },
      timestamp: "2024-05-27T18:00:00Z",
    }
  },
  { 
    id: "thread-004",
    forumId: "course-sci-301",
    title: "Study group for the upcoming midterm?",
    author: { id: "usr-stud-001", name: "Alice Johnson", avatarUrl: getImageUrl('user-avatar-1') },
    replyCount: 1,
    lastPost: {
      author: { id: "usr-stud-003", name: "Charlie Brown" },
      timestamp: "2024-05-29T09:00:00Z",
    }
  },
];

export const teacherAssignments: Assignment[] = [
    { id: 'asg-001', title: 'Coral Reef Ecosystem Essay', course: { id: 'crs-101', name: 'AP Marine Biology' }, dueDate: '2024-06-05T23:59:00Z', maxPoints: 100 },
    { id: 'asg-004', title: 'Poetry Analysis: The Romantics', course: { id: 'crs-102', name: 'AP English Literature' }, dueDate: '2024-06-15T23:59:00Z', maxPoints: 50 },
    { id: 'asg-006', title: 'Whale Migration Patterns Quiz', course: { id: 'crs-101', name: 'AP Marine Biology' }, dueDate: '2024-06-18T23:59:00Z', maxPoints: 25 },
];

export const assignmentSubmissions: Submission[] = [
    {
        id: 'sub-001',
        assignmentId: 'asg-001',
        student: { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
        status: 'graded',
        submittedAt: '2024-06-04T10:00:00Z',
        grade: 92
    },
    {
        id: 'sub-002',
        assignmentId: 'asg-001',
        student: { id: 'usr-stud-002', name: 'Bob Williams', avatarUrl: getImageUrl('user-avatar-3') },
        status: 'submitted',
        submittedAt: '2024-06-05T11:30:00Z',
    },
     {
        id: 'sub-003',
        assignmentId: 'asg-004',
        student: { id: 'usr-stud-004', name: 'Diana Prince', avatarUrl: getImageUrl('user-avatar-4') },
        status: 'submitted',
        submittedAt: '2024-06-14T21:00:00Z',
    },
     {
        id: 'sub-004',
        assignmentId: 'asg-004',
        student: { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
        status: 'submitted',
        submittedAt: '2024-06-15T09:15:00Z',
    },
];
