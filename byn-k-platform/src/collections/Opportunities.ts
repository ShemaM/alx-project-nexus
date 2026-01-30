/**
 * Opportunities Collection
 * 
 * Core collection for job opportunities, scholarships, internships, and fellowships.
 * This is the main content type that users browse and apply to.
 * 
 * Features:
 * - Support for different application methods (link or email)
 * - Document or text-based descriptions
 * - Verification status by admins
 * - Documentation requirements tracking for refugee IDs
 * 
 * @module collections/Opportunities
 */
import { CollectionConfig } from 'payload'

export const Opportunities: CollectionConfig = {
  slug: 'opportunities',
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'organization', 'deadline', 'isVerified', 'isFeatured'],
    group: 'Content Management',
    description: 'Jobs, scholarships, internships, and fellowship opportunities',
  },
  
  // Access control
  access: {
    // Public read access for frontend
    read: () => true,
    // Only authenticated users can create
    create: ({ req: { user } }) => Boolean(user),
    // Admins and moderators can update
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
        description: 'The opportunity title - be clear and descriptive',
      },
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'partners',
      required: true,
      admin: {
        description: 'The organization offering this opportunity',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Jobs', value: 'jobs' },
        { label: 'Internships', value: 'internships' },
        { label: 'Scholarships', value: 'scholarships' },
        { label: 'Fellowships', value: 'fellowships' },
      ],
      admin: {
        description: 'The type of opportunity',
      },
    },
    {
      name: 'deadline',
      type: 'date',
      required: true,
      admin: {
        description: 'Application deadline',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'select',
      label: 'Location/Region',
      required: false,
      options: [
        { label: 'Kenya', value: 'kenya' },
        { label: 'Uganda', value: 'uganda' },
        { label: 'Tanzania', value: 'tanzania' },
        { label: 'Rwanda', value: 'rwanda' },
        { label: 'Remote', value: 'remote' },
        { label: 'Multiple Locations', value: 'multiple' },
      ],
      admin: {
        description: 'Where is this opportunity located?',
      },
    },
    
    // ============================================
    // Documentation Requirements
    // ============================================
    {
      name: 'documentation',
      label: 'Accepted Documentation',
      type: 'select',
      hasMany: true,
      required: false,
      options: [
        { label: 'Alien Card', value: 'alien_card' },
        { label: 'Convention Travel Document (CTD)', value: 'ctd' },
        { label: 'Passport', value: 'passport' },
        { label: 'Waiting Slip', value: 'waiting_slip' },
        { label: 'Any ID', value: 'any_id' },
        { label: 'Not Specified', value: 'not_specified' },
      ],
      admin: {
        description: 'Which refugee IDs are accepted for this opportunity? (Leave empty if not applicable)',
      },
    },
    
    // ============================================
    // Status & Visibility
    // ============================================
    {
      name: 'isVerified',
      type: 'checkbox',
      label: 'Verified by Admin',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Indicates this opportunity has been verified by BYN-K admin',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Opportunity',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this opportunity in the featured section',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Whether this opportunity is currently active',
      },
    },
    
    // ============================================
    // Application Method
    // ============================================
    {
      name: 'applicationType',
      type: 'select',
      label: 'Application Method',
      required: true,
      defaultValue: 'link',
      options: [
        { label: 'Direct Link (Website/Portal)', value: 'link' },
        { label: 'Email Application', value: 'email' },
      ],
      admin: {
        description: 'How should applicants apply for this opportunity?',
      },
    },
    {
      name: 'applyLink',
      type: 'text',
      label: 'Application Link',
      admin: {
        condition: (data) => data?.applicationType === 'link',
        description: 'Direct URL to the application portal or website',
      },
      // Basic URL validation
      validate: (value: string | null | undefined, { data }: { data: Record<string, unknown> }) => {
        if (data?.applicationType === 'link' && value) {
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
      name: 'applicationEmail',
      type: 'email',
      label: 'Application Email',
      admin: {
        condition: (data) => data?.applicationType === 'email',
        description: 'Email address where applicants should send their applications',
      },
    },
    {
      name: 'emailSubjectLine',
      type: 'text',
      label: 'Email Subject Line',
      admin: {
        condition: (data) => data?.applicationType === 'email',
        description: 'Suggested subject line for the application email (optional)',
      },
    },
    {
      name: 'requiredDocuments',
      type: 'textarea',
      label: 'Required Application Documents',
      admin: {
        condition: (data) => data?.applicationType === 'email',
        description: 'List the documents applicants should attach (e.g., CV, Cover Letter, Certificates)',
      },
    },
    
    // ============================================
    // Description Content
    // ============================================
    {
      name: 'descriptionType',
      type: 'select',
      label: 'Description Type',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Write Description', value: 'text' },
        { label: 'Upload Document', value: 'document' },
      ],
      admin: {
        description: 'Choose to write a description or upload a document with opportunity details',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        condition: (data) => data?.descriptionType !== 'document',
        description: 'Write the opportunity details here',
      },
    },
    {
      name: 'opportunityDocument',
      type: 'upload',
      relationTo: 'media',
      label: 'Opportunity Document',
      admin: {
        condition: (data) => data?.descriptionType === 'document',
        description: 'Upload a PDF or document containing the full opportunity details',
      },
    },
    
    // ============================================
    // Metadata
    // ============================================
    {
      name: 'viewCount',
      type: 'number',
      label: 'View Count',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Number of times this opportunity has been viewed',
      },
    },
  ],
  
  // Timestamps for tracking
  timestamps: true,
  
  // Hooks for business logic
  hooks: {
    // Set default values and sanitize data before saving
    beforeChange: [
      async ({ data, operation }) => {
        // Ensure viewCount starts at 0 for new opportunities
        if (operation === 'create') {
          data.viewCount = 0
        }
        return data
      },
    ],
  },
}