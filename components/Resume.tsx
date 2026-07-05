const HIGHLIGHTS = [
  'B.S. Computer Science — full-stack + data foundations',
  '50,000+ record analysis with Tableau dashboards (Global Career Accelerator)',
  'AI sustainability app built on Intel corporate data (Sustainalyze)',
  'Incoming MSBA, Supply Chain Analytics — W.P. Carey School of Business, ASU',
]

export default function Resume() {
  return (
    <section id="resume" className="scroll-mt-20 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label mb-4">// Status Screen</p>
        <h2 className="font-heading text-3xl font-bold md:text-4xl">Resume</h2>

        <ul className="mx-auto mt-10 max-w-xl space-y-4 text-left">
          {HIGHLIGHTS.map((h) => (
            <li key={h} className="flex items-start gap-3 text-cream/85">
              <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-ps2" fill="none" aria-hidden>
                <path d="M2 8 L8 2 L14 8 L8 14 Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>

        {/* PS2 menu-style button. Swap href for the real PDF when ready. */}
        <a
          href="https://www.linkedin.com/in/carlos-ramirez-10024b289/"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-12 inline-flex cursor-pointer items-center gap-3 rounded border border-ps2/60 bg-ps2/10 px-8 py-4 font-heading text-base tracking-wide text-cream transition-all duration-200 hover:border-ps2 hover:bg-ps2/20"
          style={{ boxShadow: '0 0 24px rgba(74,122,255,0.25)' }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-ps2-light" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Download Resume
          <span className="font-mono text-xs text-muted transition-colors group-hover:text-ps2-light">
            [ COMING SOON — LINKEDIN FOR NOW ]
          </span>
        </a>
      </div>
    </section>
  )
}
