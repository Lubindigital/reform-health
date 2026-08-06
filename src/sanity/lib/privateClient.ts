import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * SERVER-ONLY client for reading documents that are deliberately never
 * published — currently just `eventJoinLink`, which holds webinar join links.
 *
 * Two things make this work, and both matter:
 *  - a token, because unauthenticated reads cannot see drafts at all;
 *  - `perspective: "drafts"`, because the default published perspective would
 *    skip a document that only ever exists as a draft.
 *
 * That combination is exactly what keeps the join link private: the same query
 * run by anyone without a token returns null. Never import this into a client
 * component, and never widen what it queries to anything the public should see —
 * a Viewer token can read every draft in the dataset, including the contact and
 * registration records.
 */
const privateClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "drafts",
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function privateFetch<T>(
  query: string,
  params?: Record<string, string>,
): Promise<T | null> {
  if (!process.env.SANITY_API_READ_TOKEN) {
    console.error("[privateFetch] SANITY_API_READ_TOKEN is not set — join links cannot be read");
    return null;
  }
  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
    const request = params ? privateClient.fetch<T>(query, params) : privateClient.fetch<T>(query);
    const result = await Promise.race([request, timeout]);
    return (result ?? null) as T | null;
  } catch (error) {
    console.error("[privateFetch] query failed:", error);
    return null;
  }
}
