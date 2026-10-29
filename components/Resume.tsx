'use client'

import { useCallback, useEffect, useState } from 'react'

const RESUME_PDF = '/resume.pdf'
const RESUME_PREVIEW = '/resume-front.jpg'

const HIGHLIGHTS = [
  'B.S. Computer Science — full-stack + data foundations',
  '50,000+ record analysis with Tableau dashboards (Global Career Accelerator)',
  'AI sustainability app built on Intel corporate data (Sustainalyze)',
  'MSBA, Supply Chain Analytics — W.P. Carey School of Business, ASU',
]

/**
 * The resume is the real PDF, one click away: a sharp page preview that
 * opens a full-screen reader on desktop. Embedded PDFs don't render in
 * mobile Safari, so small screens hand the file to the native viewer in
 * a new tab instead.
 */
export default function Resume() {
  const [open, setOpen] = useState(false)

  const openResume = useCallback(() => {
    const narrow = typeof window !== 'undefined' && window.innerWidth < 768
    if (narrow) {
      window.open(RESUME_PDF, '_blank', 'noopener,noreferrer')
      return
    }
    setOpen(true)
  }, [])

  // Esc closes the reader; the page behind it stays put while it's up.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <section id="resume" className="scroll-mt-20 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label mb-4">// Status Screen</p>
        <h2 className="font-heading text-3xl font-bold md:text-4xl">Resume</h2>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          Click to read
        </p>

        <button
          type="button"
          onClick={openResume}
          className="glass-card group mx-auto mt-8 block w-full max-w-md cursor-pointer overflow-hidden rounded-lg p-3 text-left"
          aria-label="Open resume"
        >
          <span className="relative block overflow-hidden rounded bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RESUME_PREVIEW}
              alt="First page of Carlos Ramirez's resume"
              width={1313}
              height={1700}
              className="block h-auto w-full"
              loading="lazy"
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="rounded border border-ps2/60 bg-ink/80 px-5 py-2 font-heading text-sm tracking-[0.15em] text-cream">
                OPEN
              </span>
            </span>
          </span>
        </button>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.2em] text-ps2-light underline-offset-4 transition-colors duration-200 hover:text-cream hover:underline"
          >
            Open in new tab
          </a>
          <span aria-hidden className="font-mono text-xs text-muted">
            ·
          </span>
          <a
            href={RESUME_PDF}
            download="Carlos-Ramirez-Resume.pdf"
            className="font-mono text-xs uppercase tracking-[0.2em] text-ps2-light underline-offset-4 transition-colors duration-200 hover:text-cream hover:underline"
          >
            Download PDF
          </a>
        </div>

        <ul className="mx-auto mt-12 max-w-xl space-y-4 text-left">
          {HIGHLIGHTS.map((h) => (
            <li key={h} className="flex items-start gap-3 text-cream/85">
              <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-ps2" fill="none" aria-hidden>
                <path d="M2 8 L8 2 L14 8 L8 14 Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resume"
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 backdrop-blur-sm md:p-8"
          onClick={() => setOpen(false)}
        >
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 pb-3">
            <p className="font-heading text-sm tracking-[0.2em] text-cream">
              CARLOS RAMIREZ — RESUME
            </p>
            <div className="flex items-center gap-4">
              <a
                href={RESUME_PDF}
                download="Carlos-Ramirez-Resume.pdf"
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-xs uppercase tracking-[0.2em] text-ps2-light transition-colors duration-200 hover:text-cream"
              >
                Download
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded border border-ps2/40 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-cream/80 transition-colors duration-200 hover:border-ps2 hover:text-cream"
              >
                Close
              </button>
            </div>
          </div>
          <iframe
            src={`${RESUME_PDF}#view=FitH`}
            title="Carlos Ramirez resume"
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-5xl flex-1 rounded border border-ps2/20 bg-white"
          />
        </div>
      )}
    </section>
  )
}
