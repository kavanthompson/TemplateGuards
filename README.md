# TemplateGuards

**PACS template fallback tool for seamless structured reporting during system transitions.**

Built by Dr. Kavan R. Thompson, PGY-3 Diagnostic Radiology.

[Live Demo](https://template-guards.vercel.app)

## Why it exists
During PACS/RIS transitions (common across multi-site systems), native templates are often restricted or unavailable. Residents lose structured reporting speed and consistency. TemplateGuards restores high-yield, ABR-aligned templates with zero extra friction.

## Current status
Early prototype (TypeScript). Dashboard preview, template uploader, phrase converter, and Supabase schema in place. Open issues focus on core clinical value:

- #2 Multi-vendor PACS detection + high-yield fallback templates
- #3 ABR Core phrasing integration (Fleischner, LI-RADS, BI-RADS, stroke)
- #4 Ship core fallback set (Chest / Neuro / Abdomen) + ABR-mode toggle

## Roadmap (clinical + ABR compound)
1. Curate 5–8 on-call ready templates (Chest XR/CT, Neuro CT/MRI, Abdomen CT).
2. Embed high-yield impression phrases from ABR-Core-Mastery.
3. Optional “ABR teaching mode” that surfaces 1-line pearls without interrupting dictation.
4. Tight linkage with ResidentShield ambient AI teaching and radiology-ai-skills collection.

## Related repos
- [ABR-Core-Mastery](https://github.com/kavanthompson/ABR-Core-Mastery) (private) – verified question bank + domain chapters
- [radiology-ai-skills](https://github.com/kavanthompson/radiology-ai-skills) – curated agent skills for residents

## Contributing
Open an issue with any on-call friction you hit. This tool is built for real resident workflow, not demos.
