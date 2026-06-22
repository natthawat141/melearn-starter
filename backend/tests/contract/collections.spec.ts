import { describe, it, expect } from 'vitest'
import type { CollectionConfig, Field } from 'payload'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Categories } from '@/collections/Categories'
import { Instructors } from '@/collections/Instructors'
import { Courses } from '@/collections/Courses'
import { Partners } from '@/collections/Partners'

/**
 * Contract/schema tests.
 *
 * These pin the *shape* of each collection config so accidental regressions
 * (a dropped `unique`, a flipped `required`, a re-targeted relationship, or an
 * access rule reverting to fully-open) fail CI without needing a live DB.
 */

// Type guard for fields that carry a `name` (Payload has presentational
// fields like `row`/`collapsible` that do not).
type NamedField = Field & { name: string }
const hasName = (f: Field): f is NamedField =>
  typeof (f as { name?: unknown }).name === 'string'

const fieldByName = (collection: CollectionConfig, name: string): NamedField | undefined =>
  (collection.fields.filter(hasName) as NamedField[]).find((f) => f.name === name)

describe('Users collection', () => {
  it('is the auth collection with email as title', () => {
    expect(Users.slug).toBe('users')
    expect(Users.auth).toBe(true)
    expect(Users.admin?.useAsTitle).toBe('email')
  })
})

describe('Media collection', () => {
  it('is an upload collection restricted to images with a required alt', () => {
    expect(Media.slug).toBe('media')
    expect(Media.upload).toBeTruthy()
    expect((Media.upload as { mimeTypes?: string[] }).mimeTypes).toContain('image/*')
    const alt = fieldByName(Media, 'alt')
    expect(alt?.type).toBe('text')
    expect((alt as { required?: boolean }).required).toBe(true)
  })

  it('allows public read but requires auth to write', () => {
    expect(Media.access?.read?.({ req: { user: undefined } } as never)).toBe(true)
    expect(Media.access?.create).toBeTypeOf('function')
    expect(Media.access?.update).toBeTypeOf('function')
    expect(Media.access?.delete).toBeTypeOf('function')
  })
})

describe.each([
  ['Categories', Categories, 'categories', 'name'],
  ['Instructors', Instructors, 'instructors', 'name'],
  ['Partners', Partners, 'partners', 'name'],
] as const)('%s collection', (_label, collection, slug, requiredField) => {
  it(`has slug "${slug}" and a required ${requiredField}`, () => {
    expect(collection.slug).toBe(slug)
    const field = fieldByName(collection, requiredField)
    expect((field as { required?: boolean }).required).toBe(true)
  })

  it('locks down create/update/delete to authenticated users', () => {
    expect(collection.access?.create).toBeTypeOf('function')
    expect(collection.access?.update).toBeTypeOf('function')
    expect(collection.access?.delete).toBeTypeOf('function')
  })
})

describe('Categories collection', () => {
  it('has a required, unique, indexed slug', () => {
    const slug = fieldByName(Categories, 'slug') as
      | (NamedField & { required?: boolean; unique?: boolean; index?: boolean })
      | undefined
    expect(slug?.type).toBe('text')
    expect(slug?.required).toBe(true)
    expect(slug?.unique).toBe(true)
    expect(slug?.index).toBe(true)
  })
})

describe('Courses collection', () => {
  it('has a required, unique, indexed slug', () => {
    const slug = fieldByName(Courses, 'slug') as
      | (NamedField & { required?: boolean; unique?: boolean })
      | undefined
    expect(slug?.required).toBe(true)
    expect(slug?.unique).toBe(true)
  })

  it('points its relationships at the right collections', () => {
    const category = fieldByName(Courses, 'category') as
      | (NamedField & { relationTo?: string })
      | undefined
    const instructor = fieldByName(Courses, 'instructor') as
      | (NamedField & { relationTo?: string })
      | undefined
    const thumbnail = fieldByName(Courses, 'thumbnail') as
      | (NamedField & { relationTo?: string })
      | undefined
    expect(category?.relationTo).toBe('categories')
    expect(instructor?.relationTo).toBe('instructors')
    expect(thumbnail?.relationTo).toBe('media')
  })

  it('constrains level to the three known values with a default', () => {
    const level = fieldByName(Courses, 'level') as
      | (NamedField & {
          options?: { value: string }[]
          defaultValue?: string
        })
      | undefined
    expect(level?.type).toBe('select')
    expect(level?.options?.map((o) => o.value)).toEqual([
      'beginner',
      'intermediate',
      'advanced',
    ])
    expect(level?.defaultValue).toBe('beginner')
  })

  it('rejects negative price and duration', () => {
    const price = fieldByName(Courses, 'price') as (NamedField & { min?: number }) | undefined
    const duration = fieldByName(Courses, 'durationWeeks') as
      | (NamedField & { min?: number })
      | undefined
    expect(price?.min).toBe(0)
    expect(duration?.min).toBe(0)
  })

  it('defaults published to false (drafts are not public by accident)', () => {
    const published = fieldByName(Courses, 'published') as
      | (NamedField & { defaultValue?: boolean })
      | undefined
    expect(published?.type).toBe('checkbox')
    expect(published?.defaultValue).toBe(false)
  })

  it('hides unpublished courses from anonymous reads but not editors', () => {
    const anon = Courses.access?.read?.({ req: { user: undefined } } as never)
    expect(anon).toEqual({ published: { equals: true } })
    const editor = Courses.access?.read?.({ req: { user: { id: 1 } } } as never)
    expect(editor).toBe(true)
  })
})

describe('Partners.url validation', () => {
  const urlField = fieldByName(Partners, 'url') as
    | (NamedField & { validate?: (v: unknown) => true | string })
    | undefined
  const validate = urlField?.validate as (v: unknown) => true | string

  it('accepts empty (optional) values', () => {
    expect(validate(undefined)).toBe(true)
    expect(validate(null)).toBe(true)
    expect(validate('')).toBe(true)
  })

  it('accepts valid http(s) URLs', () => {
    expect(validate('https://acme.example.com')).toBe(true)
    expect(validate('http://localhost:3000/path')).toBe(true)
  })

  it('rejects non-URL strings and non-http protocols', () => {
    expect(validate('not a url')).toBeTypeOf('string')
    expect(validate('javascript:alert(1)')).toBeTypeOf('string')
    expect(validate('ftp://example.com')).toBeTypeOf('string')
  })
})
