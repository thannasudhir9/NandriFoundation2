export type Role = 'superadmin' | 'employee' | 'sponsor';

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
  donationAmount?: number;
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

export interface Sponsor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  donationTotal: number;
  sponsoredStudentCount: number;
}

export interface Program {
  id: string;
  name: string;
  location: string;
}

export interface Sponsorship {
  id: string;
  sponsorId: string;
  studentId: string;
  programId: string;
  startDate: string;
  status: 'active' | 'paused' | 'closed';
  monthlyAmount: number;
}
