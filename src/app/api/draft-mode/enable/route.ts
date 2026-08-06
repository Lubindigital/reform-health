import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

/**
 * Entry point for draft mode. The Presentation tool points at this route via
 * `previewUrl.previewMode.enable` in sanity.config.ts.
 *
 * The client MUST carry a token: the handler validates the incoming URL against
 * a one-time secret stored as a draft document, and `validatePreviewUrl` throws
 * if the client is anonymous. This is also what stops anyone from switching
 * themselves into draft mode by guessing the URL.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
