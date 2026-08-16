import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/lib/sanity/client";

const builder = createImageUrlBuilder({ projectId, dataset });

// The builder reads the hotspot/crop stored on the image, so a cropped square
// tile stays centred on the subject instead of the middle of the frame. That
// only works if the query projects the whole `image` object (asset + hotspot +
// crop), not just the asset URL.
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

/** A square, hotspot-aware crop — the gallery wall and series tiles. */
export function squareUrl(source: SanityImageSource, size: number): string {
  return urlFor(source).width(size).height(size).fit("crop").url();
}

/** Fixed height, natural width — the homepage reel. */
export function heightUrl(source: SanityImageSource, height: number, width: number): string {
  return urlFor(source).width(width).height(height).fit("crop").url();
}
