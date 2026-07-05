'use client'

import { useState } from 'react'

const LINKS = [
  { href: '#top', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav
        className="flex items-center justify-between px-6 py-4 md:px-12"
        style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)' }}
        aria-label="Main navigation"
      >
        <a
          href="#top"
          className="font-heading text-xl font-bold tracking-[0.2em] text-ps2-light"
          style={{ textShadow: '0 0 12px rgba(74,122,255,0.6)' }}
        >
          CR
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-heading text-sm tracking-wide text-cream/80 transition-colors duration-200 hover:text-ps2-light"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className={`h-0.5 w-6 bg-cream transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-cream transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-cream transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul
          className="flex flex-col gap-1 px-6 pb-4 md:hidden"
          style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)' }}
        >
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-heading text-base text-cream/90 transition-colors duration-200 hover:text-ps2-light"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
