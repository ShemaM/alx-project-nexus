/**
 * Bookmarks Collection
 * 
 * Allows users to save opportunities for later reference.
 * Each bookmark links a user to an opportunity with optional personal notes.
 * 
 * Security Features:
 * - Row-level security: Users can only access their own bookmarks
 * - Admins can view all bookmarks for moderation
 * - Duplicate prevention: One bookmark per user-opportunity pair
 * 
 * @module collections/Bookmarks
 */
import type { CollectionConfig, Access } from 'payload'

/**
 * Access control function for bookmark ownership
 * Returns a query constraint that limits results to user's own bookmarks
 */
const isOwnerOrAdmin: Access = ({ req: { user } }) => {
  // Unauthenticated users have no access
  if (!user) return false

  const userRoles = user?.roles as string[] | undefined
  
  // Admins can see all bookmarks (for moderation/support)
  if (userRoles?.includes('admin')) return true

  // Regular users can only see their own bookmarks
  return {
    user: {
      equals: user.id,
    },
  }
}

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'opportunity', 'createdAt'],
    group: 'User Data',
    description: 'User bookmarked opportunities',
  },
  
  // Access control - enforces ownership rules
  access: {
    // Users can read their own bookmarks, admins can read all
    read: isOwnerOrAdmin,
    // Only authenticated users can create bookmarks
    create: ({ req: { user } }) => Boolean(user),
    // Users can only update their own bookmarks
    update: isOwnerOrAdmin,
    // Users can only delete their own bookmarks
    delete: isOwnerOrAdmin,
  },
  
  fields: [
    // ============================================
    // User Reference
    // ============================================
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true, // Index for fast user-based queries
      // Auto-set to current user on creation
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            // Automatically assign current user when creating a bookmark
            if (operation === 'create' && req.user) {
              return req.user.id
            }
            return value
          },
        ],
      },
      admin: {
        // Only show to admins (users don't need to see/edit this)
        condition: (data, siblingData, { user }) => {
          const userRoles = user?.roles as string[] | undefined
          return userRoles?.includes('admin') ?? false
        },
        description: 'The user who created this bookmark',
      },
    },
    
    // ============================================
    // Opportunity Reference
    // ============================================
    {
      name: 'opportunity',
      type: 'relationship',
      relationTo: 'opportunities',
      required: true,
      index: true, // Index for efficient lookups
      admin: {
        description: 'The bookmarked opportunity',
      },
    },
    
    // ============================================
    // Personal Notes
    // ============================================
    {
      name: 'notes',
      type: 'textarea',
      label: 'Personal Notes',
      maxLength: 1000,
      admin: {
        description: 'Add personal notes about this opportunity (max 1000 characters)',
      },
    },
  ],
  
  // Enable timestamps for audit trail
  timestamps: true,
  
  // Hooks for business logic
  hooks: {
    // Prevent duplicate bookmarks
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data?.opportunity) {
          const userId = data.user || req.user?.id
          
          if (userId) {
            // Check if bookmark already exists for this user-opportunity pair
            const existing = await req.payload.find({
              collection: 'bookmarks',
              where: {
                and: [
                  { user: { equals: userId } },
                  { opportunity: { equals: data.opportunity } },
                ],
              },
              limit: 1,
            })

            if (existing.totalDocs > 0) {
              throw new Error('You have already bookmarked this opportunity')
            }
          }
        }
        return data
      },
    ],
  },
}
