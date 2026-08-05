import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * The single Sanity read client for the whole app.
 *
 * There used to be two: this one (imported by nothing) and a second
 * `createClient` call in src/sanity/client.ts that every page actually used.
 * They disagreed about `useCdn`, and neither configured stega — so
 * click-to-edit could never have worked. Everything now derives from this one.
 *
 * `stega.studioUrl` is what makes visual editing possible later: next-sanity
 * only turns stega encoding on when `client.config().stega.studioUrl` is
 * defined (and draft mode is active). Without it the Presentation overlays
 * render but every click is a silent no-op, with no error anywhere. It is a
 * base path rather than a full URL because the Studio is embedded in this app
 * at /studio.
 *
 * `useCdn: false` is deliberate and predates this consolidation — it means a
 * publish in Studio shows up on the next request instead of after the CDN's
 * ~60s window. Revisit when Live Content lands: defineLive selects the CDN
 * automatically for published traffic, which also moves public reads onto the
 * much larger free-tier request budget.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    studioUrl: '/studio',
  },
})
