'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemas'
import {structure} from './src/sanity/structure'

// Site Settings is a singleton: exactly one document, pinned to a known id by
// src/sanity/structure.ts. Filtering `templates` below hides it from Create
// menus, but that alone left Delete, Duplicate and Unpublish live in its
// Actions menu. Duplicate was the dangerous one — it mints a second settings
// document with a random id while the structure and the GROQ query keep reading
// the original, so you'd be editing a ghost with no feedback.
const SINGLETON_TYPES = new Set(['siteSettings'])
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

// Form submissions. These are written by the API routes, never by hand, and
// they sit in the same sidebar the site owner browses for content — two clicks
// from Delete, with an undo toast that expires. Lock the destructive actions.
// `publish` is blocked too, on purpose. These are written as drafts so they
// stay invisible to unauthenticated readers of this public dataset — see
// src/sanity/lib/writeClient.ts. Publishing one would put a real person's name,
// email and phone number back on the open API.
const SUBMISSION_TYPES = new Set(['contact', 'eventRegistration'])
const SUBMISSION_BLOCKED = new Set(['delete', 'duplicate', 'unpublish', 'publish'])

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
  document: {
    actions: (prev, context) => {
      if (SINGLETON_TYPES.has(context.schemaType)) {
        return prev.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
      }
      if (SUBMISSION_TYPES.has(context.schemaType)) {
        return prev.filter(({action}) => !action || !SUBMISSION_BLOCKED.has(action))
      }
      return prev
    },
    // Single-editor Studio — the "Ask to edit" prompt is only confusing here.
    askToEdit: {enabled: false},
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
