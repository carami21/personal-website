const SAVES = [
  {
    label: 'Save 1',
    text:
      'I graduated with a Bachelor of Science in Computer Science with Arizona State ' +
      'University in the Ira A. Fulton School of Engineering',
  },
  {
    label: 'Current Save',
    text:
      'I am currently pursuing a Masters of Science in Business Analytics with Arizona ' +
      'State University in the W.P. Carey School of Business',
  },
]

const CURRENTLY_BUILDING = [
  'Supply Chain Forecasting Dashboard',
  'BI Pipeline Project',
]

const GitHubIcon = (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
)

const LinkedInIcon = (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
  </svg>
)

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[3fr_2fr]">
        <div>
          <p className="section-label mb-4">// Player 1</p>
          <h2 className="font-heading text-4xl font-bold md:text-5xl">Carlos Ramirez</h2>
          <p className="mt-3 font-mono text-sm text-ps2-light md:text-base">
            CS Graduate · App Builder · Incoming MSBA @ W.P. Carey
          </p>
          <p className="mt-6 max-w-prose leading-relaxed text-cream/85">
            I grew up on a PS2 where I gained the love for technology and simply never
            stopped pressing START. Now I build iOS apps, data pipelines, and dashboards
            that range from Pool Map, shipped on the App Store, to a 50,000-record
            analytics project and an AI sustainability app built on Intel corporate data.
          </p>

          {/* Education as PS2 save slots */}
          <dl className="mt-6 max-w-prose space-y-3">
            {SAVES.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 border-l-2 border-ps2/40 pl-4 sm:flex-row sm:gap-3">
                <dt className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-ps2-light">
                  {s.label}
                </dt>
                <dd className="leading-relaxed text-cream/85">{s.text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Currently building:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CURRENTLY_BUILDING.map((p) => (
                <span
                  key={p}
                  className="rounded border border-ps2/40 bg-ps2/10 px-3 py-1 font-mono text-xs text-ps2-light"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-5">
            <a
              href="https://github.com/carami21"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-cream/70 transition-colors duration-200 hover:text-ps2-light"
            >
              {GitHubIcon}
            </a>
            <a
              href="https://www.linkedin.com/in/carlos-ramirez-10024b289/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-cream/70 transition-colors duration-200 hover:text-ps2-light"
            >
              {LinkedInIcon}
            </a>
          </div>
        </div>

        {/* Memory-card style graphic in place of a photo */}
        <div className="glass-card relative mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded border-2 border-ps2/50 bg-ink font-heading text-3xl font-bold text-ps2-light"
              style={{ textShadow: '0 0 16px rgba(74,122,255,0.8)' }}
            >
              CR
            </div>
            <p className="font-mono text-xs text-muted">MEMORY CARD (PS2)</p>
            <p className="mt-2 font-mono text-sm text-cream/80">Slot 1 — Carlos Ramirez</p>
            <div className="mt-6 space-y-2 text-left font-mono text-xs text-muted">
              <p><span className="text-ps2-light">SAVE 1</span> — B.S. Computer Science ✓</p>
              <p><span className="text-ps2-light">CURRENT SAVE</span> — MSBA · W.P. Carey</p>
              <p><span className="text-ps2-light">NEW GAME+</span> — Data Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
