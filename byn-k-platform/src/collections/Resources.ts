/**
 * Resources Collection
 * 
 * Community resources such as guides, tutorials, templates, and helpful links.
 * These help users navigate the job search and application process.
 * 
 * @module collections/Resources
 */
import { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'isPublished', 'createdAt'],
    group: 'Content Management',
    description: 'Guides, tutorials, and helpful resources for the community',
  },
  
  // Access control
  access: {
    // Only published resources are public
    read: ({ req: { user } }) => {
      // Admins can see all
      const userRoles = user?.roles as string[] | undefined
      if (userRoles?.includes('admin') || userRoles?.includes('moderator')) {
        return true
      }
      // Public can only see published
      return { isPublished: { equals: true } }
    },
    // Only admins and moderators can create
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Resource title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from title)',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            // Auto-generate slug from title if not provided
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Career Guide', value: 'career_guide' },
        { label: 'CV/Resume Tips', value: 'cv_tips' },
        { label: 'Interview Preparation', value: 'interview_prep' },
        { label: 'Scholarship Guide', value: 'scholarship_guide' },
        { label: 'Documentation Help', value: 'documentation' },
        { label: 'Skills Development', value: 'skills' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Resource category',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: {
        description: 'Brief summary of the resource (max 300 characters)',
      },
    },
    
    // ============================================
    // Content
    // ============================================
    {
      name: 'contentType',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [
        { label: 'Article', value: 'article' },
        { label: 'External Link', value: 'link' },
        { label: 'Downloadable File', value: 'file' },
      ],
      admin: {
        description: 'Type of resource content',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        condition: (data) => data?.contentType === 'article',
        description: 'Full article content',
      },
    },
    {
      name: 'externalLink',
      type: 'text',
      admin: {
        condition: (data) => data?.contentType === 'link',
        description: 'URL to external resource',
      },
      validate: (value: string | null | undefined, { data }: { data: Record<string, unknown> }) => {
        if (data?.contentType === 'link' && value) {
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
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.contentType === 'file',
        description: 'Downloadable file (PDF, DOC, etc.)',
      },
    },
    
    // ============================================
    // Featured Image
    // ============================================
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the resource card',
      },
    },
    
    // ============================================
    // Status
    // ============================================
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Published',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Whether this resource is visible to the public',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in featured resources section',
      },
    },
  ],
  
  // Timestamps
  timestamps: true,
}
