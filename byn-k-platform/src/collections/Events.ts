/**
 * Events Collection
 * 
 * Community events such as workshops, webinars, networking sessions,
 * and career fairs. Helps keep the community engaged and informed.
 * 
 * @module collections/Events
 */
import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'startDate', 'location', 'isPublished'],
    group: 'Content Management',
    description: 'Community events, workshops, and webinars',
  },
  
  // Access control
  access: {
    // Only published events are public
    read: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      if (userRoles?.includes('admin') || userRoles?.includes('moderator')) {
        return true
      }
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
        description: 'Event title',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Workshop', value: 'workshop' },
        { label: 'Webinar', value: 'webinar' },
        { label: 'Career Fair', value: 'career_fair' },
        { label: 'Networking', value: 'networking' },
        { label: 'Training', value: 'training' },
        { label: 'Info Session', value: 'info_session' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Type of event',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full event description',
      },
    },
    
    // ============================================
    // Date & Time
    // ============================================
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Event start date and time',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'Event end date and time (optional)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'timezone',
      type: 'select',
      defaultValue: 'Africa/Nairobi',
      options: [
        { label: 'East Africa Time (EAT)', value: 'Africa/Nairobi' },
        { label: 'Central European Time (CET)', value: 'Europe/Paris' },
        { label: 'Eastern Time (ET)', value: 'America/New_York' },
        { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
        { label: 'UTC', value: 'UTC' },
      ],
      admin: {
        description: 'Event timezone',
      },
    },
    
    // ============================================
    // Location
    // ============================================
    {
      name: 'locationType',
      type: 'select',
      required: true,
      defaultValue: 'online',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'In-Person', value: 'in_person' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      admin: {
        description: 'How will the event be held?',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        condition: (data) => data?.locationType === 'in_person' || data?.locationType === 'hybrid',
        description: 'Physical location address',
      },
    },
    {
      name: 'onlineLink',
      type: 'text',
      admin: {
        condition: (data) => data?.locationType === 'online' || data?.locationType === 'hybrid',
        description: 'Link to join online (Zoom, Google Meet, etc.)',
      },
    },
    
    // ============================================
    // Registration
    // ============================================
    {
      name: 'requiresRegistration',
      type: 'checkbox',
      label: 'Requires Registration',
      defaultValue: false,
      admin: {
        description: 'Does this event require registration?',
      },
    },
    {
      name: 'registrationLink',
      type: 'text',
      admin: {
        condition: (data) => data?.requiresRegistration,
        description: 'Registration link',
      },
    },
    {
      name: 'registrationDeadline',
      type: 'date',
      admin: {
        condition: (data) => data?.requiresRegistration,
        description: 'Registration deadline',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'maxAttendees',
      type: 'number',
      admin: {
        condition: (data) => data?.requiresRegistration,
        description: 'Maximum number of attendees (leave empty for unlimited)',
      },
    },
    
    // ============================================
    // Media
    // ============================================
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the event',
      },
    },
    
    // ============================================
    // Organizer
    // ============================================
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'partners',
      admin: {
        description: 'Organization hosting this event',
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
        description: 'Whether this event is visible to the public',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in featured events section',
      },
    },
  ],
  
  // Timestamps
  timestamps: true,
}
