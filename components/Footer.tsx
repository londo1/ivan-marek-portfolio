import type { Dictionary } from "@/lib/dictionaries";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="footer">
      <span className="footer__name">Ivan Hristov</span>
      <span className="footer__note">{dict.footer.note}</span>
    </footer>
  );
}
