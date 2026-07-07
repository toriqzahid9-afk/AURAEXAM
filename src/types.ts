export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  class_level?: string;
  password?: string;
}

export interface Subject {
  id: number;
  name: string;
  class_level?: string;
  teacher_id: number;
  teacher_name?: string;
}

export interface Schedule {
  id: number;
  subject_id: number;
  subject_name: string;
  teacher_name?: string;
  class_level?: string;
  day: string;
  time_start: string;
  time_end: string;
  room: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
}

export interface Submission {
  id: number;
  studentId: number;
  studentName: string;
  fileOrLink: string;
  submittedAt: string;
  status: 'Pending' | 'Selesai';
  grade?: number;
  notes?: string;
}

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  status: 'Aktif' | 'Selesai';
  submissions: Submission[];
}

export interface Grade {
  subject: string;
  tugas: number;
  kuis: number;
  ujian: number;
}

export interface TeacherGrade {
  id: number;
  name: string;
  tugas: number;
  kuis: number;
  ujian: number;
}



