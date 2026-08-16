import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity webhook endpoint — this is what makes publishing feel instant.
//
// Register it in sanity.io/manage → API → Webhooks, pointed at
// https://<site>/api/revalidate, with the same secret as
// SANITY_REVALIDATE_SECRET and a projection that includes `_type`.
//
// Every fetch in lib/data.ts is tagged with the document types it reads, so
// invalidating the published type's tag is enough — there is no per-page map
// to keep in sync.
//
// `proxy.ts` skips /api, so this route is reachable without a locale prefix.

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new NextResponse("Missing SANITY_REVALIDATE_SECRET", { status: 500 });
  }

  try {
    // parseBody verifies the signature and waits out Content Lake's eventual
    // consistency, so a re-fetch triggered by this call sees the new document.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }
    if (!body?._type) {
      return new NextResponse("Bad request: no _type in payload", { status: 400 });
    }

    // `{ expire: 0 }`, not "max". Next's recommended "max" profile is
    // stale-while-revalidate: the first visitor after a publish still gets the
    // old page while the new one is fetched behind them, which reads as "my
    // photo didn't show up". The docs single out webhooks from external
    // systems as the case for immediate expiry — the next request blocks on a
    // fresh fetch instead. (The one-argument form does the same thing but is
    // deprecated in Next 16.)
    revalidateTag(body._type, { expire: 0 });

    return NextResponse.json({ revalidated: true, tag: body._type, now: Date.now() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}
