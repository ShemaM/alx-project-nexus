/**
 * Payload CMS Configuration
 * 
 * Main configuration file for the BYN-K Platform CMS.
 * Defines all collections, globals, and admin settings.
 * 
 * Security Notes:
 * - PAYLOAD_SECRET must be a strong, unique secret in production
 * - Database credentials should be in environment variables
 * - Access control is defined at collection/field level
 * 
 * @module payload.config
 */
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// ============================================
// Collection Imports
// ============================================
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Opportunities } from './collections/Opportunities'
import { Partners } from './collections/Partners'
import { Bookmarks } from './collections/Bookmarks'
import { Resources } from './collections/Resources'
import { Events } from './collections/Events'
import { Announcements } from './collections/Announcements'

// ============================================
// Global Imports
// ============================================
import { SiteSettings } from './globals/SiteSettings'

// Get directory name for ES modules
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ============================================
  // Admin Panel Configuration
  // ============================================
  admin: {
    // User collection for authentication
    user: Users.slug,
    
    // Import map for custom components
    importMap: {
      baseDir: path.resolve(dirname),
    },
    
    // Custom admin meta
    meta: {
      titleSuffix: '- BYN-K Admin',
      // favicon and ogImage can be set here
    },
  },
  
  // ============================================
  // Collections
  // Organized by purpose for clarity
  // ============================================
  collections: [
    // User Management
    Users,
    
    // Content Management
    Opportunities,
    Partners,
    Resources,
    Events,
    
    // User Data
    Bookmarks,
    
    // Site Management
    Announcements,
    
    // System
    Media,
  ],
  
  // ============================================
  // Globals
  // Site-wide configuration
  // ============================================
  globals: [
    SiteSettings,
  ],
  
  // ============================================
  // Editor Configuration
  // ============================================
  editor: lexicalEditor(),
  
  // ============================================
  // Security Configuration
  // ============================================
  // IMPORTANT: Use a strong, unique secret in production
  secret: process.env.PAYLOAD_SECRET || '',
  
  // ============================================
  // TypeScript Configuration
  // ============================================
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  
  // ============================================
  // Database Configuration
  // Using PostgreSQL via Supabase
  // ============================================
  db: postgresAdapter({
    pool: {
      // Connection string from environment
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI,
      // Connection pool optimization for better performance
      max: 10, // Maximum number of connections in the pool
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 5000, // Timeout for new connections
    },
  }),
  
  // ============================================
  // Image Processing
  // Sharp for image optimization
  // ============================================
  sharp,
  
  // ============================================
  // GraphQL Configuration
  // ============================================
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
})