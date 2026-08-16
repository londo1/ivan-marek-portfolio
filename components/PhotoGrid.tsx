import Image from "next/image";
import type { Photo } from "@/lib/data";
import { squareUrl } from "@/lib/sanity/image";

// Uniform square grid — the "all photos" wall. The photographs come from
// Sanity via lib/data.ts and are passed in as a prop, so this stays a Server
// Component with no data fetching of its own.
//
// The tiles are square while the frames are not, so the crop is hotspot-aware:
// squareUrl() asks Sanity's CDN for a square derivative centred on the focal
// point the photographer set in the Studio.

// Source width requested from Sanity. next/image then generates the srcset
// from `sizes`, so this only needs to be big enough for the largest tile on a
// high-density screen.
const SOURCE_SIZE = 1200;

export default function PhotoGrid({
  photos,
  emptyLabel,
}: {
  photos: Photo[];
  emptyLabel: string;
}) {
  if (photos.length === 0) {
    return <p className="empty">{emptyLabel}</p>;
  }

  return (
    <div className="gallery__grid">
      {photos.map((photo) => (
        <div key={photo.id} className="gallery__tile">
          <Image
            className="tile__img"
            src={squareUrl(photo.image, SOURCE_SIZE)}
            alt={photo.alt}
            width={SOURCE_SIZE}
            height={SOURCE_SIZE}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            placeholder={photo.lqip ? "blur" : "empty"}
            blurDataURL={photo.lqip ?? undefined}
          />
        </div>
      ))}
    </div>
  );
}
