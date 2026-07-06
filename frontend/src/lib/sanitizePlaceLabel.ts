/** Strip database row IDs / numeric prefixes from place names (e.g. "18 Tarkarli" → "Tarkarli"). */
export function sanitizePlaceLabel(label: string): string {
  if (!label || typeof label !== 'string') return '';
  let s = label.trim();
  s = s.replace(/^\d+[\s.\-_:,)]+/, '');
  s = s.replace(/^#\d+\s*/, '');
  return s.trim();
}
