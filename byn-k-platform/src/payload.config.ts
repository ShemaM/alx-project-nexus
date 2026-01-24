import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// Collection Imports
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Opportunities } from './collections/Opportunities'
import { Partners } from './collections/Partners'
import { Bookmarks } from './collections/Bookmarks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Registering all collections for the BYN-K Platform
  collections: [Users, Media, Opportunities, Partners, Bookmarks],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      // Priority connection string for Supabase
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI,
    },
  }),
  sharp,
})