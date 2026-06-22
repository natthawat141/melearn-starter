import { describe, it, expect } from 'vitest'
import type { AccessArgs } from 'payload'

import { anyone, isAuthenticated, publishedOrAuthenticated } from '@/access'

/**
 * Unit tests for the shared access-control helpers.
 *
 * These run without a database: the helpers are pure functions of the request,
 * so we pass a minimal `req` stub. The cast narrows the rich PayloadRequest to
 * just the field each helper reads (`user`).
 */
const argsWithUser = (user: unknown): AccessArgs =>
  ({ req: { user } } as unknown as AccessArgs)

describe('access/anyone', () => {
  it('grants access to anonymous requests', () => {
    expect(anyone(argsWithUser(undefined))).toBe(true)
  })

  it('grants access to authenticated requests', () => {
    expect(anyone(argsWithUser({ id: 1 }))).toBe(true)
  })
})

describe('access/isAuthenticated', () => {
  it('denies anonymous requests', () => {
    expect(isAuthenticated(argsWithUser(null))).toBe(false)
    expect(isAuthenticated(argsWithUser(undefined))).toBe(false)
  })

  it('allows requests with a user', () => {
    expect(isAuthenticated(argsWithUser({ id: 1, email: 'a@b.co' }))).toBe(true)
  })
})

describe('access/publishedOrAuthenticated', () => {
  it('returns a published-only Where filter for anonymous requests', () => {
    const result = publishedOrAuthenticated(argsWithUser(undefined))
    // Anonymous callers must be constrained at the query layer, not trusted to
    // be filtered client-side — assert the exact Where shape.
    expect(result).toEqual({ published: { equals: true } })
  })

  it('returns true (unrestricted) for authenticated requests', () => {
    expect(publishedOrAuthenticated(argsWithUser({ id: 1 }))).toBe(true)
  })
})
