'use client'

import { useCallback, useState } from 'react'
import Nav from './Nav'
import IntroScene from './IntroScene'
import About from './About'
import Projects from './Projects'
import Resume from './Resume'
import Contact from './Contact'
import StartTransition from './StartTransition'

/**
 * Gates the portfolio behind the START press: the sections are not
 * rendered at all until the transition's reveal fires, so there is no
 * scroll-past or #hash route into them. StartTransition lives here so
 * the overlay survives the intro unmounting mid-fade.
 */
export default function SiteShell() {
  const [entered, setEntered] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const handleStart = useCallback(() => setTransitioning(true), [])

  // Fires while the overlay still covers the screen: swap the intro for
  // the portfolio and land at the top without the global smooth scroll.
  const handleReveal = useCallback(() => {
    setEntered(true)
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = prev
  }, [])

  const handleDone = useCallback(() => setTransitioning(false), [])

  return (
    <main id="top">
      {entered ? (
        <>
          <Nav />
          <About />
          <Projects />
          <Resume />
          <Contact />
        </>
      ) : (
        <IntroScene onStart={handleStart} />
      )}
      <div className="site-scanlines" aria-hidden />
      {transitioning && <StartTransition onReveal={handleReveal} onDone={handleDone} />}
    </main>
  )
}
