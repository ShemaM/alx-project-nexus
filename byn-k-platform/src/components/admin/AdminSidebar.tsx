'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, Building } from 'lucide-react';
import { AuthUser, canAccessAdminRoute, isSuperAdmin } from '@/lib/authz';

const sidebarNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/partners', label: 'Partners', icon: Building },
];

interface AdminSidebarProps {
  user: AuthUser
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const visibleLinks = sidebarNavLinks.filter((link) => canAccessAdminRoute(user, link.href))

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-2xl font-bold">{isSuperAdmin(user) ? 'Super Admin' : 'Staff'}</h2>
      </div>
      <nav className="flex flex-col p-4">
        {visibleLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center p-2 rounded-lg ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
