'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemas'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide the Site Settings document type from generic "Create new..." menus
    // so dad doesn't accidentally make a second one. The Studio sidebar shows
    // the single editable instance via custom structure.
    templates: (templates) =>
      templates.filter((t) => t.schemaType !== 'siteSettings'),
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
