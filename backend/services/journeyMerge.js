/** Apply inline CMS overrides (Content collection) onto a journey document. */
export function applyJourneyContentOverrides(journey, contentRows) {
  if (!journey) return journey;
  const doc = journey.toObject ? journey.toObject() : { ...journey };
  const prefix = `journey.${doc.slug}.`;
  for (const row of contentRows) {
    const key = row.cmsKey || row.key;
    if (!key?.startsWith(prefix)) continue;
    const path = key.slice(prefix.length);
    setByPath(doc, path, row.value);
  }
  return doc;
}

function setByPath(obj, path, value) {
  if (!path) return;
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
    cur = cur[p];
  }
  const last = parts[parts.length - 1];
  if (value === '' || value == null) return;
  if (last === 'gallery' || last === 'localFood' || last === 'travelTips') {
    try {
      cur[last] = JSON.parse(value);
    } catch {
      cur[last] = value.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    return;
  }
  if (last === 'highlights' || last === 'experiences' || last === 'itinerary' || last === 'nearby') {
    try {
      cur[last] = JSON.parse(value);
    } catch {
      /* keep existing */
    }
    return;
  }
  if (last === 'travelInfo' || last === 'map' || last === 'seo') {
    try {
      cur[last] = { ...(cur[last] || {}), ...JSON.parse(value) };
    } catch {
      cur[last] = value;
    }
    return;
  }
  cur[last] = value;
}

export function journeyCardFromDoc(doc) {
  return {
    slug: doc.slug,
    title: doc.title,
    region: doc.region,
    image: doc.heroImage,
    blurb: doc.blurb,
    cardLayout: doc.cardLayout,
    sortOrder: doc.sortOrder,
  };
}
