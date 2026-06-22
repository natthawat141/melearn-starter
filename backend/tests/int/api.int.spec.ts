import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

/**
 * DB-backed integration tests.
 *
 * These require a REAL Postgres connection (Supabase or Cloud SQL). The repo
 * ships with a placeholder DATABASE_URL that does not point at a live database,
 * so the whole suite is SKIPPED unless a real connection string is supplied.
 *
 * To run locally against a throwaway Postgres:
 *   DATABASE_URL='postgres://user:pass@localhost:5432/melearn_test?sslmode=disable' \
 *     npm run test:int
 *
 * We refuse to fake these — see the review notes. They only execute when a
 * non-placeholder DATABASE_URL (or DATABASE_URI) is present.
 */
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URI || ''
const hasRealDb = connectionString !== '' && !connectionString.includes('<project-ref>')

const describeOrSkip = hasRealDb ? describe : describe.skip

let payload: Payload

describeOrSkip('API (requires a live Postgres DATABASE_URL)', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({ collection: 'users' })
    expect(users).toBeDefined()
    expect(Array.isArray(users.docs)).toBe(true)
  })

  it('hides unpublished courses from an anonymous (overrideAccess: false) find', async () => {
    const asAnonymous = await payload.find({
      collection: 'courses',
      overrideAccess: false,
    })
    expect(asAnonymous.docs.every((doc) => doc.published === true)).toBe(true)
  })
})
