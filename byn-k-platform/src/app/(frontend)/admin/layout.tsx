import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getCurrentUser } from '@/lib/api';
import { redirect } from 'next/navigation';

interface User {
  is_admin?: boolean;
  is_staff?: boolean;
  roles?: string[];
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser() as User | null;

  // Check for admin access - support both Django's is_admin/is_staff and roles array
  const isAdmin = user && (
    user.is_admin === true || 
    user.is_staff === true || 
    (Array.isArray(user.roles) && user.roles.includes('admin'))
  );

  if (!user || !isAdmin) {
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
