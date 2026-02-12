export interface AuthUser {
  id?: number | string
  email?: string
  name?: string | null
  username?: string | null
  is_admin?: boolean
  is_staff?: boolean
  is_superuser?: boolean
  roles?: string[]
}

export type AdminPermission =
  | 'view_admin_dashboard'
  | 'manage_opportunities'
  | 'manage_partners'
  | 'manage_users'

const ADMIN_ROUTE_PERMISSIONS: Record<string, AdminPermission | null> = {
  '/admin': null,
  '/admin/opportunities': 'manage_opportunities',
  '/admin/partners': 'manage_partners',
  '/admin/users': 'manage_users',
}

function normalizeRoles(user: AuthUser | null | undefined): Set<string> {
  const roles = new Set<string>()

  if (!user) {
    return roles
  }

  if (Array.isArray(user.roles)) {
    for (const role of user.roles) {
      if (typeof role === 'string' && role.trim()) {
        roles.add(role.trim().toLowerCase())
      }
    }
  }

  if (user.is_superuser) {
    roles.add('super_admin')
  } else if (user.is_staff) {
    roles.add('staff')
  }

  return roles
}

export function isSuperAdmin(user: AuthUser | null | undefined): boolean {
  return user?.is_superuser === true
}

export function isStaff(user: AuthUser | null | undefined): boolean {
  if (!user || isSuperAdmin(user)) {
    return false
  }
  const roles = normalizeRoles(user)
  return roles.has('staff') || user.is_staff === true
}

export function hasAdminPermission(
  user: AuthUser | null | undefined,
  permission: AdminPermission
): boolean {
  if (!user) {
    return false
  }

  if (isSuperAdmin(user)) {
    return true
  }

  if (!isStaff(user)) {
    return false
  }

  const roles = normalizeRoles(user)

  if (permission === 'view_admin_dashboard') {
    return true
  }

  switch (permission) {
    case 'manage_opportunities':
      return roles.has('manage_opportunities') || roles.has('opportunities')
    case 'manage_partners':
      return roles.has('manage_partners') || roles.has('partners')
    case 'manage_users':
      return roles.has('manage_users') || roles.has('users_admin')
    default:
      return false
  }
}

export function canAccessAdmin(user: AuthUser | null | undefined): boolean {
  // Only super admin (super manager) can access admin panel
  return isSuperAdmin(user)
}

export function canAccessAdminRoute(
  user: AuthUser | null | undefined,
  pathname: string
): boolean {
  if (!user || !canAccessAdmin(user)) {
    return false
  }

  const permission = ADMIN_ROUTE_PERMISSIONS[pathname]
  if (permission === undefined) {
    // Unknown admin path: only super admin can access.
    return isSuperAdmin(user)
  }

  if (permission === null) {
    return hasAdminPermission(user, 'view_admin_dashboard')
  }

  return hasAdminPermission(user, permission)
}
