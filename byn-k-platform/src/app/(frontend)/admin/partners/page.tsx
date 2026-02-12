import { PartnersManager } from '@/components/admin/PartnersManager';
import React from 'react';
import { getCurrentUser } from '@/lib/api';
import { AuthUser, canAccessAdminRoute } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminPartnersPage() {
  const user = await getCurrentUser() as AuthUser | null

  if (!canAccessAdminRoute(user, '/admin/partners')) {
    redirect('/admin')
  }

  return <PartnersManager />;
}
