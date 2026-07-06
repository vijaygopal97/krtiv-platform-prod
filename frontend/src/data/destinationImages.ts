import type { DestinationGalleryImage } from '@/lib/destinationGalleryTypes';

/** Royalty-free Unsplash CDN URLs — unique photo id per entry (no reuse across slugs). */
function unsplash(photoId: string, fullW = 1600, thumbW = 400) {
  const q = 'auto=format&fit=crop';
  return {
    full: `https://images.unsplash.com/${photoId}?${q}&w=${fullW}&q=80`,
    thumb: `https://images.unsplash.com/${photoId}?${q}&w=${thumbW}&q=65`,
  };
}

function buildGallery(slug: string, photoIds: string[], alts: string[]): DestinationGalleryImage[] {
  const count = Math.min(photoIds.length, alts.length, 12);
  const out: DestinationGalleryImage[] = [];
  for (let i = 0; i < count; i++) {
    const urls = unsplash(photoIds[i]!);
    out.push({
      id: `${slug}-${i + 1}`,
      alt: alts[i]!,
      full: urls.full,
      thumb: urls.thumb,
      credit: 'Unsplash',
    });
  }
  return out;
}

/** Per-destination search queries for Unsplash → Pexels → Pixabay. */
export const DESTINATION_SEARCH_KEYWORDS: Record<string, string> = {
  mumbai: 'Mumbai Gateway of India Marine Drive',
  pune: 'Pune Shaniwar Wada Aga Khan Palace',
  nashik: 'Nashik Trimbakeshwar Sula Vineyards',
  'ajanta-ellora': 'Ajanta Caves Ellora Caves Kailasa Temple',
  shirdi: 'Shirdi Sai Baba Temple',
  mahabaleshwar: 'Mahabaleshwar Venna Lake Arthur Seat',
  lonavala: 'Lonavala Bhushi Dam Tiger Point',
  alibaug: 'Alibaug Beach Kolaba Fort',
  kolhapur: 'Kolhapur Mahalaxmi Temple Rankala Lake',
  nagpur: 'Nagpur Deekshabhoomi Futala Lake',
  sindhudurg: 'Sindhudurg Fort Tarkarli Beach',
  chandrapur: 'Chandrapur Tadoba National Park',
};

const GALLERY_CONFIG: Record<string, { photos: string[]; alts: string[] }> = {
  mumbai: {
    photos: [
      'photo-1564507592333-c60657eea523',
      'photo-1578662996442-48f60103fc96',
      'photo-1517154420450-3513ef46b458',
      'photo-1596176530529-960f48cb8b8b',
      'photo-1621883669468-35a265976969',
      'photo-1582139329536-7b1c4a4d5b6a',
      'photo-1609137144814-b2a7b6f3a2b1',
      'photo-1565008576549-75c59c8e5e62',
      'photo-1528181304800-259b08848561',
      'photo-1555884996-efc8c945d225',
    ],
    alts: [
      'Gateway of India, Mumbai',
      'Marine Drive, Mumbai',
      'Chhatrapati Shivaji Maharaj Terminus, Mumbai',
      'Bandra-Worli Sea Link, Mumbai',
      'Colaba, Mumbai',
      'Elephanta Caves, Mumbai',
      'Juhu Beach, Mumbai',
      'Mumbai skyline',
      'Mumbai harbour',
      'Street life in Mumbai',
    ],
  },
  pune: {
    photos: [
      'photo-1587474260584-136574528ed5',
      'photo-1524492412937-280ceb786cbf',
      'photo-1565182999561-98d742b5a8d0',
      'photo-1469854523086-cc02fe5d8800',
      'photo-1606491956689-2ea8668f67e2',
      'photo-1551632431-ff8a001e5892',
      'photo-1533174072545-7a4b6d7f03cc',
      'photo-1526483360412-daa3289b109b',
      'photo-1501785888041-af3ef285b470',
      'photo-1470071459604-3b5ec3a7fe05',
    ],
    alts: [
      'Shaniwar Wada, Pune',
      'Aga Khan Palace, Pune',
      'Sinhagad Fort near Pune',
      'Pataleshwar Cave Temple, Pune',
      'FC Road, Pune',
      'Raja Dinkar Kelkar Museum, Pune',
      'Saras Baug, Pune',
      'Pune cityscape',
      'Western Ghats near Pune',
      'Pune heritage architecture',
    ],
  },
  nashik: {
    photos: [
      'photo-1588668216262-cb87604c3745',
      'photo-1506377247727-2aad5c4e4b0a',
      'photo-1510812431401-41d2bd2722f3',
      'photo-1565193566173-7a0ee3dbe261',
      'photo-1618005182384-a83a8bd57fbe',
      'photo-1439069578443-ffad93f2fe20',
      'photo-1506905925346-21bda4d32df4',
      'photo-1469474968028-56623f02e42e',
      'photo-1548013146-72479768bada',
      'photo-1585937421612-70a008356fbe',
    ],
    alts: [
      'Trimbakeshwar Temple, Nashik',
      'Sula Vineyards, Nashik',
      'Panchavati, Nashik',
      'Godavari Ghat, Nashik',
      'Coin Museum, Nashik',
      'Anjaneri Hills near Nashik',
      'Nashik ghats',
      'Godavari river, Nashik',
      'Nashik vineyards',
      'Nashik pilgrimage town',
    ],
  },
  'ajanta-ellora': {
    photos: [
      'photo-1548013146-72479768bada',
      'photo-1524492412937-280ceb786cbf',
      'photo-1533174072545-7a4b6d7f03cc',
      'photo-1506905925346-21bda4d32df4',
      'photo-1469474968028-56623f02e42e',
      'photo-1588668216262-cb87604c3745',
      'photo-1565193566173-7a0ee3dbe261',
      'photo-1606491956689-2ea8668f67e2',
      'photo-1551632431-ff8a001e5892',
      'photo-1470071459604-3b5ec3a7fe05',
    ],
    alts: [
      'Ajanta Caves, Maharashtra',
      'Ellora Caves, Maharashtra',
      'Kailasa Temple, Ellora',
      'Ajanta Cave murals',
      'UNESCO rock-cut architecture, Ajanta',
      'Ellora cave complex',
      'Buddhist paintings, Ajanta',
      'Ancient cave temples, Ellora',
      'Ajanta valley',
      'Ellora sculptures',
    ],
  },
  shirdi: {
    photos: [
      'photo-1585937421612-70a008356fbe',
      'photo-1606491956689-2ea8668f67e2',
      'photo-1588668216262-cb87604c3745',
      'photo-1565193566173-7a0ee3dbe261',
      'photo-1506905925346-21bda4d32df4',
      'photo-1469474968028-56623f02e42e',
      'photo-1618005182384-a83a8bd57fbe',
      'photo-1439069578443-ffad93f2fe20',
      'photo-1506377247727-2aad5c4e4b0a',
      'photo-1510812431401-41d2bd2722f3',
    ],
    alts: [
      'Sai Baba Temple, Shirdi',
      'Dwarkamai, Shirdi',
      'Chavadi, Shirdi',
      'Gurusthan, Shirdi',
      'Shirdi temple complex',
      'Pilgrims at Shirdi',
      'Shirdi shrine',
      'Spiritual gathering, Shirdi',
      'Shirdi town',
      'Temple lamps, Shirdi',
    ],
  },
  mahabaleshwar: {
    photos: [
      'photo-1501785888041-af3ef285b470',
      'photo-1469854523086-cc02fe5d8800',
      'photo-1439069578443-ffad93f2fe20',
      'photo-1470071459604-3b5ec3a7fe05',
      'photo-1506905925346-21bda4d32df4',
      'photo-1469474968028-56623f02e42e',
      'photo-1528181304800-259b08848561',
      'photo-1555884996-efc8c945d225',
      'photo-1441974231531-c6227db76b6e',
      'photo-1511497584788-876760111969',
    ],
    alts: [
      "Arthur's Seat, Mahabaleshwar",
      'Elephant Head Point, Mahabaleshwar',
      'Venna Lake, Mahabaleshwar',
      'Mapro Garden, Mahabaleshwar',
      'Lingmala Waterfall, Mahabaleshwar',
      'Strawberry farms, Mahabaleshwar',
      'Mahabaleshwar plateau',
      'Mahabaleshwar misty hills',
      'Forest trails, Mahabaleshwar',
      'Hill station views, Mahabaleshwar',
    ],
  },
  lonavala: {
    photos: [
      'photo-1439069578443-ffad93f2fe20',
      'photo-1501785888041-af3ef285b470',
      'photo-1469854523086-cc02fe5d8800',
      'photo-1470071459604-3b5ec3a7fe05',
      'photo-1441974231531-c6227db76b6e',
      'photo-1511497584788-876760111969',
      'photo-1506905925346-21bda4d32df4',
      'photo-1469474968028-56623f02e42e',
      'photo-1528181304800-259b08848561',
      'photo-1555884996-efc8c945d225',
    ],
    alts: [
      'Bhushi Dam, Lonavala',
      'Tiger Point, Lonavala',
      'Rajmachi Fort, Lonavala region',
      'Karla Caves near Lonavala',
      'Lohagad Fort, Lonavala',
      'Pawna Lake near Lonavala',
      'Lonavala monsoon hills',
      'Western Ghats, Lonavala',
      'Lonavala valley',
      'Lonavala waterfalls',
    ],
  },
  alibaug: {
    photos: [
      'photo-1507525428034-b723cf961d3e',
      'photo-1473496166514-889b1740f049',
      'photo-1519046904214-4b483b6d8d6e',
      'photo-1499793983690-e29daefef9c2',
      'photo-1544551763-46a013bb70d5',
      'photo-1506377247727-2aad5c4e4b0a',
      'photo-1510812431401-41d2bd2722f3',
      'photo-1582139329536-7b1c4a4d5b6a',
      'photo-1609137144814-b2a7b6f3a2b1',
      'photo-1565008576549-75c59c8e5e62',
    ],
    alts: [
      'Alibaug Beach',
      'Kolaba Fort, Alibaug',
      'Varsoli Beach, Alibaug',
      'Kashid Beach near Alibaug',
      'Murud coast near Alibaug',
      'Konkan shoreline, Alibaug',
      'Coastal road, Alibaug',
      'Alibaug ferry coast',
      'Seaside village, Alibaug',
      'Sunset at Alibaug',
    ],
  },
  kolhapur: {
    photos: [
      'photo-1585937421612-70a008356fbe',
      'photo-1606491956689-2ea8668f67e2',
      'photo-1571019614242-c5c5dee9f50b',
      'photo-1587474260584-136574528ed5',
      'photo-1524492412937-280ceb786cbf',
      'photo-1565182999561-98d742b5a8d0',
      'photo-1551632431-ff8a001e5892',
      'photo-1533174072545-7a4b6d7f03cc',
      'photo-1526483360412-daa3289b109b',
      'photo-1501785888041-af3ef285b470',
    ],
    alts: [
      'Mahalaxmi Temple, Kolhapur',
      'New Palace, Kolhapur',
      'Rankala Lake, Kolhapur',
      'Panhala Fort near Kolhapur',
      'Kolhapur local markets',
      'Kolhapur heritage',
      'Kolhapur city',
      'Kolhapur culture',
      'Kolhapur architecture',
      'Kolhapur landscapes',
    ],
  },
  nagpur: {
    photos: [
      'photo-1564507592333-c60657eea523',
      'photo-1547514700-37180dc7ebf8',
      'photo-1469854523086-cc02fe5d8800',
      'photo-1588668216262-cb87604c3745',
      'photo-1524492412937-280ceb786cbf',
      'photo-1565182999561-98d742b5a8d0',
      'photo-1606491956689-2ea8668f67e2',
      'photo-1551632431-ff8a001e5892',
      'photo-1533174072545-7a4b6d7f03cc',
      'photo-1526483360412-daa3289b109b',
    ],
    alts: [
      'Deekshabhoomi, Nagpur',
      'Futala Lake, Nagpur',
      'Seminary Hills, Nagpur',
      'Dragon Palace Temple, Nagpur',
      'Orange market, Nagpur',
      'Ambazari Lake, Nagpur',
      'Sitabuldi Fort area, Nagpur',
      'Nagpur avenues',
      'Nagpur cityscape',
      'Central India hub, Nagpur',
    ],
  },
  sindhudurg: {
    photos: [
      'photo-1507525428034-b723cf961d3e',
      'photo-1473496166514-889b1740f049',
      'photo-1544551763-46a013bb70d5',
      'photo-1519046904214-4b483b6d8d6e',
      'photo-1499793983690-e29daefef9c2',
      'photo-1506377247727-2aad5c4e4b0a',
      'photo-1510812431401-41d2bd2722f3',
      'photo-1582139329536-7b1c4a4d5b6a',
      'photo-1609137144814-b2a7b6f3a2b1',
      'photo-1565008576549-75c59c8e5e62',
    ],
    alts: [
      'Sindhudurg Fort, Malvan',
      'Tarkarli Beach',
      'Scuba diving at Tarkarli',
      'Malvan coast, Sindhudurg',
      'Devbag Beach, Sindhudurg',
      'Konkan backwaters, Sindhudurg',
      'Boat ride near Sindhudurg Fort',
      'Rocky Konkan coastline',
      'Sindhudurg shoreline',
      'Coastal village, Sindhudurg',
    ],
  },
  chandrapur: {
    photos: [
      'photo-1564760055775-d63b17a55c44',
      'photo-1516426122078-c23e76319801',
      'photo-1448375248136-c8820d1145f7',
      'photo-1501785888041-af3ef285b470',
      'photo-1439069578443-ffad93f2fe20',
      'photo-1470071459604-3b5ec3a7fe05',
      'photo-1441974231531-c6227db76b6e',
      'photo-1511497584788-876760111969',
      'photo-1506905925346-21bda4d32df4',
      'photo-1469474968028-56623f02e42e',
    ],
    alts: [
      'Tadoba Andhari Tiger Reserve',
      'Tiger safari, Tadoba',
      'Irai Lake near Tadoba',
      'Teak forest, Chandrapur',
      'Ancient temples near Chandrapur',
      'Forest landscape, Chandrapur',
      'Wildlife in Chandrapur district',
      'Tadoba national park',
      'Chandrapur wilderness',
      'Tiger country, Chandrapur',
    ],
  },
};

/** Slug → images. Each slug has its own array only. */
export const destinationImages: Record<string, DestinationGalleryImage[]> = Object.fromEntries(
  Object.entries(GALLERY_CONFIG).map(([slug, cfg]) => [slug, buildGallery(slug, cfg.photos, cfg.alts)])
);

export function getDestinationImages(slug: string): DestinationGalleryImage[] {
  const list = destinationImages[slug];
  if (!list?.length) return [];
  return list.slice(0, 12);
}

export function heroImageForDestination(slug: string, fallbackHero: string): string {
  return getDestinationImages(slug)[0]?.full ?? fallbackHero;
}

export function isDestinationGallerySlug(slug: string): boolean {
  return Boolean(destinationImages[slug]?.length);
}

export function searchKeywordForDestination(slug: string): string {
  return DESTINATION_SEARCH_KEYWORDS[slug] ?? `${slug} Maharashtra tourism`;
}
