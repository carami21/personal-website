export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label mb-4">// 2 Player Mode</p>
        <h2 className="font-heading text-3xl font-bold md:text-4xl">Contact</h2>
        <p className="mx-auto mt-6 max-w-md text-cream/75">
          Open to data analytics roles, app collabs, and interesting side quests.
        </p>

        <a
          href="mailto:cramirezasu@gmail.com"
          className="mt-8 inline-block cursor-pointer font-mono text-lg text-ps2-light underline decoration-ps2/40 underline-offset-8 transition-colors duration-200 hover:text-cream md:text-xl"
          style={{ textShadow: '0 0 16px rgba(74,122,255,0.4)' }}
        >
          cramirezasu@gmail.com
        </a>

        <div className="mt-10 flex justify-center gap-6">
          <a
            href="https://github.com/carami21"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-cream/60 transition-colors duration-200 hover:text-ps2-light"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/carlos-ramirez-10024b289/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-cream/60 transition-colors duration-200 hover:text-ps2-light"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
            </svg>
          </a>
        </div>

        <p className="mt-20 font-mono text-xs text-muted">
          © {new Date().getFullYear()} Carlos Ramirez — Thanks for playing.
        </p>
      </div>
    </section>
  )
}
