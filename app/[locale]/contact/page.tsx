import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContactPage } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const contact = await getContactPage(locale);
  return pageMetadata(
    locale,
    "/contact",
    contact?.seo.metaTitle ?? dict.contact.metaTitle,
    contact?.seo.metaDescription ?? contact?.lead
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { contact: ui } = getDictionary(locale);
  const contact = await getContactPage(locale);

  return (
    <main className="page">
      <div className="contact__grid">
        <div>
          <h1 className="display page__title">{ui.title}</h1>
          {contact && <p className="contact__lead">{contact.lead}</p>}
          {/* Wire this up to a server action or form endpoint in production. */}
          <form className="form">
            <input className="input" placeholder={ui.form.name} />
            <input className="input" placeholder={ui.form.email} />
            <input className="input" placeholder={ui.form.projectType} />
            <textarea className="input" rows={4} placeholder={ui.form.message} />
            <button type="submit" className="cta">
              {ui.form.submit}
            </button>
          </form>
        </div>

        <aside className="contact__details">
          <div className="kicker" style={{ marginBottom: 24 }}>
            {ui.detailsKicker}
          </div>
          {contact && contact.details.length > 0 ? (
            contact.details.map((detail) => (
              <div key={detail.key} className="contact__row">
                <div className="contact__label">{detail.label}</div>
                <div className="contact__value">{detail.value}</div>
              </div>
            ))
          ) : (
            <p className="empty">{ui.empty}</p>
          )}
        </aside>
      </div>
    </main>
  );
}
