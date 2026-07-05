import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  return pageMetadata(params.locale, "/contact", dict.contact.metaTitle, dict.contact.lead);
}

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const { contact } = getDictionary(params.locale);

  return (
    <main className="page">
      <div className="contact__grid">
        <div>
          <h1 className="display page__title">{contact.title}</h1>
          <p className="contact__lead">{contact.lead}</p>
          {/* Wire this up to a server action or form endpoint in production. */}
          <form className="form">
            <input className="input" placeholder={contact.form.name} />
            <input className="input" placeholder={contact.form.email} />
            <input className="input" placeholder={contact.form.projectType} />
            <textarea className="input" rows={4} placeholder={contact.form.message} />
            <button type="submit" className="cta">
              {contact.form.submit}
            </button>
          </form>
        </div>

        <aside className="contact__details">
          <div className="kicker" style={{ marginBottom: 24 }}>
            {contact.detailsKicker}
          </div>
          {contact.details.map((d) => (
            <div key={d.label} className="contact__row">
              <div className="contact__label">{d.label}</div>
              <div className="contact__value">{d.value}</div>
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
