'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, Building, CalendarDays } from 'lucide-react';
import { AuthUser, isSuperAdmin } from '@/lib/authz';

const sidebarNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/partners', label: 'Partners', icon: Building },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
];

interface AdminSidebarProps {
  user: AuthUser
}

// Sidebar shown to super admins so they can navigate the admin portal.
export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  // Super admin can see all links
  const visibleLinks = isSuperAdmin(user) ? sidebarNavLinks : [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Super Admin</h2>
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
