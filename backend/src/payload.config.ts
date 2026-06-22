import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Instructors } from './collections/Instructors'
import { Courses } from './collections/Courses'
import { Partners } from './collections/Partners'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'

// Accept both DATABASE_URL and DATABASE_URI — infra historically used DATABASE_URI
// while this config used DATABASE_URL, which silently produced an empty string in
// production. Prefer DATABASE_URL so either name works without a broken boot.
const databaseConnectionString = process.env.DATABASE_URL || process.env.DATABASE_URI || ''

if (process.env.NODE_ENV === 'production' && !databaseConnectionString) {
  throw new Error(
    'DATABASE_URL (or DATABASE_URI) must be set in production. ' +
      'See .env.example for the Supabase/Cloud SQL connection string formats.',
  )
}

if (process.env.NODE_ENV === 'production' && !process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET must be set in production.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Instructors, Courses, Partners],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseConnectionString,
    },
    // Schema migrations must be explicit files applied by a separate job.
    // Drizzle push is only available locally when PAYLOAD_DB_PUSH=true is set
    // explicitly; in production it is always false to prevent boot-time mutations.
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  cors: [frontendURL],
  csrf: [frontendURL],
  sharp,
  plugins: [],
})
