import { Student, Update } from '../../src/types';
import { DonationTrendPoint, ReportFilters, ReportPeriod, ReportResult, SponsorCohortPoint } from './types';

export const defaultReportFilters: ReportFilters = {
  search: '',
  sponsorship: 'all',
  minDonation: null,
  maxDonation: null,
  village: 'All',
  school: 'All',
};

function periodLabel(date: Date, period: ReportPeriod): string {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (period === 'annually') return `${year}`;
  if (period === 'halfYearly') return `${year} H${month < 6 ? 1 : 2}`;
  return `${year} Q${Math.floor(month / 3) + 1}`;
}

function matchesFilters(student: Student, filters: ReportFilters): boolean {
  const hasSponsor = Boolean(student.sponsorName?.trim());
  const donation = student.donationAmount ?? 0;
  const search = filters.search.trim().toLowerCase();

  if (filters.sponsorship === 'sponsored' && !hasSponsor) return false;
  if (filters.sponsorship === 'unsponsored' && hasSponsor) return false;
  if (filters.minDonation !== null && donation < filters.minDonation) return false;
  if (filters.maxDonation !== null && donation > filters.maxDonation) return false;
  if (filters.village !== 'All' && student.village !== filters.village) return false;
  if (filters.school !== 'All' && student.school !== filters.school) return false;
  if (!search) return true;

  return (
    student.name.toLowerCase().includes(search) ||
    student.village.toLowerCase().includes(search) ||
    student.school.toLowerCase().includes(search) ||
    (student.sponsorName || '').toLowerCase().includes(search)
  );
}

function buildDonationTrend(students: Student[], updates: Update[], period: ReportPeriod): DonationTrendPoint[] {
  const groups = new Map<string, DonationTrendPoint>();
  const sponsoredStudents = students.filter((s) => Boolean(s.sponsorName?.trim())).length;
  const totalDonation = students.reduce((sum, student) => sum + (student.donationAmount ?? 0), 0);
  const updatesToUse = updates.length ? updates : [{ id: 'snapshot', authorName: 'system', date: new Date().toISOString(), content: '', type: 'general' as const }];

  updatesToUse.forEach((update) => {
    const label = periodLabel(new Date(update.date), period);
    const bucket = groups.get(label) || { label, donationTotal: 0, sponsoredCount: sponsoredStudents };
    groups.set(label, bucket);
  });

  const bucketCount = Math.max(groups.size, 1);
  groups.forEach((bucket, key) => {
    groups.set(key, { ...bucket, donationTotal: totalDonation / bucketCount });
  });

  return Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label));
}

function buildSponsorCohorts(students: Student[]): SponsorCohortPoint[] {
  const sponsorCounts = new Map<string, number>();
  students.forEach((student) => {
    if (!student.sponsorName) return;
    sponsorCounts.set(student.sponsorName, (sponsorCounts.get(student.sponsorName) || 0) + 1);
  });
  return Array.from(sponsorCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function buildReport(students: Student[], updates: Update[], period: ReportPeriod, filters: ReportFilters): ReportResult {
  const filteredStudents = students.filter((student) => matchesFilters(student, filters));
  const sponsoredStudents = filteredStudents.filter((student) => Boolean(student.sponsorName?.trim()));
  const donationTotal = filteredStudents.reduce((sum, student) => sum + (student.donationAmount ?? 0), 0);

  const sponsorshipByVillage = Array.from(
    filteredStudents.reduce((map, student) => {
      const current = map.get(student.village) || { village: student.village, sponsored: 0, unsponsored: 0 };
      if (student.sponsorName?.trim()) current.sponsored += 1;
      else current.unsponsored += 1;
      map.set(student.village, current);
      return map;
    }, new Map<string, { village: string; sponsored: number; unsponsored: number }>())
  ).map(([, value]) => value);

  const updatesForStudents = updates.filter((update) => {
    if (!update.studentId) return true;
    return filteredStudents.some((student) => student.id === update.studentId);
  });

  return {
    period,
    filters,
    students: filteredStudents,
    updates: updatesForStudents,
    kpis: {
      totalStudents: filteredStudents.length,
      sponsoredStudents: sponsoredStudents.length,
      unsponsoredStudents: filteredStudents.length - sponsoredStudents.length,
      donationTotal,
      donationAverage: sponsoredStudents.length ? donationTotal / sponsoredStudents.length : 0,
      updatesCount: updatesForStudents.length,
      uniqueVillages: new Set(filteredStudents.map((s) => s.village)).size,
      uniqueSponsors: new Set(filteredStudents.map((s) => s.sponsorName).filter(Boolean)).size,
    },
    donationTrend: buildDonationTrend(filteredStudents, updatesForStudents, period),
    sponsorshipByVillage,
    sponsorCohorts: buildSponsorCohorts(filteredStudents),
  };
}
