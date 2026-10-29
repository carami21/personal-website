# carlos-ramirez-portfolio

PS2-themed personal site. Next.js 14 (app router) + Tailwind + three.js, deployed on Vercel.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Keeping Projects in sync with GitHub

The Projects grid reads live data from `app/api/github/route.ts`, which calls the
public GitHub API for `carami21` and caches the result for 30 minutes.

**Two ways a project gets on the site:**

1. **Add the `portfolio` topic to a public repo on GitHub.** It shows up as a card
   on its own within 30 minutes — name, description, language, stars and last-push
   date all come from GitHub. No code change, no deploy.
   (GitHub → repo → About ⚙️ → Topics → add `portfolio`.)

2. **Curated card in `components/Projects.tsx`.** Use this when the write-up should
   be better than the repo description, or when there is no public repo (Pool Map,
   Sustainalyze). Add `repo: 'carami21/<name>'` to a curated card and it picks up
   the live GitHub footer — last push, language, stars — while keeping the copy.

Private repos never appear. If the API is rate-limited or down, the curated cards
still render; only the live badges are skipped.

### Optional: GITHUB_TOKEN

Not required. With a read-only fine-grained token the rate limit goes from 60/hr
per IP to 5,000/hr. Set `GITHUB_TOKEN` in the Vercel project env (see
`.env.example`) — never commit a real `.env`.

### Resume

`public/resume.pdf` is the real file served by the Resume section. Replacing that
one file updates the download, the in-page reader, and the new-tab link.
`public/resume-front.jpg` is the preview image of page one — regenerate it when
the PDF changes:

```bash
sips -s format jpeg --resampleWidth 1313 <(pdftoppm -png -f 1 -l 1 public/resume.pdf) --out public/resume-front.jpg
```

(or just export page 1 from Preview at ~1300px wide).
