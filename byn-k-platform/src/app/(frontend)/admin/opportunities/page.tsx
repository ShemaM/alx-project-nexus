import { OpportunitiesManager } from '@/components/admin/OpportunitiesManager';
import React from 'react';
import { getCurrentUser } from '@/lib/api';
import { AuthUser, canAccessAdminRoute } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminOpportunitiesPage() {
  const user = await getCurrentUser() as AuthUser | null

  if (!canAccessAdminRoute(user, '/admin/opportunities')) {
    redirect('/admin')
  }

  return <OpportunitiesManager />;
}
