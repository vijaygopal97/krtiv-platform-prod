/** Primary nav labels and routes. */

export const THINGS_TO_DO_LABEL = 'Things to Do';
export const CURATED_ITINERARIES_LABEL = 'Curated Itineraries';
/** @deprecated Use CURATED_ITINERARIES_LABEL — kept for existing imports */
export const PLACES_TO_GO_LABEL = CURATED_ITINERARIES_LABEL;

export const THINGS_TO_DO_HREF = '/things-to-do#explore-by-categories';
export const EXPLORE_PHOTOS_LABEL = 'Explore';
export const EXPLORE_PHOTOS_HREF = '/explore';
export const CURATED_ITINERARIES_HREF = '/places-to-go';

/** Home + header — AI trip planner (no login). */
export const PLAN_WITH_AI_HREF = '/#floating-interest-bubbles';

/** Matches fixed SiteHeader — prefer --site-header-height (set by SiteHeader). */
export const SITE_HEADER_OFFSET_CLASS = 'page-below-header';

export type CircuitNavItem = {
  slug: string;
  label: string;
  href: string;
};

export const CIRCUIT_NAV: CircuitNavItem[] = [
  { slug: 'historical', label: 'Historical & Heritage', href: '/category/historical' },
  { slug: 'spiritual', label: 'Spiritual & Pilgrimage', href: '/category/spiritual' },
  { slug: 'adventure', label: 'Adventure & Ecotourism', href: '/category/adventure' },
  { slug: 'culinary', label: 'Culinary & Rural', href: '/category/culinary' },
  { slug: 'art-culture', label: 'Art, Craft & Culture', href: '/category/art-culture' },
  { slug: 'urban', label: 'Urban & Contemporary', href: '/category/urban' },
  { slug: 'weddings', label: 'Weddings', href: '/category/weddings' },
];

export type PlaceNavItem = {
  slug: string;
  label: string;
  href: string;
};

/** SEO-friendly destination URLs — extend this list to add destinations. */
export const PLACES_NAV: PlaceNavItem[] = [
  { slug: 'mumbai', label: 'Mumbai', href: '/places-to-go/mumbai' },
  { slug: 'pune', label: 'Pune', href: '/places-to-go/pune' },
  { slug: 'nashik', label: 'Nashik', href: '/places-to-go/nashik' },
  { slug: 'ajanta-ellora', label: 'Ajanta & Ellora', href: '/places-to-go/ajanta-ellora' },
  { slug: 'shirdi', label: 'Shirdi', href: '/places-to-go/shirdi' },
  { slug: 'mahabaleshwar', label: 'Mahabaleshwar', href: '/places-to-go/mahabaleshwar' },
  { slug: 'lonavala', label: 'Lonavala', href: '/places-to-go/lonavala' },
  { slug: 'alibaug', label: 'Alibaug', href: '/places-to-go/alibaug' },
  { slug: 'kolhapur', label: 'Kolhapur', href: '/places-to-go/kolhapur' },
  { slug: 'nagpur', label: 'Nagpur', href: '/places-to-go/nagpur' },
  { slug: 'sindhudurg', label: 'Sindhudurg', href: '/places-to-go/sindhudurg' },
  { slug: 'chandrapur', label: 'Chandrapur', href: '/places-to-go/chandrapur' },
];

export type CuratedNavChild = {
  label: string;
  href: string;
  /** Short UNESCO / trail context shown in nested menus */
  detail?: string;
};

export type CuratedNavItem = {
  slug: string;
  label: string;
  href: string;
  /** UNESCO — verified destination pages only */
  children?: CuratedNavChild[];
};

/**
 * Curated Itineraries header menu.
 * UNESCO children are limited to Places-to-Go destinations that are UNESCO-listed in Maharashtra.
 */
export const CURATED_NAV: CuratedNavItem[] = [
  {
    slug: 'unesco',
    label: 'UNESCO World Heritage Sites',
    href: '/curated-itineraries/unesco',
    children: [
      { label: 'Ajanta Caves', href: '/curated-itineraries/unesco/ajanta-caves', detail: 'Buddhist rock-cut art · 1983' },
      { label: 'Ellora Caves', href: '/curated-itineraries/unesco/ellora-caves', detail: 'Kailasa temple · 1983' },
      { label: 'Elephanta Caves', href: '/curated-itineraries/unesco/elephanta-caves', detail: 'Shaivite island caves · 1987' },
      { label: 'CSMT', href: '/curated-itineraries/unesco/csmt', detail: 'Victorian Gothic terminus · 2004' },
      { label: 'Western Ghats', href: '/curated-itineraries/unesco/western-ghats', detail: 'Sahyadri biodiversity · 2012' },
      { label: 'Art Deco Mumbai', href: '/curated-itineraries/unesco/art-deco-mumbai', detail: 'Victorian & Art Deco ensembles · 2018' },
      {
        label: 'Maratha Fort Landscapes',
        href: '/curated-itineraries/unesco/maratha-military-landscapes',
        detail: 'Hill-fort serial site · 2024',
      },
    ],
  },
  {
    slug: 'seven-wonders',
    label: 'Timeless Icons of Maharashtra',
    href: '/curated-itineraries/seven-wonders',
    children: [
      { label: 'Daulatabad Fort', href: '/curated-itineraries/seven-wonders/daulatabad-fort', detail: 'Deccan citadel' },
      { label: 'Gateway of India', href: '/curated-itineraries/seven-wonders/gateway-of-india', detail: 'Harbour monument' },
      { label: 'Global Vipassana Pagoda', href: '/curated-itineraries/seven-wonders/global-vipassana-pagoda', detail: 'Stone meditation dome' },
      { label: 'Harihar Fort', href: '/curated-itineraries/seven-wonders/harihar-fort', detail: 'Sahyadri ladder trek' },
      { label: 'Kaas Plateau', href: '/curated-itineraries/seven-wonders/kas-plateau', detail: 'Valley of flowers' },
      { label: 'Lonar Crater', href: '/curated-itineraries/seven-wonders/lonar-crater', detail: 'Meteorite impact lake' },
      { label: 'Raigad Fort', href: '/curated-itineraries/seven-wonders/raigad-fort', detail: 'Maratha capital' },
      { label: 'Sandhan Valley', href: '/curated-itineraries/seven-wonders/sandhan-valley', detail: 'Valley of Shadows' },
      { label: 'Shaniwar Wada', href: '/curated-itineraries/seven-wonders/shaniwar-wada', detail: 'Peshwa seat · Pune' },
    ],
  },
  {
    slug: 'weekend-getaways',
    label: 'Weekend Getaways',
    href: '/curated-itineraries/weekend-getaways',
    children: [
      { label: 'Mumbai', href: '/curated-itineraries/weekend-getaways/mumbai', detail: 'City break · sea & street life' },
      { label: 'Pune', href: '/curated-itineraries/weekend-getaways/pune', detail: 'Culture & Sahyadri gateway' },
      { label: 'Nashik', href: '/curated-itineraries/weekend-getaways/nashik', detail: 'Wine country & ghats' },
      { label: 'Shirdi', href: '/curated-itineraries/weekend-getaways/shirdi', detail: 'Pilgrimage retreat' },
      { label: 'Mahabaleshwar', href: '/curated-itineraries/weekend-getaways/mahabaleshwar', detail: 'Hill station & strawberries' },
      { label: 'Lonavala', href: '/curated-itineraries/weekend-getaways/lonavala', detail: 'Mist & monsoon waterfalls' },
      { label: 'Alibaug', href: '/curated-itineraries/weekend-getaways/alibaug', detail: 'Coastal ferry weekends' },
      { label: 'Kolhapur', href: '/curated-itineraries/weekend-getaways/kolhapur', detail: 'Temples & Kolhapuri spice' },
      { label: 'Nagpur', href: '/curated-itineraries/weekend-getaways/nagpur', detail: 'Orange city hub' },
      { label: 'Sindhudurg', href: '/curated-itineraries/weekend-getaways/sindhudurg', detail: 'Konkan beaches & forts' },
    ],
  },
  {
    slug: 'wine-trail',
    label: 'Wine Trail',
    href: '/curated-itineraries/wine-trail',
    children: [
      { label: 'Boutique Vineyards', href: '/curated-itineraries/wine-trail/boutique-vineyards', detail: 'Estate stays & small lots' },
      { label: 'Konkan Heritage Brews', href: '/curated-itineraries/wine-trail/konkan-heritage-brews', detail: 'Coastal feni & stills' },
      { label: 'Nashik', href: '/curated-itineraries/wine-trail/nashik', detail: 'Godavari wine country' },
      { label: 'Pune', href: '/curated-itineraries/wine-trail/pune', detail: 'Urban cellar circuit' },
    ],
  },
  {
    slug: 'nature-trails',
    label: 'Nature Trails',
    href: '/curated-itineraries/nature-trails',
    children: [
      { label: 'Tadoba Tiger Reserve', href: '/curated-itineraries/nature-trails/tadoba-tiger-reserve', detail: 'Wildlife safari' },
      { label: 'Bhandardara Fireflies', href: '/curated-itineraries/nature-trails/bhandardara-fireflies', detail: 'Night forest walk' },
      { label: 'Flamingo Watching', href: '/curated-itineraries/nature-trails/flamingo-watching', detail: 'Wetland birding' },
      { label: 'Navegaon National Park', href: '/curated-itineraries/nature-trails/navegaon-national-park', detail: 'Forest & lake' },
      { label: 'Karnala Bird Sanctuary', href: '/curated-itineraries/nature-trails/karnala-bird-sanctuary', detail: 'Bird sanctuary' },
      { label: 'Thoseghar Waterfalls', href: '/curated-itineraries/nature-trails/thoseghar-waterfalls', detail: 'Waterfall viewpoints' },
    ],
  },
  {
    slug: 'monsoon-trails',
    label: 'Monsoon Trails',
    href: '/curated-itineraries/monsoon-trails',
    children: [
      { label: 'Must-Visit Waterfalls', href: '/curated-itineraries/monsoon-trails/must-visit-waterfalls', detail: 'Monsoon cascades' },
      { label: 'Scenic Monsoon Drives', href: '/curated-itineraries/monsoon-trails/scenic-monsoon-drives', detail: 'Ghat road trips' },
      { label: 'Historic Forts in Mist', href: '/curated-itineraries/monsoon-trails/historic-forts-in-mist', detail: 'Fort treks' },
      { label: 'Walk Through the Clouds', href: '/curated-itineraries/monsoon-trails/walk-through-clouds', detail: 'Hill stations & ghats' },
      { label: 'One-Day Treks Near Mumbai', href: '/curated-itineraries/monsoon-trails/one-day-treks-near-mumbai', detail: 'Day hikes' },
    ],
  },
];

export function destinationPath(slug: string) {
  return `/places-to-go/${slug}`;
}

export function isActiveNavPath(pathname: string, href: string) {
  const path = href.split('#')[0];
  if (path === '/explore') return pathname === '/explore';
  if (path === '/things-to-do') return pathname === '/things-to-do';
  if (path === '/places-to-go') return pathname === '/places-to-go' || pathname.startsWith('/places-to-go/');
  if (path.startsWith('/curated-itineraries')) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

/** Shared link lists for header and footer menus. */
export function getThingsNavLinks() {
  return CIRCUIT_NAV.map((c) => ({ label: c.label, href: c.href }));
}

export function getPlacesNavLinks() {
  return PLACES_NAV.map((p) => ({ label: p.label, href: p.href }));
}

/** Flat list of all curated links (for active-state checks). */
export function getAllCuratedHrefs(): string[] {
  const hrefs: string[] = [CURATED_ITINERARIES_HREF];
  for (const item of CURATED_NAV) {
    hrefs.push(item.href);
    for (const child of item.children ?? []) {
      hrefs.push(child.href);
    }
  }
  return hrefs;
}

export function isCuratedSectionActive(pathname: string) {
  return getAllCuratedHrefs().some((href) => isActiveNavPath(pathname, href));
}
