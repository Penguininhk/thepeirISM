
// This file contains mock data for "The PIER" showcase app.

import { PlaceHolderImages } from '@/lib/placeholder-images';

// Helper function to find an image URL by its ID from the placeholder data
const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatarUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type Student = User & {
  role: 'student';
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

export type Teacher = User & {
  role: 'teacher';
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
    teacher: { id: string; name: string; };
  };
  students: {
    id: string;
    name: string;
    avatarUrl: string;
  }[];
  joinCode: string;
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

export type ChatMessage = {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  timestamp: string; // ISO string
  content: string;
};

export type ChatChannel = {
  id: string;
  name: string;
  description: string;
  messages: ChatMessage[];
};

export type ActionLog = {
  id: string;
  timestamp: string; // ISO 8601
  admin: {
    name: string;
    id: string;
  };
  actionType: 'user_status_update' | 'user_created' | 'user_deleted' | 'course_created' | 'course_deleted';
  details: string;
};

export type ReportCard = {
  id: string;
  student: { id: string; name: string };
  classId: string;
  course: { name: string };
  teacher: { id: string; name: string };
  semester: string;
  grade: string;
  comments: string;
  status: 'draft' | 'pending_review' | 'released';
};


// --- MOCK DATA ---

const adminUser = {
  id: 'usr-admin-001',
  name: 'Admin User',
}

const teachersCollection: Teacher[] = [
  { id: 'usr-teach-001', name: 'Dr. Evelyn Reed', email: 'e.reed@theharbourschool.edu.hk', role: 'teacher', status: 'approved', avatarUrl: getImageUrl('user-avatar-2'), courses: [{ id: 'crs-101', name: 'AP Marine Biology' },{ id: 'crs-102', name: 'AP English Literature' }] },
  { id: 'usr-teach-002', name: 'Mr. David Chen', role: 'teacher', email: 'd.chen@theharbourschool.edu.hk', status: 'approved', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', courses: [{id: 'crs-201', name: 'AP Calculus BC'}] },
  { id: 'usr-teach-003', name: 'Ms. Chloe Kim', role: 'teacher', email: 'c.kim@theharbourschool.edu.hk', status: 'pending', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', courses: [{id: 'crs-401', name: 'AP Studio Art: 2D'}] },
  { id: 'usr-teach-004', name: 'Mr. Samuel Greene', role: 'teacher', email: 's.greene@theharbourschool.edu.hk', status: 'approved', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026709d', courses: [{id: 'crs-301', name: 'AP World History'}] },
  { id: 'usr-teach-005', name: 'Ms. Inoue Tanaka', role: 'teacher', email: 'i.tanaka@theharbourschool.edu.hk', status: 'approved', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026710d', courses: [{id: 'crs-501', name: 'Intro to Robotics'}] },
];

export const teacherProfile: Teacher = { 
  ...teachersCollection[0],
  courses: [
    ...teachersCollection[0].courses,
    { id: 'crs-201', name: 'AP Calculus BC' },
    { id: 'crs-401', name: 'AP Studio Art: 2D' },
    { id: 'crs-301', name: 'AP World History' }
  ]
};
const otherTeachers = teachersCollection.slice(1);

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
  email: 'alice@theharbourschool.edu.hk',
  role: 'student',
  status: 'approved',
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

const otherStudents: User[] = [
  { id: 'usr-stud-002', name: 'Bob Williams', role: 'student', email: 'bob@theharbourschool.edu.hk', status: 'approved', avatarUrl: getImageUrl('user-avatar-3') },
  { id: 'usr-stud-003', name: 'Charlie Brown', role: 'student', email: 'charlie@theharbourschool.edu.hk', status: 'approved', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'usr-stud-004', name: 'Diana Prince', role: 'student', email: 'diana@theharbourschool.edu.hk', status: 'rejected', avatarUrl: getImageUrl('user-avatar-4') },
  { id: 'usr-stud-005', name: 'Eve Adams', role: 'student', email: 'eve@theharbourschool.edu.hk', status: 'pending', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { id: 'usr-stud-006', name: 'Frank Green', role: 'student', email: 'frank@theharbourschool.edu.hk', status: 'approved', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
];

export const users: User[] = [
  studentProfile,
  ...otherStudents,
  ...teachersCollection,
];

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
    author: { name: 'Admin User', id: 'usr-admin-001' },
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
    course: { id: 'crs-101', name: 'AP Marine Biology', code: 'SCI-301', teacher: { id: 'usr-teach-001', name: 'Dr. Evelyn Reed' } },
    students: [
      { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
      { id: 'usr-stud-002', name: 'Bob Williams', avatarUrl: getImageUrl('user-avatar-3') },
      { id: 'usr-stud-003', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { id: 'usr-stud-006', name: 'Frank Green', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    ],
    joinCode: 'AB12CD',
  },
  {
    id: 'cl-102',
    course: { id: 'crs-102', name: 'AP English Literature', code: 'ENG-401', teacher: { id: 'usr-teach-001', name: 'Dr. Evelyn Reed' } },
    students: [
      { id: 'usr-stud-004', name: 'Diana Prince', avatarUrl: getImageUrl('user-avatar-4') },
      { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
      { id: 'usr-stud-005', name: 'Eve Adams', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    ],
    joinCode: 'EF34GH',
  },
   {
    id: 'cl-201',
    course: { id: 'crs-201', name: 'AP Calculus BC', code: 'MATH-301', teacher: { id: 'usr-teach-002', name: 'Mr. David Chen' } },
    students: [
      { id: 'usr-stud-001', name: 'Alice Johnson', avatarUrl: getImageUrl('user-avatar-1') },
      { id: 'usr-stud-003', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    ],
    joinCode: 'IJ56KL',
  },
   {
    id: 'cl-401',
    course: { id: 'crs-401', name: 'AP Studio Art: 2D', code: 'ART-210', teacher: { id: 'usr-teach-003', name: 'Ms. Chloe Kim' } },
    students: [
      { id: 'usr-stud-002', name: 'Bob Williams', avatarUrl: getImageUrl('user-avatar-3') },
    ],
    joinCode: 'MN78OP',
  },
  {
    id: 'cl-301',
    course: { id: 'crs-301', name: 'AP World History', code: 'HIST-202', teacher: { id: 'usr-teach-004', name: 'Mr. Samuel Greene' } },
    students: [
      { id: 'usr-stud-005', name: 'Eve Adams', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    ],
    joinCode: 'QR90ST',
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

export const facultyChat: ChatChannel[] = [
  {
    id: 'chat-001',
    name: 'general',
    description: 'General announcements and discussion for all faculty.',
    messages: [
      { id: 'msg-001', author: { ...teacherProfile }, timestamp: '2024-05-29T09:05:00Z', content: 'Morning all! Just a reminder that final grades are due this Friday.' },
      { id: 'msg-002', author: { ...otherTeachers[0] as Teacher }, timestamp: '2024-05-29T09:15:00Z', content: 'Thanks for the reminder, Evelyn. I\'ve got a few more essays to get through.' },
      { id: 'msg-003', author: { ...otherTeachers[1] as Teacher }, timestamp: '2024-05-29T10:30:00Z', content: 'Anyone else having trouble with the new projector in room 204?' },
    ],
  },
  {
    id: 'chat-002',
    name: 'curriculum-planning',
    description: 'Collaboration on curriculum development for the next school year.',
    messages: [
      { id: 'msg-004', author: { ...otherTeachers[3] as Teacher }, timestamp: '2024-05-28T11:00:00Z', content: 'I was thinking of introducing a new segment on the Cold War for the World History class. Thoughts?' },
      { id: 'msg-005', author: { ...teacherProfile }, timestamp: '2024-05-28T11:25:00Z', content: 'That sounds great, Samuel. We could tie it into the literature of that period in the English class.' },
    ],
  },
  {
    id: 'chat-003',
    name: 'random',
    description: 'A place for non-work-related chat and fun.',
    messages: [
       { id: 'msg-006', author: { ...otherTeachers[2] as Teacher }, timestamp: '2024-05-27T15:00:00Z', content: 'Anyone seen the latest season of that space show? No spoilers!' },
    ],
  }
]

export const actionLogs: ActionLog[] = [
  {
    id: 'log-001',
    timestamp: '2024-05-30T10:00:00Z',
    admin: adminUser,
    actionType: 'user_status_update',
    details: "Approved 'Ms. Chloe Kim' registration.",
  },
  {
    id: 'log-002',
    timestamp: '2024-05-29T14:20:00Z',
    admin: adminUser,
    actionType: 'user_status_update',
    details: "Rejected 'Diana Prince' registration.",
  },
  {
    id: 'log-003',
    timestamp: '2024-05-28T11:00:00Z',
    admin: adminUser,
    actionType: 'user_created',
    details: "Created new student account 'Bob Williams'.",
  },
  {
    id: 'log-004',
    timestamp: '2024-05-27T09:00:00Z',
    admin: adminUser,
    actionType: 'course_deleted',
    details: "Deleted course 'Intro to Philosophy'.",
  },
  {
    id: 'log-005',
    timestamp: '2024-05-26T16:45:00Z',
    admin: adminUser,
    actionType: 'user_deleted',
    details: "Deleted user account 'old.student@theharbourschool.edu.hk'.",
  },
];

export const reportCards: ReportCard[] = [
  {
    id: 'rc-001',
    student: { id: 'usr-stud-001', name: 'Alice Johnson' },
    classId: 'cl-101',
    course: { name: 'AP Marine Biology' },
    teacher: { id: 'usr-teach-001', name: 'Dr. Evelyn Reed' },
    semester: 'Fall 2023',
    grade: 'A-',
    comments: 'Alice has shown a remarkable aptitude for marine biology. Her participation in class discussions is always insightful. Keep up the excellent work!',
    status: 'released',
  },
  {
    id: 'rc-002',
    student: { id: 'usr-stud-001', name: 'Alice Johnson' },
    classId: 'cl-102',
    course: { name: 'AP English Literature' },
    teacher: { id: 'usr-teach-001', name: 'Dr. Evelyn Reed' },
    semester: 'Fall 2023',
    grade: 'B+',
    comments: 'Alice is a strong writer, but she could benefit from contributing more to group discussions. Her essays are well-researched and thoughtfully argued.',
    status: 'released',
  },
   {
    id: 'rc-003',
    student: { id: 'usr-stud-002', name: 'Bob Williams' },
    classId: 'cl-101',
    course: { name: 'AP Marine Biology' },
    teacher: { id: 'usr-teach-001', name: 'Dr. Evelyn Reed' },
    semester: 'Fall 2023',
    grade: 'B',
    comments: 'Bob has a solid grasp of the material. I encourage him to be more proactive in asking questions to deepen his understanding.',
    status: 'pending_review',
  },
    {
    id: 'rc-004',
    student: { id: 'usr-stud-003', name: 'Charlie Brown' },
    classId: 'cl-101',
    course: { name: 'AP Marine Biology' },
    teacher: { id: 'usr-teach-001', name: 'Dr. Evelyn Reed' },
    semester: 'Fall 2023',
    grade: 'C+',
    comments: 'Charlie is a pleasure to have in class, but he has struggled with some of the more complex topics. Extra help sessions would be beneficial.',
    status: 'draft',
  }
];
