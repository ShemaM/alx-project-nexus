import { OpportunitiesManager } from '@/components/admin/OpportunitiesManager';
import React from 'react';
import { getCurrentUser } from '@/lib/api';
import { AuthUser, isSuperAdmin } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminOpportunitiesPage() {
  const user = await getCurrentUser() as AuthUser | null

  // Only super admin can access admin opportunities page
  if (!isSuperAdmin(user)) {
    redirect('/admin')
  }

  return <OpportunitiesManager />;
}
