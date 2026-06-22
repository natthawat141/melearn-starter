import type { CollectionConfig } from 'payload'
import { anyone, isAuthenticated } from '../access'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: anyone,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'url',
      type: 'text',
      // Reject non-http(s) URLs to prevent javascript: or data: links on the public site.
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          const { protocol } = new URL(value)
          if (protocol !== 'http:' && protocol !== 'https:') {
            return 'URL must use http or https.'
          }
          return true
        } catch {
          return 'Please enter a valid URL.'
        }
      },
    },
  ],
}
