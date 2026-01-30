/**
 * Site Settings Global
 * 
 * Global configuration for the BYN-K Platform. Controls site-wide settings
 * including branding, contact information, social links, and feature flags.
 * 
 * This is a "global" rather than a collection - there's only one instance
 * that applies to the entire site.
 * 
 * @module globals/SiteSettings
 */
import { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  
  // Admin panel configuration
  admin: {
    group: 'Site Management',
    description: 'Global site configuration and settings',
  },
  
  // Access control
  access: {
    // Public read access for displaying site info
    read: () => true,
    // Only admins can update settings
    update: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') ?? false
    },
  },
  
  fields: [
    // ============================================
    // Site Identity
    // ============================================
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'BYN-K Platform',
      admin: {
        description: 'The name of the site',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Opportunities for Banyamulenge Youth in Kenya',
      admin: {
        description: 'Site tagline/slogan',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Site description for SEO (max 300 characters)',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site logo',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site favicon (recommended: 32x32 or 64x64 PNG)',
      },
    },
    
    // ============================================
    // Contact Information
    // ============================================
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: {
            description: 'Primary contact email',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Contact phone number',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          admin: {
            description: 'Physical address',
          },
        },
      ],
    },
    
    // ============================================
    // Social Media Links
    // ============================================
    {
      name: 'social',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook page URL',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter/X profile URL',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram profile URL',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'LinkedIn page URL',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          admin: {
            description: 'YouTube channel URL',
          },
        },
        {
          name: 'whatsapp',
          type: 'text',
          admin: {
            description: 'WhatsApp contact link',
          },
        },
      ],
    },
    
    // ============================================
    // Feature Flags
    // ============================================
    {
      name: 'features',
      type: 'group',
      label: 'Feature Flags',
      admin: {
        description: 'Enable or disable site features',
      },
      fields: [
        {
          name: 'enableSiteTour',
          type: 'checkbox',
          label: 'Enable Site Tour',
          defaultValue: true,
          admin: {
            description: 'Show onboarding tour for first-time visitors',
          },
        },
        {
          name: 'enableNotifications',
          type: 'checkbox',
          label: 'Enable Notifications',
          defaultValue: true,
          admin: {
            description: 'Show toast notifications to users',
          },
        },
        {
          name: 'enableBookmarks',
          type: 'checkbox',
          label: 'Enable Bookmarks',
          defaultValue: true,
          admin: {
            description: 'Allow users to bookmark opportunities',
          },
        },
        {
          name: 'enableEvents',
          type: 'checkbox',
          label: 'Enable Events Section',
          defaultValue: true,
          admin: {
            description: 'Show community events on the site',
          },
        },
        {
          name: 'enableResources',
          type: 'checkbox',
          label: 'Enable Resources Section',
          defaultValue: true,
          admin: {
            description: 'Show resource library on the site',
          },
        },
        {
          name: 'maintenanceMode',
          type: 'checkbox',
          label: 'Maintenance Mode',
          defaultValue: false,
          admin: {
            description: 'Put the site in maintenance mode (only admins can access)',
          },
        },
      ],
    },
    
    // ============================================
    // Analytics & Tracking
    // ============================================
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics',
      admin: {
        description: 'Analytics and tracking configuration',
      },
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          admin: {
            description: 'Google Analytics ID (e.g., G-XXXXXXXXXX)',
          },
        },
      ],
    },
  ],
}
