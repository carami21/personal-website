import { NextResponse } from 'next/server'

/**
 * Live project data from GitHub.
 *
 * The portfolio cards read from this instead of hard-coded metadata, so
 * pushing to a repo updates the site on its own. Two things drive it:
 *
 *   1. A curated card that declares `repo` picks up that repo's language,
 *      stars and last-push date.
 *   2. Any public repo topic-tagged `portfolio` shows up as a card by
 *      itself — tag a repo on GitHub and it appears here.
 *
 * Responses are cached for 30 minutes, so the unauthenticated GitHub rate
 * limit (60/hr per IP) is never a factor: ~48 upstream calls a day. Set a
 * read-only GITHUB_TOKEN in the Vercel env to raise the ceiling and to
 * include private repos; it is optional and never committed.
 */

const GITHUB_USER = 'carami21'
const CACHE_SECONDS = 1800

export const revalidate = CACHE_SECONDS

type GitHubRepo = {
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  pushed_at: string
  fork: boolean
  archived: boolean
  private: boolean
}

export type Repo = {
  name: string
  fullName: string
  description: string | null
  url: string
  homepage: string | null
  language: string | null
  topics: string[]
  stars: number
  pushedAt: string
}

export async function GET() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
      { headers, next: { revalidate: CACHE_SECONDS } },
    )

    // A rate limit or an outage must not take the Projects section down:
    // the client keeps its curated copy and just skips the live badges.
    if (!res.ok) {
      return NextResponse.json(
        { repos: [], fetchedAt: new Date().toISOString(), ok: false },
        { status: 200 },
      )
    }

    const raw: GitHubRepo[] = await res.json()
    const repos: Repo[] = raw
      .filter((r) => !r.fork && !r.archived && !r.private)
      .map((r) => ({
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage,
        language: r.language,
        topics: r.topics ?? [],
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
      }))

    return NextResponse.json({ repos, fetchedAt: new Date().toISOString(), ok: true })
  } catch {
    return NextResponse.json(
      { repos: [], fetchedAt: new Date().toISOString(), ok: false },
      { status: 200 },
    )
  }
}
