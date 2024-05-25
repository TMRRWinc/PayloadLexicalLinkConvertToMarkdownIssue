import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'

import { lexicalEditor } from '../../../../packages/richtext-lexical/src'
import { mediaSlug } from '../Media'
import { lexicalToMarkdownFieldHook } from './hooks'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'associatedMedia',
      access: {
        create: () => true,
        update: () => false,
      },
      relationTo: mediaSlug,
      type: 'upload',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({}),
      hooks: {
        afterChange: [lexicalToMarkdownFieldHook],
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ context, doc }) => {
        // add context to the doc so markdown value is available to test against
        return { ...doc, ...context }
      },
    ],
  },
  slug: postsSlug,
}
