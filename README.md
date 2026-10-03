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
| C-Spine XR (trauma) | `templates/cspine-xr.md` | NEXUS / Canadian C-spine + instability signs |
| Non-contrast Abdomen XR | `templates/abdomen-xr.md` | Free air / SBO secondary signs |
| Soft-tissue US | `templates/soft-tissue-us.md` | Abscess vs cellulitis / pseudoaneurysm |
| Trauma series XR | `templates/trauma-series-xr.md` | Deep sulcus PTX, pelvic ring, inadequate C-spine |

Copy-paste into any dictation system. Optional ABR teaching line at bottom (toggle-ready for future UI).

## Current status
Early prototype (TypeScript). Dashboard preview, template uploader, phrase converter, and Supabase schema in place. **9 high-volume on-call templates** now live.

Open issues:
- #30 Closed 2026-10-03: soft-tissue US and trauma-series XR both shipped.

## Roadmap (clinical + ABR compound)
1. ✅ Curate first 3 on-call ready templates (Chest XR, Neuro CT, Abdomen CT).
2. ✅ Add MSK XR + PE CTA (next highest call volume).
3. ✅ Add C-spine XR + Non-contrast Abdomen XR (trauma / obstruction volume).
4. ✅ Add soft-tissue US (ED cellulitis vs abscess).
5. ✅ Add portable trauma-series XR (chest + pelvis + C-spine).
6. Embed more high-yield impression phrases from ABR-Core-Mastery.
7. Optional “ABR teaching mode” that surfaces 1-line pearls without interrupting dictation.
8. Tight linkage with ResidentShield ambient AI teaching and radiology-ai-skills collection.

## Related repos
- [ABR-Core-Mastery](https://github.com/kavanthompson/ABR-Core-Mastery) (private) – verified question bank + domain chapters
- [radiology-ai-skills](https://github.com/kavanthompson/radiology-ai-skills) – curated agent skills for residents

## Contributing
Open an issue with any on-call friction you hit. This tool is built for real resident workflow, not demos.
