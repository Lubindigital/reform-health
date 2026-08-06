'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemas'
import {structure} from './src/sanity/structure'
import {resolve} from './src/sanity/presentation/resolve'

// Site Settings is a singleton: exactly one document, pinned to a known id by
// src/sanity/structure.ts. Filtering `templates` below hides it from Create
// menus, but that alone left Delete, Duplicate and Unpublish live in its
// Actions menu. Duplicate was the dangerous one — it mints a second settings
// document with a random id while the structure and the GROQ query keep reading
// the original, so you'd be editing a ghost with no feedback.
const SINGLETON_TYPES = new Set(['siteSettings'])
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

// Form submissions. Written by the API routes, never by hand, and they sit in
// the same sidebar the site owner browses for content.
//
// This is an ALLOWLIST rather than a denylist, and the list is empty on
// purpose. Sanity ships twelve built-in document actions and a denylist only
// ever covers the ones you thought of — `schedule` (Scheduled Publishing) and
// the Canvas actions would have sailed straight through and published a lead's
// name, email and phone number onto a PUBLIC dataset, defeating the draft-only
// privacy scheme in src/sanity/lib/writeClient.ts. An allowlist also holds when
// Sanity adds a thirteenth action.
//
// Consequence: these documents have no action buttons at all. If spam ever
// needs clearing, add 'delete' here deliberately rather than leaving the door
// open by default.
const SUBMISSION_TYPES = new Set(['contact', 'eventRegistration'])
const SUBMISSION_ACTIONS = new Set<string>([])

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
        return prev.filter(({action}) => action && SUBMISSION_ACTIONS.has(action))
      }
      return prev
    },
    // Single-editor Studio — the "Ask to edit" prompt is only confusing here.
    askToEdit: {enabled: false},
  },
  plugins: [
    // Split-screen editing: document on the left, live site on the right.
    // `previewUrl.initial` is deliberately omitted — it defaults to
    // location.origin, which is correct because the Studio is embedded in this
    // same app at /studio. That also means it just works on localhost and on
    // every Vercel preview URL without an env var per environment.
    //
    // Only `enable` is configured: `previewMode.disable` is marked
    // not-implemented in Sanity and is never called, so the way out of draft
    // mode is the /api/draft-mode/disable route linked from the site.
    presentationTool({
      previewUrl: {
        previewMode: {enable: '/api/draft-mode/enable'},
      },
      resolve,
    }),
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
