import { GALLERY } from "@/lib/data";

// Uniform square grid — the "all photos" wall. In production this list would
// come from the CMS; the tiles would become next/image <Image> components.
export default function PhotoGrid() {
  return (
    <div className="gallery__grid">
      {GALLERY.map((p, i) => (
        <div
          key={i}
          className="gallery__tile"
          style={{ background: p.grad }}
        />
      ))}
    </div>
  );
}
