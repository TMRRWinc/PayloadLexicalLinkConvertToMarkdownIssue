import { createHeadlessEditor } from '@lexical/headless'
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'

import type { FieldHook } from '../../../../packages/payload/src/fields/config/types'

import {
  defaultEditorConfig,
  defaultEditorFeatures,
  getEnabledNodes,
  sanitizeEditorConfig,
} from '../../../../packages/richtext-lexical/src'

export const lexicalToMarkdownFieldHook: FieldHook = (args) => {
  const { value, context } = args

  if (value) {
    const editorConfig = defaultEditorConfig
    editorConfig.features = [...defaultEditorFeatures]

    const headlessEditor = createHeadlessEditor({
      nodes: getEnabledNodes({
        editorConfig: sanitizeEditorConfig(editorConfig),
      }),
    })

    try {
      headlessEditor.setEditorState(headlessEditor.parseEditorState(value))
    } catch (error) {
      console.error('Error parsing editor state', error)
    }

    let markdown = ''

    headlessEditor.getEditorState().read(() => {
      markdown = $convertToMarkdownString(TRANSFORMERS)
    })

    context[`${args.field.name}_markdown`] = markdown
  }
}
