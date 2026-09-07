# TemplateGuards

**PACS template fallback tool for seamless structured reporting during system transitions.**

Built by Dr. Kavan R. Thompson, PGY-3 Diagnostic Radiology.

[Live Demo](https://template-guards.vercel.app)

## Why it exists
During PACS/RIS transitions (common across multi-site systems), native templates are often restricted or unavailable. Residents lose structured reporting speed and consistency. TemplateGuards restores high-yield, ABR-aligned templates with zero extra friction.

## Quick Start – On-Call Fallback Templates
Ready-to-copy templates in `/templates/`:

| Template | Path | ABR Pearl embedded |
|----------|------|--------------------|
| Chest XR | `templates/chest-xr.md` | Fleischner nodule follow-up |
| Head CT / Stroke | `templates/head-ct-stroke.md` | ASPECTS / early ischemic signs |
| Abdomen/Pelvis CT | `templates/abdomen-ct.md` | Appendicitis secondary signs |
| MSK XR (ankle/knee/wrist) | `templates/msk-xr.md` | Bone tumor matrix |
| PE CTA | `templates/pe-cta.md` | RV strain signs |

Copy-paste into any dictation system. Optional ABR teaching line at bottom (toggle-ready for future UI).

## Current status
Early prototype (TypeScript). Dashboard preview, template uploader, phrase converter, and Supabase schema in place. Core clinical templates now live (5 high-volume on-call sets).

Open issues:
- #2 Multi-vendor PACS detection + expanded fallback templates
- #3 Full ABR Core phrasing integration (Fleischner, LI-RADS, BI-RADS, stroke)
- #4 Ship remaining core set + ABR-mode UI toggle
- #7 Expand on-call templates (MSK + PE) ← **shipped today**

## Roadmap (clinical + ABR compound)
1. ✅ Curate first 3 on-call ready templates (Chest XR, Neuro CT, Abdomen CT).
2. ✅ Add MSK XR + PE CTA (next highest call volume).
3. Embed more high-yield impression phrases from ABR-Core-Mastery.
4. Optional “ABR teaching mode” that surfaces 1-line pearls without interrupting dictation.
5. Tight linkage with ResidentShield ambient AI teaching and radiology-ai-skills collection.

## Related repos
- [ABR-Core-Mastery](https://github.com/kavanthompson/ABR-Core-Mastery) (private) – verified question bank + domain chapters
- [radiology-ai-skills](https://github.com/kavanthompson/radiology-ai-skills) – curated agent skills for residents

## Contributing
Open an issue with any on-call friction you hit. This tool is built for real resident workflow, not demos.
