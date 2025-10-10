import Link from "next/link";
import { about } from "../lib/studio";

export const metadata = { title: "About – Your Studio" };

function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 space-y-4">
      <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  const year = new Date().getFullYear();

  return (
    <div className="space-y-10">
      {/* Intro */}
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">About</h1>
        <div className="max-w-3xl space-y-3 text-neutral-500">
          {about.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="space-y-14">
        {/* Offices */}
        <Section id="offices" title="Offices">
          <div className="grid gap-8 sm:grid-cols-2">
            {about.offices.map((o) => (
              <div key={o.city} className="space-y-3 rounded-xl border border-black/10 p-5">
                <h3 className="text-base font-medium">{o.city}</h3>
                <div className="text-neutral-300">
                  {o.lines.map((l, i) => <p key={i}>{l}</p>)}
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {o.contacts.map((c, i) => (
                    <div key={i}>
                      <p className="uppercase tracking-wide text-xs text-neutral-500">{c.label}</p>
                      <p className="text-neutral-400">{c.name}{c.role && ` — ${c.role}`}</p>
                      <div className="flex flex-wrap gap-4">
                        {c.phone && <a href={`tel:${c.phone.replace(/\D/g,"")}`} className="hover:underline">{c.phone}</a>}
                        {c.email && <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Partners
        <Section id="partners" title="Partners">
          <div className="grid gap-8 md:grid-cols-3">
            {about.partners.map((p) => (
              <article key={p.name} className="space-y-2">
                <h3 className="text-base font-medium">{p.name}</h3>
                <p className="text-sm text-neutral-600">{p.role}</p>
                <p className="text-neutral-400">{p.bio}</p>
              </article>
            ))}
          </div>
        </Section> */}

        {/* Team */}
        <Section id="team" title="Team">
          <div className="grid gap-10 md:grid-cols-2">
            {about.team.map((g) => (
              <div key={g.group} className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{g.group}</h3>
                <ul className="space-y-1 text-neutral-400">
                  {g.people.map((name, i) => <li key={i}>{name}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Services */}
        <Section id="services" title="Services">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {about.services.map((s) => (
              <div key={s.group} className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{s.group}</h3>
                <ul className="space-y-1 text-neutral-400">
                  {s.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Clients */}
        {/* <Section id="clients" title="Selected Clients">
          <div className="grid gap-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-neutral-400">
            {about.clients.map((c) => <div key={c}>{c}</div>)}
          </div>
        </Section> */}

      </div>
    </div>
  );
}
