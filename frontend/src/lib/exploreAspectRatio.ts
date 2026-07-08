/** Stable portrait-heavy height estimates — Pinterest-style mix before images load. */

const PORTRAIT = [1.28, 1.38, 1.48, 1.58, 1.68, 1.78, 1.88, 2.0, 2.15];
const LANDSCAPE = [0.62, 0.7, 0.76, 0.82, 0.9];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/** Height for a column cell width (ratio = height / width). ~72% portrait. */
export function estimatedCellHeight(id: string, columnWidth: number): number {
  const h = hashId(id);
  const portrait = h % 10 < 7;
  const ratio = portrait ? PORTRAIT[h % PORTRAIT.length] : LANDSCAPE[h % LANDSCAPE.length];
  return Math.round(columnWidth * ratio);
}

export function heightFromNaturalSize(naturalW: number, naturalH: number, columnWidth: number): number {
  if (!naturalW || !naturalH) return columnWidth * 1.4;
  return Math.round(columnWidth * (naturalH / naturalW));
}
