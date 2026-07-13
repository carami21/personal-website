type Project = {
  name: string
  description: string
  tags: string[]
  status: string
  href?: string
}

const PROJECTS: Project[] = [
  {
    name: 'Pool Map',
    description: 'iOS app for finding and checking into pools — shipped and live on the App Store, built with my partner Andre.',
    tags: ['React Native', 'Expo', 'Express', 'PostgreSQL'],
    status: 'SHIPPED — APP STORE',
    href: 'https://poolmap.live',
  },
  {
    name: 'Supply Chain Forecasting Dashboard',
    description: 'Python + Tableau dashboard forecasting demand anomalies across a supply chain dataset.',
    tags: ['Python', 'Tableau', 'Forecasting', 'Pandas'],
    status: 'IN DEVELOPMENT',
  },
  {
    name: 'BI Pipeline Project',
    description: 'End-to-end ETL pipeline — SQL to Python to Power BI — turning raw data into business insights.',
    tags: ['SQL', 'Python', 'Power BI', 'ETL'],
    status: 'IN DEVELOPMENT',
  },
  {
    name: 'Sustainalyze',
    description: 'AI sustainability app analyzing corporate data, built in partnership with Intel.',
    tags: ['AI', 'Data Analysis', 'Intel'],
    status: 'SHIPPED',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="section-label mb-4">// Select Memory Card</p>
        <h2 className="font-heading text-3xl font-bold md:text-4xl">Projects</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <article key={p.name} className="glass-card cursor-pointer rounded-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-heading text-xl font-semibold text-cream">
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noreferrer">
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>
                <span className="shrink-0 rounded border border-ps2/30 px-2 py-0.5 font-mono text-[10px] tracking-wider text-ps2-light">
                  {p.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">{p.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
