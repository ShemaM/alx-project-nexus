/**
 * Announcements Collection
 * 
 * Site-wide announcements and notifications. Used to inform users
 * about important updates, new features, or community news.
 * 
 * Supports different types of announcements with varying priority levels.
 * 
 * @module collections/Announcements
 */
import { CollectionConfig } from 'payload'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  
  // Admin panel configuration
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'priority', 'isActive', 'startDate'],
    group: 'Site Management',
    description: 'Site-wide announcements and notifications',
  },
  
  // Access control
  access: {
    // Only active announcements are public
    read: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      if (userRoles?.includes('admin')) {
        return true
      }
      // Public can only see active announcements
      return { isActive: { equals: true } }
    },
    // Only admins can create
    create: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') ?? false
    },
    // Only admins can update
    update: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') ?? false
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
        description: 'Announcement title',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 500,
      admin: {
        description: 'Announcement message (max 500 characters)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Information', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Alert', value: 'alert' },
        { label: 'New Feature', value: 'feature' },
      ],
      admin: {
        description: 'Type of announcement (affects styling)',
      },
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        description: 'Announcement priority (affects display order)',
      },
    },
    
    // ============================================
    // Display Settings
    // ============================================
    {
      name: 'displayLocation',
      type: 'select',
      hasMany: true,
      defaultValue: ['banner'],
      options: [
        { label: 'Top Banner', value: 'banner' },
        { label: 'Popup Modal', value: 'popup' },
        { label: 'Toast Notification', value: 'toast' },
        { label: 'Homepage Only', value: 'homepage' },
      ],
      admin: {
        description: 'Where should this announcement be displayed?',
      },
    },
    {
      name: 'dismissible',
      type: 'checkbox',
      label: 'User Can Dismiss',
      defaultValue: true,
      admin: {
        description: 'Allow users to dismiss this announcement',
      },
    },
    
    // ============================================
    // Call to Action
    // ============================================
    {
      name: 'hasAction',
      type: 'checkbox',
      label: 'Include Call to Action',
      defaultValue: false,
      admin: {
        description: 'Add a button/link to this announcement',
      },
    },
    {
      name: 'actionText',
      type: 'text',
      admin: {
        condition: (data) => data?.hasAction,
        description: 'Button text (e.g., "Learn More", "View Details")',
      },
    },
    {
      name: 'actionLink',
      type: 'text',
      admin: {
        condition: (data) => data?.hasAction,
        description: 'Button link URL',
      },
    },
    
    // ============================================
    // Scheduling
    // ============================================
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'When should this announcement start showing? (Leave empty for immediate)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'When should this announcement stop showing? (Leave empty for indefinite)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    
    // ============================================
    // Status
    // ============================================
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Whether this announcement is currently active',
      },
    },
  ],
  
  // Timestamps
  timestamps: true,
}
