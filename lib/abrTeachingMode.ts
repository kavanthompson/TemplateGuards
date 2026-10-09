/**
 * ABR teaching mode for TemplateGuards.
 * Pearls live after a `---` separator and a line starting with **ABR Pearl.
 * Dictation copy should omit the pearl when teaching mode is off so the
 * report body stays clean. Dashboard toggle defaults ON for passive exposure.
 */

const PEARL_SPLIT = /\n---\n\*\*ABR Pearl/i;

export function splitTemplate(markdown: string): { body: string; pearl: string | null } {
  const match = markdown.split(PEARL_SPLIT);
  if (match.length < 2) return { body: markdown.trim(), pearl: null };
  const pearl = markdown.slice(markdown.length - match[1].length).replace(/^\s*/, "").trim();
  return { body: match[0].trim(), pearl: pearl || null };
}

export function templateForCopy(markdown: string, abrMode: boolean): string {
  const { body, pearl } = splitTemplate(markdown);
  if (!abrMode || !pearl) return body;
  return `${body}\n\n---\n**ABR Pearl (study only, do not dictate):** ${pearl}`;
}
