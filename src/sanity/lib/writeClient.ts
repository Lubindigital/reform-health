import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Create a document that must not be readable by the public.
 *
 * The `production` dataset is PUBLIC — private datasets are a paid feature, and
 * the project id ships in the client bundle as NEXT_PUBLIC_SANITY_PROJECT_ID.
 * That means anyone can run arbitrary GROQ against it with no token. Published
 * documents are fair game; drafts are not — Sanity excludes `drafts.*` from
 * unauthenticated API reads.
 *
 * So every form submission is written as a draft. It still appears in the
 * Studio inbox exactly as before, but a stranger enumerating the dataset can no
 * longer read leads' names, emails, phone numbers or messages. sanity.config.ts
 * blocks the publish action on these types so they cannot be promoted by
 * accident.
 *
 * Use this for anything containing personal data. Use `writeClient.create`
 * directly only for content that is meant to be world-readable.
 */
export function createPrivateDocument<T extends { _type: string }>(doc: T) {
  return writeClient.create({
    ...doc,
    _id: `drafts.${crypto.randomUUID()}`,
  });
}
