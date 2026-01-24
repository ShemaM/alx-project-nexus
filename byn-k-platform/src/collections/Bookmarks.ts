import type { CollectionConfig, Access } from 'payload'

// Access control: Users can only see their own bookmarks
const isOwnerOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false

  const userRoles = user?.roles as string[] | undefined
  // Admins can see all bookmarks
  if (userRoles?.includes('admin')) return true

  // Users can only see their own bookmarks
  return {
    user: {
      equals: user.id,
    },
  }
}

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'opportunity', 'createdAt'],
    group: 'User Data',
    description: 'User bookmarked opportunities',
  },
  access: {
    // Users can read their own bookmarks, admins can read all
    read: isOwnerOrAdmin,
    // Users can create their own bookmarks
    create: ({ req: { user } }) => Boolean(user),
    // Users can only update their own bookmarks
    update: isOwnerOrAdmin,
    // Users can only delete their own bookmarks
    delete: isOwnerOrAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      // Automatically set to current user on create
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            if (operation === 'create' && req.user) {
              return req.user.id
            }
            return value
          },
        ],
      },
      admin: {
        // Hide from regular users, only admins can see/edit
        condition: (data, siblingData, { user }) => {
          const userRoles = user?.roles as string[] | undefined
          return userRoles?.includes('admin') ?? false
        },
      },
    },
    {
      name: 'opportunity',
      type: 'relationship',
      relationTo: 'opportunities',
      required: true,
      index: true,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Personal Notes',
      admin: {
        description: 'Add personal notes about this opportunity',
      },
    },
  ],
  timestamps: true,
  // Prevent duplicate bookmarks for the same user and opportunity
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data?.opportunity) {
          const userId = data.user || req.user?.id
          if (userId) {
            // Check if bookmark already exists
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
