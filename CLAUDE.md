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
application.** The shipped, usable deliverable is the Markdown template corpus in
`templates/` — copy-paste text, no code required. Everything else (components,
extension, schema) is placeholder or unwired. Do not assume anything builds,
runs, or is wired together. Details below.

## Actual repository state

```
.
├── CLAUDE.md                             # this file
├── README.md                             # current, accurate project summary
├── Files                                 # STALE ARTIFACT — see warning below
├── templates/                            # THE WORKING DELIVERABLE — 7 Markdown templates
│   ├── chest-xr.md                       # Fleischner nodule pearl
│   ├── head-ct-stroke.md                 # ASPECTS / early ischemic signs pearl
│   ├── abdomen-ct.md                     # appendicitis secondary signs pearl
│   ├── msk-xr.md                         # bone tumor matrix pearl
│   ├── pe-cta.md                         # RV strain pearl
│   ├── cspine-xr.md                      # NEXUS / Canadian C-spine + instability pearl
│   └── abdomen-xr.md                     # free air / SBO secondary signs pearl
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

## Template corpus (`templates/`)

Seven on-call templates, all linked from the README's Quick Start table:
`chest-xr`, `head-ct-stroke`, `abdomen-ct`, `msk-xr`, `pe-cta`, `cspine-xr`,
`abdomen-xr`. The first five shipped via issues #6 and #7; `cspine-xr` and
`abdomen-xr` were added later by the daily-automation line (see "Open work").
They are plain Markdown, meant to be copy-pasted into any dictation system —
nothing reads them programmatically yet.

Every file follows the same shape, and a new template should match it exactly
rather than inventing a layout:

```
# <Exam> Fallback Template

**Indication:** [ ]            # bracketed slots are operator fill-ins
**Technique:** ...
**Comparison:** [prior / none]

**Findings:**
- <organ system>: <normal-template sentence>

**Impression:**
1. <negative-study impression>

---
**ABR Pearl (toggle):** <one line>
```

Conventions worth preserving:

- **Findings are written as the normal study**, one bullet per organ system, so
  the resident deletes or edits rather than types from scratch. Impressions are
  numbered and default to the negative read.
- **Square brackets mark operator fill-ins** (`[prior / none]`,
  `[stroke code / headache / trauma]`). Keep them; they are the friction budget.
- **Exactly one `ABR Pearl (toggle):` line per file**, last, under a `---` rule.
  The "(toggle)" marker is the seam for the not-yet-built ABR-mode UI — the
  pearl must be separable from the dictated text by that line alone, so never
  interleave teaching content into Findings or Impression.
- Four templates carry an extra block between Findings and Impression: a
  checklist (`msk-xr`, `cspine-xr` "Trauma Checklist", `abdomen-xr` "Secondary
  Signs Checklist") or a clinical-cue block (`pe-cta`). That is an accepted
  variation, not the default, and it still sits above the `---` pearl rule.
- Filenames are lower-kebab-case by exam, and the README's Quick Start table must
  be updated in the same change as any added or renamed template.

The clinical rules in "Clinical and privacy conventions" below apply in full to
anything written here — a pearl is the highest-risk line in the repository.

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
storage bucket named `templates` and email-based Supabase Auth. Note the name
collision: that bucket is for user-uploaded template files and has nothing to do
with the committed `templates/` Markdown corpus. No committed code connects the
two, and nothing populates `template_metadata` from `templates/`.

## Intended architecture

The three surfaces the project is designed around — useful for placing new code,
but only the second exists in any form. The `templates/` corpus sits outside all
three by design: it is the manual fallback that works with no surface at all,
which is why it shipped first.

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
  has. The seven shipped pearls in `templates/` are the format to follow, not a
  licence to add unsourced ones: if you write or edit a pearl, be able to name
  the guideline it comes from, and say in your summary that you did not
  independently verify it if you did not.
- **Workflow non-interference is a product requirement, not a nicety.** The open
  issues state acceptance criteria of "loadable in <2 clicks" and "zero impact on
  basic dictation flow". A feature that adds friction to dictation has failed
  even if it works.

## Open work

All issues are authored by the repo owner and labelled `enhancement`. Almost
everything is closed: the template-curation line (**#2, #4, #6, #7**) and the
ABR Core phrasing issue (**#3**, which shipped as the trailing pearl line now
present in every template).

- **The "Daily automation" run (#8 onward).** A long series of near-duplicate
  issues opened one per day by an automation. Each restates a status digest and
  proposes the same next step; older ones get closed as newer ones appear, so at
  any moment typically only the latest is open. Treat the whole run as one item.
  **Do not open another**, and do not work them individually — read the newest
  for current status and act on the single ask behind all of them.

So there is effectively **one open piece of work: the ABR-mode toggle** — make
the trailing pearl line optional during dictation. It needs a UI surface to live
in, and no surface currently runs (see "Adding a toolchain"); the latest
automation issue names `DashboardPreview.tsx` as the intended home, which is
itself unwired (see "Known broken or misleading things", item 3). The
`templates/` corpus already marks the seam it would toggle: the trailing
`**ABR Pearl (toggle):**` line in each file.

The automation issues also carry a recurring secondary ask — cross-linking the
pearls into `radiology-ai-skills` — which involves a repo outside this one.

Related repositories referenced by the README: `kavanthompson/ABR-Core-Mastery`
(private — a verified question bank and domain chapters, the intended source for
ABR phrasing) and `kavanthompson/radiology-ai-skills`. Neither is available in a
default session; use `add_repo` if a task genuinely needs one, and expect the
private one to require access.

## Working conventions

**Git.** The default branch is `main`. Work on the feature branch you were
assigned, commit with clear messages, and push with `git push -u origin
<branch>`. Open a draft PR after pushing if one is not already open. The commit
history is short — documentation plus the template drops; messages mostly follow
`type: summary` (`docs: ...`) or a plain imperative summary naming the issue it
advances (`Add PE CTA fallback template ... (issue #7)`). Either fits.

**Style.** There is no linter or formatter, so match the surrounding code: React
function components with a default export, 2-space indentation, single quotes,
semicolons, Tailwind utility classes for layout. `DashboardPreview.tsx` is the
only meaningful style reference for code; for template Markdown, copy the shape
of an existing file in `templates/` exactly (see "Template corpus" above).

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
