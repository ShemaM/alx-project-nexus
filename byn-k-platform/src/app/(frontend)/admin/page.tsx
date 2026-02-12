export const dynamic = 'force-dynamic';

import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import React from 'react';
import { getCurrentUser } from '@/lib/api';
import { AuthUser, isSuperAdmin } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser() as AuthUser | null

  // Only super admin can access admin dashboard
  if (!isSuperAdmin(user)) {
    redirect('/')
  }

  return <AnalyticsDashboard />;
}
