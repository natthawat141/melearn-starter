import type { Access } from 'payload'

// Centralised access-control helpers — explicit policies auditable in one place
// rather than scattered across collection files.

/** Public, unauthenticated read. Use only for fully public catalog data. */
export const anyone: Access = () => true

/** True only when there is an authenticated user on the request. */
export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

/**
 * Returns a `Where` query for anonymous requests so unpublished rows are
 * filtered at the database layer, not just hidden in the admin UI.
 */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return {
    published: {
      equals: true,
    },
  }
}
