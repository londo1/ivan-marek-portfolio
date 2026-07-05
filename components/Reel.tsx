import { PHOTOS } from "@/lib/data";

// Auto-scrolling marquee of featured frames. Pure CSS animation (see
// .reel__track in globals.css) — pauses on hover, no JS required, so it can
// stay a Server Component. The set is duplicated once for a seamless loop.
const REEL_HEIGHT = 380;

export default function Reel({ ariaLabel }: { ariaLabel: string }) {
  const tiles = [...PHOTOS, ...PHOTOS];
  return (
    <section className="reel" aria-label={ariaLabel}>
      <div className="reel__track">
        {tiles.map((p, i) => (
          <div
            key={i}
            className="reel__tile"
            style={{
              background: p.grad,
              width: Math.round(REEL_HEIGHT * p.ar),
            }}
            /* Production: replace with
               <Image src={p.src} alt="" width={...} height={REEL_HEIGHT} /> */
          />
        ))}
      </div>
    </section>
  );
}
