'use client'

import { useEffect, useState } from 'react'
import type { Repo } from '@/app/api/github/route'

/**
 * Repos carrying this GitHub topic are added to the grid automatically —
 * tag a repo `portfolio` on GitHub and a card appears here on the next
 * revalidate, no code change.
 */
const FEATURE_TOPIC = 'portfolio'

type Project = {
  name: string
  description: string
  tags: string[]
  status: string
  href?: string
  /** owner/name — links the card to a repo for live language, stars and last push. */
  repo?: string
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
    repo: 'carami21/supply-chain-forecasting-dashboard',
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

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const days = Math.floor((Date.now() - then) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function ProjectCard({ project, repo }: { project: Project; repo?: Repo }) {
  // GitHub fills in what it knows; the curated copy stays the headline.
  const href = project.href ?? repo?.homepage ?? repo?.url
  const description = project.description || repo?.description || ''
  const tags = project.tags.length
    ? project.tags
    : [repo?.language, ...(repo?.topics.filter((t) => t !== FEATURE_TOPIC) ?? [])].filter(
        (t): t is string => Boolean(t),
      )

  return (
    <article className="glass-card flex cursor-pointer flex-col rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-heading text-xl font-semibold text-cream">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer">
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
        <span className="shrink-0 rounded border border-ps2/30 px-2 py-0.5 font-mono text-[10px] tracking-wider text-ps2-light">
          {project.status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-cream/75">{description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted"
          >
            {t}
          </span>
        ))}
      </div>

      {repo && (
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/5 pt-4 font-mono text-[11px] text-muted">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-ps2-light"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            {repo.name}
          </a>
          <span>updated {relativeTime(repo.pushedAt)}</span>
          {repo.language && <span>{repo.language}</span>}
          {repo.stars > 0 && <span>★ {repo.stars}</span>}
        </div>
      )}
    </article>
  )
}

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [synced, setSynced] = useState(false)

  // The curated grid renders immediately; GitHub data layers on when it lands.
  useEffect(() => {
    let active = true
    fetch('/api/github')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data?.ok) return
        setRepos(data.repos as Repo[])
        setSynced(true)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const byFullName = new Map(repos.map((r) => [r.fullName.toLowerCase(), r]))
  const curated = PROJECTS.map((p) => ({
    project: p,
    repo: p.repo ? byFullName.get(p.repo.toLowerCase()) : undefined,
  }))

  // Anything tagged with the feature topic that isn't already a curated card.
  const claimed = new Set(
    PROJECTS.map((p) => p.repo?.toLowerCase()).filter((r): r is string => Boolean(r)),
  )
  const discovered = repos
    .filter((r) => r.topics.includes(FEATURE_TOPIC) && !claimed.has(r.fullName.toLowerCase()))
    .map((r) => ({
      project: {
        name: r.name,
        description: r.description ?? '',
        tags: [],
        status: 'FROM GITHUB',
      } as Project,
      repo: r,
    }))

  const cards = [...curated, ...discovered]
  const lastPush = repos.length
    ? repos.reduce((a, b) => (a.pushedAt > b.pushedAt ? a : b)).pushedAt
    : null

  return (
    <section id="projects" className="scroll-mt-20 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="section-label mb-4">// Select Memory Card</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">Projects</h2>
          {synced && lastPush && (
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ps2 align-middle" />
              Synced with{' '}
              <a
                href="https://github.com/carami21"
                target="_blank"
                rel="noreferrer"
                className="text-ps2-light transition-colors duration-200 hover:text-cream"
              >
                GitHub
              </a>{' '}
              · last push {relativeTime(lastPush)}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cards.map(({ project, repo }) => (
            <ProjectCard key={project.name} project={project} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  )
}
