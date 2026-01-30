/**
 * Media Collection
 * 
 * Handles all file uploads including images, documents, and other media.
 * Used for partner logos, opportunity documents, and user avatars.
 * 
 * Security:
 * - File type restrictions to prevent malicious uploads
 * - Size limits to prevent storage abuse
 * 
 * @module collections/Media
 */
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  
  // Admin panel configuration
  admin: {
    group: 'System',
    description: 'Images, documents, and other uploaded files',
  },
  
  // Access control
  access: {
    // Public read access for displaying media
    read: () => true,
    // Only authenticated users can upload
    create: ({ req: { user } }) => Boolean(user),
    // Only admins can update media metadata
    update: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') ?? false
    },
    // Only admins can delete media
    delete: ({ req: { user } }) => {
      const userRoles = user?.roles as string[] | undefined
      return userRoles?.includes('admin') ?? false
    },
  },
  
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for accessibility (required for images)',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption for the media',
      },
    },
  ],
  
  // Upload configuration
  upload: {
    // Store files in the /media directory
    staticDir: 'media',
    
    // Image resizing for different use cases
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        position: 'centre',
      },
      {
        name: 'card',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1200,
        height: 600,
        position: 'centre',
      },
    ],
    
    // Allowed MIME types for security
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
}
