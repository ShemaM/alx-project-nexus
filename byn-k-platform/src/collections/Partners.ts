/**
 * Partners Collection
 * 
 * Manages organizations that post opportunities on the platform.
 * Partners can be companies, NGOs, educational institutions, etc.
 * 
 * @module collections/Partners
 */
import { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'website', 'isActive', 'createdAt'],
    group: 'Content Management',
    description: 'Organizations and partners offering opportunities',
  },
  
  // Access control
  access: {
    // Public read access for displaying partner info
    read: () => true,
    // Only admins and moderators can create partners
    create: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') || userRoles?.includes('moderator') || false
    },
    // Only admins and moderators can update
    update: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') || userRoles?.includes('moderator') || false
    },
    // Only admins can delete
    delete: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') ?? false
    },
  },
  
  fields: [
    // ============================================
    // Basic Information
    // ============================================
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Organization name',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'organization',
      options: [
        { label: 'Company', value: 'company' },
        { label: 'NGO', value: 'ngo' },
        { label: 'Educational Institution', value: 'education' },
        { label: 'Government', value: 'government' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Type of organization',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 500,
      admin: {
        description: 'Brief description of the organization (max 500 characters)',
      },
    },
    
    // ============================================
    // Contact & Links
    // ============================================
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Organization website URL',
      },
      validate: (value: string | null | undefined) => {
        if (value) {
          try {
            new URL(value)
            return true
          } catch {
            return 'Please enter a valid URL'
          }
        }
        return true
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Contact email for the organization',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Organization location (city, country)',
      },
    },
    
    // ============================================
    // Branding
    // ============================================
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Organization logo (recommended: square image, min 200x200px)',
      },
    },
    
    // ============================================
    // Status
    // ============================================
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active Partner',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Whether this partner is currently active',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Partner',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in featured partners section',
      },
    },
  ],
  
  // Timestamps
  timestamps: true,
}