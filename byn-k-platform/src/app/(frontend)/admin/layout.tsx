import React from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminClientWrapper } from '@/components/admin/AdminClientWrapper';
import { getCurrentUser } from '@/lib/api';
import { AuthUser, isSuperAdmin } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser() as AuthUser | null;

  if (!user) {
    redirect('/login');
  }

  // Only super admin can access admin panel
  if (!isSuperAdmin(user)) {
    redirect('/');
  }

  return (
    <AdminClientWrapper>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Super Admin Dashboard
            </h1>
            <Link href="/" className="text-blue-600 hover:underline">
              View Site
            </Link>
          </header>
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminClientWrapper>
  );
}
