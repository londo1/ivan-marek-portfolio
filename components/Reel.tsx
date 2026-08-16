import Image from "next/image";
import type { Photo } from "@/lib/data";
import { heightUrl } from "@/lib/sanity/image";

// Auto-scrolling marquee of featured frames. Pure CSS animation (see
// .reel__track in globals.css) — pauses on hover, no JS required, so it can
// stay a Server Component. The set is duplicated once for a seamless loop.
const REEL_HEIGHT = 380;

// Retina source: the tiles are 380px tall in CSS, so ask Sanity for twice that.
const SOURCE_SCALE = 2;

export default function Reel({ photos, ariaLabel }: { photos: Photo[]; ariaLabel: string }) {
  if (photos.length === 0) return null;

  const tiles = [...photos, ...photos];

  return (
    <section className="reel" aria-label={ariaLabel}>
      <div className="reel__track">
        {tiles.map((photo, i) => {
          // Each frame keeps its own proportions: the tile height is fixed, so
          // the width follows from the asset's real aspect ratio.
          const width = Math.round(REEL_HEIGHT * photo.aspectRatio);
          return (
            <div key={`${photo.id}-${i}`} className="reel__tile" style={{ width }}>
              <Image
                className="tile__img"
                src={heightUrl(photo.image, REEL_HEIGHT * SOURCE_SCALE, width * SOURCE_SCALE)}
                // The reel is decorative repetition of the gallery; the second
                // copy exists only to make the loop seamless.
                alt={i < photos.length ? photo.alt : ""}
                aria-hidden={i >= photos.length}
                width={width}
                height={REEL_HEIGHT}
                sizes={`${width}px`}
                placeholder={photo.lqip ? "blur" : "empty"}
                blurDataURL={photo.lqip ?? undefined}
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
