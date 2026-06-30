export type Role = 'employee' | 'sponsor';

export interface Student {
  id: string;
  name: string;
  age: number;
  school: string;
  village: string;
  grade: string;
  photoUrl: string;
  sponsorName?: string;
  sponsorEmail?: string;
  bio: string;
}

export interface Update {
  id: string;
  studentId?: string;
  authorName: string;
  date: string;
  content: string;
  photoUrl?: string;
  type: 'general' | 'student';
}
