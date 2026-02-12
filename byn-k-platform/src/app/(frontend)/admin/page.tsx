import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import React from 'react';
import { getCurrentUser } from '@/lib/api';
import { AuthUser, canAccessAdminRoute } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser() as AuthUser | null

  if (!canAccessAdminRoute(user, '/admin')) {
    redirect('/')
  }

  return <AnalyticsDashboard />;
}
