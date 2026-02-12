export const dynamic = 'force-dynamic';

import { PartnersManager } from '@/components/admin/PartnersManager';
import React from 'react';
import { getCurrentUser } from '@/lib/api';
import { AuthUser, isSuperAdmin } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminPartnersPage() {
  const user = await getCurrentUser() as AuthUser | null

  // Only super admin can access admin partners page
  if (!isSuperAdmin(user)) {
    redirect('/admin')
  }

  return <PartnersManager />;
}
