export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatarUrl: string;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher: User;
  imageUrl: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  author: User;
  date: string;
  classId?: string; // Optional: for class-specific announcements
};

export type Assignment = {
  id: string;
  title: string;
  course: Course;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
};

export type AttendanceRecord = {
  date: string;
  status: 'present' | 'absent' | 'late';
};

export type Student = User & {
  role: 'student';
  attendance: AttendanceRecord[];
  courses: Course[];
  assignments: Assignment[];
};

export type ClassList = {
  id: string;
  course: Course;
  students: User[];
}

// Mock Data

export const users: User[] = [
  { id: 'usr-001', name: 'Alice Johnson', email: 'alice@school.edu', role: 'student', avatarUrl: 'https://picsum.photos/seed/1/100/100' },
  { id: 'usr-002', name: 'Bob Williams', email: 'bob@school.edu', role: 'student', avatarUrl: 'https://picsum.photos/seed/2/100/100' },
  { id: 'usr-003', name: 'Charlie Brown', email: 'charlie@school.edu', role: 'student', avatarUrl: 'https://picsum.photos/seed/3/100/100' },
  { id: 'usr-teach-001', name: 'Dr. Evelyn Reed', email: 'e.reed@school.edu', role: 'teacher', avatarUrl: 'https://picsum.photos/seed/4/100/100' },
  { id: 'usr-teach-002', name: 'Mr. David Chen', email: 'd.chen@school.edu', role: 'teacher', avatarUrl: 'https://picsum.photos/seed/5/100/100' },
];

export const courses: Course[] = [
  { id: 'crs-101', name: 'Marine Biology', code: 'SCI-301', description: 'Explore the wonders of the deep ocean and its inhabitants.', teacher: users[3], imageUrl: 'https://picsum.photos/seed/101/600/400' },
  { id: 'crs-102', name: 'Advanced Robotics', code: 'TECH-402', description: 'Build and program complex robots for real-world challenges.', teacher: users[4], imageUrl: 'https://picsum.photos/seed/102/600/400' },
  { id: 'crs-103', name: 'Creative Writing Workshop', code: 'ENG-205', description: 'Hone your storytelling skills and find your unique voice.', teacher: users[3], imageUrl: 'https://picsum.photos/seed/103/600/400' },
  { id: 'crs-104', name: 'Modern World History', code: 'HIST-210', description: 'Analyze major world events from the 19th century to today.', teacher: users[4], imageUrl: 'https://picsum.photos/seed/104/600/400' },
];

export const announcements: Announcement[] = [
  { id: 'ann-001', title: 'School-wide Science Fair', content: 'The annual science fair is scheduled for next month. All students are encouraged to participate. Please see Dr. Reed for submission guidelines.', author: users[3], date: '2024-05-15T10:00:00Z' },
  { id: 'ann-002', title: 'Library Renovation Update', content: 'The library will be closed this weekend for the final phase of renovations. All digital resources will remain available.', author: users[4], date: '2024-05-14T14:30:00Z' },
  { id: 'ann-003', title: 'Guest Speaker: Robotics in AI', content: 'Join us for a special presentation by a leading expert from the field of AI and robotics. This Thursday in the main auditorium.', author: users[4], date: '2024-05-12T09:00:00Z', classId: 'crs-102' },
];

export const assignments: Assignment[] = [
  { id: 'asg-001', title: 'Coral Reef Ecosystem Essay', course: courses[0], dueDate: '2024-06-10', status: 'pending' },
  { id: 'asg-002', title: 'Build a Line-Following Robot', course: courses[1], dueDate: '2024-06-12', status: 'submitted' },
  { id: 'asg-003', title: 'Short Story Submission', course: courses[2], dueDate: '2024-06-05', status: 'graded', grade: 'A-' },
  { id: 'asg-004', title: 'Research Paper: Cold War', course: courses[3], dueDate: '2024-06-08', status: 'graded', grade: 'B+' },
  { id: 'asg-005', title: 'Final Robot Project Proposal', course: courses[1], dueDate: '2024-06-20', status: 'pending' },
];

export const studentProfile: Student = {
  ...users[0],
  role: 'student',
  attendance: [
    { date: '2024-05-20', status: 'present' },
    { date: '2024-05-19', status: 'present' },
    { date: '2024-05-18', status: 'late' },
    { date: '2024-05-17', status: 'present' },
    { date: '2024-05-16', status: 'absent' },
  ],
  courses: [courses[0], courses[2], courses[3]],
  assignments,
};

export const teacherProfile: User & { courses: Course[] } = {
  ...users[3],
  role: 'teacher',
  courses: [courses[0], courses[2]],
};

export const classLists: ClassList[] = [
  {
    id: 'cl-101',
    course: courses[0],
    students: [users[0], users[1]]
  },
  {
    id: 'cl-102',
    course: courses[1],
    students: [users[1], users[2]]
  },
  {
    id: 'cl-103',
    course: courses[2],
    students: [users[0], users[2]]
  },
   {
    id: 'cl-104',
    course: courses[3],
    students: [users[0], users[1], users[2]]
  }
];

export const availableCourses: Course[] = [
  { id: 'crs-201', name: 'Calculus I', code: 'MATH-301', description: 'An introduction to differential and integral calculus.', teacher: users[4], imageUrl: 'https://picsum.photos/seed/105/600/400' },
  { id: 'crs-202', name: 'Digital Art & Design', code: 'ART-210', description: 'Learn the fundamentals of digital painting and graphic design.', teacher: users[3], imageUrl: 'https://picsum.photos/seed/106/600/400' },
];
