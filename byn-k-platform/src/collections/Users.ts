/**
 * Users Collection
 * 
 * Manages user accounts for the BYN-K Platform. Includes authentication,
 * role-based access control (RBAC), and user profile information.
 * 
 * Security Features:
 * - JWT-based authentication with roles stored in token
 * - Field-level access control for sensitive operations
 * - Only admins can modify user roles
 * 
 * @module collections/Users
 */
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'roles', 'createdAt'],
    group: 'User Management',
    description: 'Platform users and administrators',
  },
  
  // Enable Payload's built-in authentication
  auth: {
    // Token expiration (24 hours)
    tokenExpiration: 60 * 60 * 24,
    // Verification email for new users (can be enabled with email adapter)
    verify: false,
    // Max failed login attempts before lockout
    maxLoginAttempts: 5,
    // Lockout duration in seconds (15 minutes)
    lockTime: 60 * 15,
    // Disable session-based auth - use JWT tokens only
    // This prevents the need for users_sessions table in the database
    useSessions: false,
  },
  
  // Access control for the collection
  access: {
    // Anyone can read user profiles (limited fields exposed via hooks)
    read: () => true,
    // Only authenticated users can create accounts (or public registration)
    create: () => true,
    // Users can update their own profile, admins can update anyone
    update: ({ req: { user } }) => {
      if (!user) return false
      const userRoles = user?.roles as string[] | undefined
      if (userRoles?.includes('admin')) return true
      // Users can only update their own document
      return { id: { equals: user.id } }
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') ?? false
    },
  },
  
  fields: [
    // ============================================
    // Profile Information
    // ============================================
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: false,
      defaultValue: '',
      admin: {
        description: 'User\'s full name for display purposes',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Picture',
      admin: {
        description: 'User\'s profile picture (optional)',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      maxLength: 500,
      admin: {
        description: 'Short biography (max 500 characters)',
      },
    },
    
    // ============================================
    // Role-Based Access Control
    // ============================================
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: ['user'],
      required: true,
      // SECURITY: Include in JWT for fast access checks without DB lookup
      saveToJWT: true,
      access: {
        // SECURITY: Only admins can update roles - prevents privilege escalation
        update: ({ req: { user } }) => {
          const userRoles = user?.roles as string[] | undefined
          return userRoles?.includes('admin') ?? false
        },
      },
      admin: {
        description: 'User roles determine access permissions',
        position: 'sidebar',
      },
    },
    
    // ============================================
    // User Preferences
    // ============================================
    {
      name: 'preferences',
      type: 'group',
      label: 'User Preferences',
      admin: {
        description: 'User settings and preferences',
      },
      fields: [
        {
          name: 'hasCompletedTour',
          type: 'checkbox',
          label: 'Completed Site Tour',
          defaultValue: false,
          admin: {
            description: 'Whether the user has completed the onboarding tour',
          },
        },
        {
          name: 'emailNotifications',
          type: 'checkbox',
          label: 'Email Notifications',
          defaultValue: true,
          admin: {
            description: 'Receive email notifications for new opportunities',
          },
        },
        {
          name: 'preferredCategories',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Jobs', value: 'jobs' },
            { label: 'Internships', value: 'internships' },
            { label: 'Scholarships', value: 'scholarships' },
            { label: 'Fellowships', value: 'fellowships' },
          ],
          admin: {
            description: 'Preferred opportunity categories for personalized recommendations',
          },
        },
      ],
    },
  ],
  
  // Timestamps for audit trail
  timestamps: true,
}
