import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getCurrentUser } from '@/lib/api';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || !user.roles.includes('admin')) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
