# CLAUDE.md

Guidance for Claude Code and other AI assistants working in this repository.

## What this project is

TemplateGuards is a fallback structured-reporting tool for diagnostic radiology
residents. During PACS/RIS migrations (the original driver was PowerScribe 360 →
MosaicOS), native dictation templates are frequently restricted or unavailable,
and residents lose reporting speed and consistency mid-shift. TemplateGuards is
meant to restore a curated set of high-yield, ABR-aligned templates and
impression phrases with as little added friction as possible.

Author: Dr. Kavan R. Thompson, PGY-3 Diagnostic Radiology.
Live demo referenced by the README: https://template-guards.vercel.app
(deployed outside this repo — see "Deployment" below).

**Read this first: the repository is an early prototype, not a working
application.** Most files are placeholders. Do not assume anything builds, runs,
or is wired together. Details below.

## Actual repository state

```
.
├── CLAUDE.md                             # this file
├── README.md                             # current, accurate project summary
├── Files                                 # STALE ARTIFACT — see warning below
├── components/                           # React components (2 of 3 are stubs)
│   ├── DashboardPreview.tsx              # only real component (~36 lines)
│   ├── TemplateGuardUploader.tsx         # 2-line placeholder
│   └── TemplatePhraseConverter.tsx       # 2-line placeholder
├── public/                               # Chrome extension (MV3), incomplete
│   ├── manifest (2).json
│   ├── index (3).html                    # one-line popup stub
│   └── content (2).js                    # comment only, no code
└── supabase/
    └── schema.sql                        # 3 tables, no RLS
```

What is **not** here, and its absence is load-bearing for how you work:

- No `package.json`, lockfile, `node_modules`, or any declared dependency.
- No `tsconfig.json`, bundler config, Next.js config, or `pages/`/`app/` directory.
- No tests, no test runner, no linter, no formatter config.
- No `.github/` directory — no CI, no workflows, no PR template.
- No `.gitignore` and no `.env` / `.env.local` (the env vars below are documented
  but never read by any committed code).

**There is no build, test, lint, or dev command in this repository.** Do not
invent one and do not claim to have run one. If a task requires executing the
code, the first step is standing up a toolchain, which is a real decision — see
"Adding a toolchain" below.

## Known broken or misleading things

Treat these as facts about the repo, not as bugs to fix silently. Fix them only
when the task actually calls for it, and say what you changed.

1. **`Files` (repo root) is a stale concatenated dump.** It contains an older
   README plus verbatim copies of every source file, pasted end to end with no
   separators — including a stray `}` and mid-file `import` statements that make
   it look like broken source. It is not source, is not imported by anything,
   and has already drifted from the real files. Never edit `Files` to make a
   code change, and never read it as the source of truth. If you touch it at
   all, prefer deleting it over updating it.

2. **The `public/` filenames carry browser download suffixes** — `manifest
   (2).json`, `index (3).html`, `content (2).js` — from an "Add files via
   upload" commit. The manifest references `index.html`, `content.js`, and
   `background.js` by their clean names, so **the extension cannot load as-is**:
   Chrome will fail on the manifest filename alone, and every referenced path is
   wrong. `background.js` and `icon.png` do not exist at all. Renaming these is
   the correct fix whenever extension work is in scope.

3. **`DashboardPreview.tsx` has three unmet dependencies.** It imports
   `@/components/ui/card` and `@/components/ui/button` (shadcn/ui convention) —
   neither the components nor the `@/` path alias exist — and it fetches
   `/api/mock-usage`, which no route implements. The component renders its
   loading state forever. Its `usage` state is untyped (`useState(null)`), so it
   would not typecheck under `strict` without a type.

4. **`supabase/schema.sql` has no Row Level Security.** All three tables are
   created without RLS enabled and without policies, despite `template_metadata`
   and `profiles` keying on `auth.users(id)`. In a live Supabase project this
   means any authenticated user can read every other user's rows. `usage_log`
   does not even have a foreign key to `auth.users`. Also, `uuid_generate_v4()`
   requires the `uuid-ossp` extension, which the schema never enables. If you
   are asked to deploy or extend this schema, raise RLS explicitly rather than
   extending the current pattern.

## Data model

`supabase/schema.sql` defines three tables:

- **`template_metadata`** — one row per uploaded template. Carries `filename`,
  clinical taxonomy (`specialty`, `modality`, `region`, `protocol`), free-text
  `keywords`, a `tags text[]`, the generated `priming_phrase`, and
  `is_favorite`. This is the core table; new template features almost always
  extend it.
- **`profiles`** — per-user UI preferences (`show_history`, `show_favorites`),
  PK-shared with `auth.users(id)`.
- **`usage_log`** — append-only analytics events. `action` is an untyped `text`
  column; the deleted long-form README documented the intended vocabulary as
  `'copy' | 'favorite' | 'delete' | 'insert'`. Keep to those values unless
  deliberately extending the set.

The intended (documented, never implemented) Supabase setup also includes a
storage bucket named `templates` and email-based Supabase Auth.

## Intended architecture

The three surfaces the project is designed around — useful for placing new code,
but only the second exists in any form:

1. **Web app** — React/Next.js uploader, phrase converter, and analytics
   dashboard, deployed to Vercel. No Next.js scaffolding is committed; the
   `components/` files and the `@/` import alias assume it.
2. **Chrome extension (MV3)** — floating UI overlay injected into the PACS web
   client via a content script, so templates are reachable without leaving the
   dictation window. `public/` is the stub of this.
3. **Supabase backend** — Postgres for template metadata and usage, Storage for
   template files, Auth for per-user isolation.

## Deployment

Documented in the README, not automated anywhere in this repo:

- **Web:** connect the repo to Vercel; set `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`. No committed code reads these yet.
- **Extension:** `chrome://extensions` → Developer Mode → Load unpacked →
  `/public`. Blocked today by the filename issues in item 2 above.
- **Database:** paste `supabase/schema.sql` into the Supabase SQL editor.

There is no CI, so nothing validates a change before merge. Review your own diff
carefully; it is the only gate.

## Clinical and privacy conventions

This is a clinical tool built by a practising resident, and that constrains what
belongs in the repository.

- **Never commit real patient data.** No PHI, no MRNs, no accession numbers, no
  study dates tied to a patient, no verbatim text from a real dictated report.
  Template and example content must be synthetic or fully de-identified.
- **Do not commit institution-specific identifiers** — hospital site names,
  internal PACS hostnames, or credentials — even in examples or test fixtures.
- **Clinical content must be correct or clearly marked as a placeholder.**
  Templates and impression phrases are aimed at ABR-aligned reporting
  (Fleischner criteria for pulmonary nodules, LI-RADS, BI-RADS, stroke reporting
  with ASPECTS/mRS). Do not invent thresholds, staging categories, or numeric
  criteria from memory. If a real criterion is needed and you cannot verify it,
  leave a marked `TODO` and say so in your summary rather than guessing —
  plausible-but-wrong clinical guidance is the worst failure mode this project
  has.
- **Workflow non-interference is a product requirement, not a nicety.** The open
  issues state acceptance criteria of "loadable in <2 clicks" and "zero impact on
  basic dictation flow". A feature that adds friction to dictation has failed
  even if it works.

## Open work

Three open issues, all authored by the repo owner and labelled `enhancement`.
They are sequential — #4 explicitly builds on #2 and #3:

- **#2 — Multi-vendor PACS detection + high-yield fallback templates.** Detect
  PACS/RIS vendor or template restrictions; ship 3–5 core exam templates (chest,
  abdomen, MSK, neuro).
- **#3 — ABR Core phrasing integration.** Embed 5–10 reusable high-yield
  impression phrases per core domain; add an optional "ABR mode" toggle
  surfacing teaching points without interrupting dictation.
- **#4 — Ship core fallback set (Chest/Neuro/Abdomen) + ABR-mode toggle.** The
  current highest-leverage item: curate 5–8 on-call-ready templates, embed the
  ABR phrasing, add the toggle, document the on-call usage path, and provide a
  documented export path for sharing with co-residents.

Related repositories referenced by the README: `kavanthompson/ABR-Core-Mastery`
(private — a verified question bank and domain chapters, the intended source for
ABR phrasing) and `kavanthompson/radiology-ai-skills`. Neither is available in a
default session; use `add_repo` if a task genuinely needs one, and expect the
private one to require access.

## Working conventions

**Git.** The default branch is `main`. Work on the feature branch you were
assigned, commit with clear messages, and push with `git push -u origin
<branch>`. Open a draft PR after pushing if one is not already open. The commit
history is short and mostly documentation; follow the existing
`type: summary` style (`docs: ...`) where it fits.

**Style.** There is no linter or formatter, so match the surrounding code: React
function components with a default export, 2-space indentation, single quotes,
semicolons, Tailwind utility classes for layout. `DashboardPreview.tsx` is the
only meaningful style reference.

**Scope.** The repo is small enough to read end to end — do that before changing
anything, rather than pattern-matching from one file. Prefer replacing the
placeholder stubs with real implementations over adding parallel new files.

**Honesty about verification.** With no tests and no build, you cannot verify
runtime behaviour here. Say plainly what you did and did not check; do not
describe untested code as working.

### Adding a toolchain

Several plausible tasks (implementing the uploader, making the dashboard render,
making the extension loadable) require build tooling that does not exist. That is
a genuine architectural decision, not a mechanical prerequisite. The README and
the existing `@/` alias point at Next.js + Tailwind + shadcn/ui on Vercel, so
that is the default to propose. Confirm with the user before scaffolding
`package.json`, a framework, or a dependency tree — and if you do scaffold, add
a `.gitignore` in the same change, since the repo currently has none and would
otherwise track `node_modules`.
