export const dynamic = 'force-dynamic';

import React from 'react';
import { getCurrentUser } from '@/lib/api';
import { isSuperAdmin } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const user = await getCurrentUser()

  // Only super admin can access admin users page
  if (!isSuperAdmin(user)) {
    redirect('/admin')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Users</h1>
      <p className="text-gray-500 mt-1">Manage all users on the platform.</p>
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg mt-8">
        <p className="text-gray-500">Users management coming soon</p>
      </div>
    </div>
  );
}
