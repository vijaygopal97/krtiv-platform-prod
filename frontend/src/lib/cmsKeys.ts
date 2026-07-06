/**
 * Inline CMS key registry — wrap any UI copy with `<Editable cmsKey="…" defaultValue="…" />`.
 * Keys map to MongoDB `Content` documents (page.section.field).
 */
export const CMS_KEYS = {
  home: {
    hero: ['eyebrow', 'subtitle', 'highlight', 'primaryCta', 'secondaryCta'],
    intro: ['eyebrow', 'title', 'lede', 'stat1Value', 'stat1Label'],
  },
  contact: { main: ['eyebrow', 'title', 'lede', 'submitLabel'] },
  about: { main: ['eyebrow', 'title', 'lede'], beliefs: ['heading', 'p1', 'p2', 'p3'] },
  global: { footer: ['tagline', 'copyright', 'experiencesLabel', 'planLabel'] },
  nav: { main: ['contact'] },
} as const;

/** Pattern for destination pages: `places-to-go.{slug}.hero.title` */
export function placeCmsKey(slug: string, field: string) {
  return `places-to-go.${slug}.hero.${field}`;
}

/** Pattern for Things to Do categories: `category.{slug}.hero.title` */
export function categoryCmsKey(slug: string, field: string) {
  return `category.${slug}.hero.${field}`;
}
