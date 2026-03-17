// Keep the admin event manager server-rendered so auth checks run on every request.
export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';
import { isSuperAdmin } from '@/lib/authz';
import { EventsManager } from '@/components/admin/EventsManager';

export default async function AdminEventsPage() {
  // Only super admins can reach the events management console.
  const user = await getCurrentUser();

  if (!isSuperAdmin(user)) {
    redirect('/admin');
  }

  return <EventsManager />;
}
