/** Primary nav labels and routes. */

export const THINGS_TO_DO_LABEL = 'Things to Do';
export const PLACES_TO_GO_LABEL = 'Places to Go';

export const THINGS_TO_DO_HREF = '/explore#explore-by-categories';

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

export function destinationPath(slug: string) {
  return `/places-to-go/${slug}`;
}

export function isActiveNavPath(pathname: string, href: string) {
  const path = href.split('#')[0];
  if (path === '/explore') return pathname === '/explore';
  if (path === '/places-to-go') return pathname === '/places-to-go' || pathname.startsWith('/places-to-go/');
  return pathname === path || pathname.startsWith(`${path}/`);
}
