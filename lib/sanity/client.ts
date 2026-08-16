import { createClient } from "next-sanity";

// The Studio that writes this content is a standalone sibling of this app
// (../studio-photography, deployed to sk3ctpa6.sanity.studio). Nothing here
// imports Studio code — this is the read side only.

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
);
export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET
);

// Pinned, not floating: a new API version can change GROQ behaviour, so it
// only moves when someone deliberately bumps it.
export const apiVersion = "2026-08-16";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Published content only — the photographer's publish button is the switch
  // that puts something live, and there is no preview mode. Draft mode can be
  // added later by overriding `perspective` per request; every fetch already
  // goes through lib/data.ts.
  perspective: "published",
  useCdn: true,
});
