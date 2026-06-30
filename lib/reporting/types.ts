import { Student, Update } from '../../src/types';

export type ReportPeriod = 'quarterly' | 'halfYearly' | 'annually';
export type SponsorshipFilter = 'all' | 'sponsored' | 'unsponsored';

export interface ReportFilters {
  search: string;
  sponsorship: SponsorshipFilter;
  minDonation: number | null;
  maxDonation: number | null;
  village: string;
  school: string;
}

export interface DonationTrendPoint {
  label: string;
  donationTotal: number;
  sponsoredCount: number;
}

export interface SponsorCohortPoint {
  name: string;
  count: number;
}

export interface KpiSummary {
  totalStudents: number;
  sponsoredStudents: number;
  unsponsoredStudents: number;
  donationTotal: number;
  donationAverage: number;
  updatesCount: number;
  uniqueVillages: number;
  uniqueSponsors: number;
}

export interface ReportResult {
  period: ReportPeriod;
  filters: ReportFilters;
  students: Student[];
  updates: Update[];
  kpis: KpiSummary;
  donationTrend: DonationTrendPoint[];
  sponsorshipByVillage: { village: string; sponsored: number; unsponsored: number }[];
  sponsorCohorts: SponsorCohortPoint[];
}
