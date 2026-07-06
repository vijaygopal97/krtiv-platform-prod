/** Wikimedia Commons thumbnail URLs (CC-licensed). */
export function wikimediaThumbUrls(thumbPath: string, thumbSmall = 320) {
  const full = `https://upload.wikimedia.org/wikipedia/commons/${thumbPath}`;
  const thumb = full.replace(/\/\d+px-/, `/${thumbSmall}px-`);
  return { full, thumb };
}
