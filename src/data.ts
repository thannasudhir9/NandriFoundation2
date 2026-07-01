import { Sponsor, Student, Update } from './types';

const names = ['Aarav', 'Priya', 'Karthik', 'Saanvi', 'Rohan', 'Ananya', 'Vivaan', 'Diya', 'Aditya', 'Ishaan', 'Neha', 'Arjun', 'Meera', 'Krishna', 'Sara', 'Rahul', 'Kavya', 'Om', 'Sita', 'Vikram'];
const villages = ['Irular Village A', 'Irular Village B', 'Irular Village C', 'Thiruvallur', 'Kanchipuram'];
const schools = ['Little Flower High School', 'Primary Village School', 'Secondary Village School'];
const grades = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade'];
const sponsors = ['Monika G.', 'Steffen R.', 'John D.', 'Alice M.', 'Bob S.', 'Emma W.', 'Oliver T.', 'Sophia L.', undefined, undefined, 'David B.'];

const generateStudents = (): Student[] => {
  const students: Student[] = [];
  for (let i = 1; i <= 100; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const sponsor = sponsors[Math.floor(Math.random() * sponsors.length)];
    const donationAmount = sponsor ? (Math.floor(Math.random() * 8) + 3) * 10 : 0;
    students.push({
      id: `s${i}`,
      name: name,
      age: Math.floor(Math.random() * 10) + 6,
      school: schools[Math.floor(Math.random() * schools.length)],
      village: villages[Math.floor(Math.random() * villages.length)],
      grade: grades[Math.floor(Math.random() * grades.length)],
      photoUrl: `https://i.pravatar.cc/150?u=${i}`,
      sponsorName: sponsor,
      sponsorEmail: sponsor ? `${sponsor.replace(' ', '.').toLowerCase().replace('.', '')}@example.com` : undefined,
      donationAmount,
      bio: `${name} is a bright student who loves learning.`,
    });
  }
  return students;
};

export const INITIAL_STUDENTS: Student[] = generateStudents();

const generateSponsors = (students: Student[]): Sponsor[] => {
  const sponsorMap = new Map<string, Sponsor>();
  for (const student of students) {
    if (!student.sponsorName) continue;
    const key = student.sponsorName.trim().toLowerCase();
    const donation = student.donationAmount || 0;
    const current = sponsorMap.get(key);
    if (current) {
      current.sponsoredStudentCount += 1;
      current.donationTotal += donation;
      continue;
    }

    sponsorMap.set(key, {
      id: `sp-${key.replace(/[^a-z0-9]+/g, '-')}`,
      name: student.sponsorName,
      email: student.sponsorEmail || `${key.replace(/\s+/g, '.')}@example.com`,
      phone: '+49-000-000000',
      country: 'Germany',
      donationTotal: donation,
      sponsoredStudentCount: 1,
    });
  }
  return Array.from(sponsorMap.values()).sort((a, b) => b.donationTotal - a.donationTotal);
};

export const INITIAL_SPONSORS: Sponsor[] = generateSponsors(INITIAL_STUDENTS);

export const INITIAL_UPDATES: Update[] = [
  {
    id: 'u1',
    authorName: 'Ramesh (Nandri Staff)',
    date: new Date().toISOString(),
    content: 'Today we distributed new textbooks to the 5th grade class at Little Flower High School. The children are very excited for the new semester!',
    photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600&h=400',
    type: 'general',
  },
  {
    id: 'u2',
    studentId: 's2',
    authorName: 'Anjali (Nandri Staff)',
    date: new Date(Date.now() - 86400000).toISOString(),
    content: 'Priya drew a beautiful picture in her art class today. We are so proud of her creativity!',
    photoUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600&h=400',
    type: 'student',
  }
];
