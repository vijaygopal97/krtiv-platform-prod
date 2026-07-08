/** Strip database row IDs / numeric prefixes from place names (e.g. "18 Tarkarli" → "Tarkarli"). */
export function sanitizePlaceLabel(label: string): string {
  if (!label || typeof label !== 'string') return '';
  let s = label.trim();
  s = s.replace(/^\d+[\s.\-_:,)]+/, '');
  s = s.replace(/^#\d+\s*/, '');
  // Official city rename — never surface the obsolete name in the UI
  s = s.replace(/\bAurangabad\b/gi, 'Chhatrapati Sambhajinagar');
  return s.trim();
}

/** Rename Aurangabad → Chhatrapati Sambhajinagar anywhere in itinerary text. */
export function renameObsoletePlaceNames(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/\bAurangabad\b/gi, 'Chhatrapati Sambhajinagar');
}
