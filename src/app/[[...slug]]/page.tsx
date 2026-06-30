'use client';

import { AppShell } from '../../App';
import ReportsPage from '../../../app/reports/page';

interface CatchAllPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const resolved = await params;
  const slug = resolved.slug || [];
  const route = slug[0] || 'feed';

  if (route === 'reports') return <ReportsPage />;
  if (route === 'students') return <AppShell initialTab="students" />;
  if (route === 'dashboard') return <AppShell initialTab="dashboard" />;
  if (route === 'crm') return <AppShell initialTab="crm" />;
  if (route === 'profile') return <AppShell initialTab="profile" />;
  if (route === 'features') return <AppShell initialTab="features" />;
  if (route === 'add') return <AppShell initialTab="add" />;

  return <AppShell initialTab="feed" />;
}
