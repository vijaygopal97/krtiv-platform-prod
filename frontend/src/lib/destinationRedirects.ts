/** Legacy place slugs → canonical PLACES_NAV slug */
export const DESTINATION_SLUG_REDIRECTS: Record<string, string> = {
  aurangabad: 'ajanta-ellora',
  ajanta: 'ajanta-ellora',
  ellora: 'ajanta-ellora',
  tadoba: 'chandrapur',
};

export function resolveDestinationSlug(slug: string): string {
  return DESTINATION_SLUG_REDIRECTS[slug] ?? slug;
}
