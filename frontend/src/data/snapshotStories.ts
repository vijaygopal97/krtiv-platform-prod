import type { SnapshotGalleryImage, SnapshotStory } from '@/types/snapshotStory';

const U = (photoId: string, w = 1600) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=80`;

const W = (path: string) => `https://upload.wikimedia.org/wikipedia/commons/${path}`;

const WM = {
  gateway: W('thumb/e/ed/Gateway_of_India.jpg/1920px-Gateway_of_India.jpg'),
  marine: W('thumb/1/18/Marine_Drive_Mumbai.jpg/1920px-Marine_Drive_Mumbai.jpg'),
  cst: W('thumb/8/84/Chhatrapati_Shivaji_Terminus.jpg/1920px-Chhatrapati_Shivaji_Terminus.jpg'),
  elephanta: W(
    'thumb/4/4c/Elephanta_Caves_-_Main_Entrance.jpg/1920px-Elephanta_Caves_-_Main_Entrance.jpg',
  ),
  shaniwar: W('thumb/9/9f/Shaniwar_Wada.jpg/1920px-Shaniwar_Wada.jpg'),
  agaKhan: W('2/25/Aga_Khan_Palace.jpg'),
  sinhagad: W('thumb/1/15/Sinhagad_Fort.jpg/1920px-Sinhagad_Fort.jpg'),
  ellora: W('thumb/1/15/Ellora_cave16_001.jpg/1920px-Ellora_cave16_001.jpg'),
  elloraFull: W('1/15/Ellora_cave16_001.jpg'),
  venna: W('thumb/9/90/Venna_Lake%2C_Mahabaleshwar.jpg/1920px-Venna_Lake%2C_Mahabaleshwar.jpg'),
  deeksha: W('thumb/3/38/Deekshabhoomi_-_panoramio.jpg/1920px-Deekshabhoomi_-_panoramio.jpg'),
  sindhudurg: W('thumb/e/ec/Sindhudurg_Fort%2C_Back_Wall.jpg/1920px-Sindhudurg_Fort%2C_Back_Wall.jpg'),
  tadoba: W('thumb/3/31/Tadoba_National_Park.jpg/1920px-Tadoba_National_Park.jpg'),
  tarkarli: W('thumb/a/a6/Tarkarli_Beach%2C_Malvan.jpg/1920px-Tarkarli_Beach%2C_Malvan.jpg'),
  mahalaxmi: W(
    'thumb/d/d3/Mahalaxmi_Temple%2C_Kolhapur%2C_Maharashtra_09.jpg/1920px-Mahalaxmi_Temple%2C_Kolhapur%2C_Maharashtra_09.jpg',
  ),
  ajanta: W('thumb/b/ba/Ajanta_Caves%2C_Cave_26.jpg/1920px-Ajanta_Caves%2C_Cave_26.jpg'),
};

const US = {
  coast: U('photo-1507525428034-b723cf961d3e'),
  hills: U('photo-1501785888041-af3ef285b470'),
  lake: U('photo-1469854523086-cc02fe5d8800'),
  heritage: U('photo-1548013146-72479768bada'),
  wildlife: U('photo-1564760055775-d63b17a55c44'),
  safari: U('photo-1516426122078-c23e76319801'),
  skyline: U('photo-1564507592333-c60657eea523'),
  urban: U('photo-1578662996442-48f60103fc96'),
  city: U('photo-1587474260584-136574528ed5'),
  forest: U('photo-1441974231531-c6227db76b6e'),
  sunset: U('photo-1506905925346-21bda4d32df4'),
  valley: U('photo-1470071459604-3b5ec3a7fe05'),
  water: U('photo-1544551763-46a013bb70d5'),
  peaks: U('photo-1511497584788-876760111969'),
  mist: U('photo-1469474968028-56623f02e42e'),
};

function story(
  id: string,
  slug: string,
  title: string,
  subtitle: string,
  category: string,
  galleryImages: SnapshotGalleryImage[],
): SnapshotStory {
  return {
    id,
    slug,
    title,
    subtitle,
    category,
    coverImage: galleryImages[0]?.src ?? '',
    galleryImages,
  };
}

export const SNAPSHOT_STORIES: SnapshotStory[] = [
  story('snap-anjarle', 'anjarle-beach', 'Anjarle Beach', 'A Hidden Konkan Paradise', 'Beach', [
    { src: WM.tarkarli, alt: 'Golden sand at Anjarle Beach', caption: 'Quiet Konkan shores where casuarina trees meet the sea.' },
    { src: US.coast, alt: 'Konkan coastline', caption: 'Turquoise shallows ideal for a slow morning walk.' },
    { src: US.water, alt: 'Coastal waters', caption: 'Fishing boats return with the afternoon tide.' },
    { src: US.sunset, alt: 'Sunset over the Arabian Sea', caption: 'Sunset paints the horizon in saffron and gold.' },
    { src: WM.tarkarli, alt: 'Malvan coast near Anjarle', caption: 'Nearby Malvan offers snorkelling and fresh seafood.' },
    { src: US.hills, alt: 'Hills above the Konkan', caption: 'Green ridges frame the coastline from above.' },
    { src: US.coast, alt: 'Beach cove', caption: 'A sheltered cove perfect for families.' },
    { src: US.lake, alt: 'Backwaters near the coast', caption: 'Estuaries weave through coconut groves.' },
  ]),
  story('snap-elephanta', 'elephanta-caves', 'Elephanta Caves', "Mumbai's Ancient Marvel", 'Heritage', [
    { src: WM.elephanta, alt: 'Elephanta Caves main entrance', caption: 'The island gateway to UNESCO rock-cut sanctuaries.' },
    { src: WM.gateway, alt: 'Gateway of India with ferry', caption: 'Ferries depart from Apollo Bunder for Elephanta Island.' },
    { src: WM.marine, alt: 'Marine Drive Mumbai', caption: 'Harbour views on the ride across Mumbai Harbour.' },
    { src: US.heritage, alt: 'Rock-cut sculpture', caption: 'Colossal Trimurti panels carved from basalt.' },
    { src: WM.elephanta, alt: 'Cave colonnade', caption: 'Pillared halls echo with centuries of devotion.' },
    { src: US.urban, alt: 'Mumbai harbour skyline', caption: 'The city skyline fades as you approach the island.' },
    { src: WM.cst, alt: 'Chhatrapati Shivaji Terminus', caption: 'Pair your visit with Victorian Gothic Mumbai.' },
    { src: US.skyline, alt: 'Mumbai coastline', caption: 'Coastal light softens the stone facades at dusk.' },
    { src: US.heritage, alt: 'Ancient carvings', caption: 'Every niche tells stories of Shaiva mythology.' },
    { src: WM.marine, alt: 'Evening at Marine Drive', caption: "Return to the Queen's Necklace after your tour." },
  ]),
  story('snap-ambazari', 'ambazari-talav', 'Ambazari Talav', "Nagpur's Serene Escape", 'Nature', [
    { src: US.lake, alt: 'Ambazari Lake Nagpur', caption: "The city's largest lake, ringed by walking paths." },
    { src: WM.deeksha, alt: 'Deekshabhoomi Nagpur', caption: 'A short drive to one of India’s great stupas.' },
    { src: US.hills, alt: 'Seminary Hills Nagpur', caption: 'Wooded trails with panoramic Orange City views.' },
    { src: US.forest, alt: 'Garden paths', caption: "Boating and birdlife at the water's edge." },
    { src: US.sunset, alt: 'Futala Lake evening', caption: 'Evening lights shimmer on nearby Futala Lake.' },
    { src: US.valley, alt: 'Green belt around Nagpur', caption: 'Monsoon greens refresh the lake gardens.' },
  ]),
  story('snap-gateway', 'gateway-of-india', 'Gateway of India', 'The Pride of Mumbai', 'Landmark', [
    { src: WM.gateway, alt: 'Gateway of India', caption: 'Indo-Saracenic arches welcome the harbour breeze.' },
    { src: WM.marine, alt: 'Marine Drive', caption: 'Curving Art Deco along the Arabian Sea.' },
    { src: WM.cst, alt: 'CSMT exterior', caption: 'UNESCO railway cathedral at the heart of the city.' },
    { src: US.urban, alt: 'Colaba waterfront', caption: 'Cafés and galleries in historic Colaba.' },
    { src: US.skyline, alt: 'Bandra Worli Sea Link', caption: 'The Sea Link stitches the western suburbs to the bay.' },
    { src: WM.gateway, alt: 'Gateway at dusk', caption: 'Street lamps and ferries after sunset.' },
    { src: US.heritage, alt: 'Heritage architecture', caption: 'Victorian and Gothic layers along Apollo Bunder.' },
    { src: WM.marine, alt: 'Marine Drive night', caption: "The Queen's Necklace lights up at night." },
  ]),
  story('snap-ajanta', 'ajanta-ellora', 'Ajanta & Ellora', 'World Heritage Wonders', 'UNESCO', [
    { src: WM.ellora, alt: 'Kailasa Temple Ellora', caption: 'Monolithic Kailasa — carved from a single cliff.' },
    { src: WM.elloraFull, alt: 'Ellora cave complex', caption: 'Buddhist, Hindu, and Jain caves in one landscape.' },
    { src: WM.ajanta, alt: 'Ajanta Cave paintings', caption: 'Ajanta’s frescoes glow in lamp-lit chambers.' },
    { src: US.heritage, alt: 'Rock carvings', caption: 'Intricate narratives in volcanic basalt.' },
    { src: US.forest, alt: 'Waghora gorge', caption: 'Ajanta overlooks a horseshoe gorge of teak forest.' },
    { src: WM.ellora, alt: 'Ellora courtyard', caption: 'Elephants and deities guard the temple courtyard.' },
    { src: US.peaks, alt: 'Sahyadri cliffs', caption: 'Deccan plateau cliffs cradle the cave cities.' },
    { src: US.heritage, alt: 'Buddhist vihara', caption: 'Quiet cells where monks once meditated.' },
    { src: WM.ajanta, alt: 'Ajanta facade', caption: 'A pilgrimage through two millennia of art.' },
  ]),
  story('snap-shaniwar', 'shaniwar-wada', 'Shaniwar Wada', 'The Maratha Legacy', 'History', [
    { src: WM.shaniwar, alt: 'Shaniwar Wada Pune', caption: 'Peshwa seat of power in old Pune.' },
    { src: WM.agaKhan, alt: 'Aga Khan Palace', caption: 'Gandhi’s internment memorial in serene gardens.' },
    { src: WM.sinhagad, alt: 'Sinhagad Fort', caption: 'Wind-swept ramparts above the Sahyadri.' },
    { src: US.city, alt: 'FC Road Pune', caption: 'Cafés and bookshops along Fergusson College Road.' },
    { src: US.heritage, alt: 'Pataleshwar Cave Temple', caption: 'Rock-cut Shiva shrine in the city centre.' },
    { src: WM.shaniwar, alt: 'Wada gardens', caption: 'Fountains and courtyards within the wada walls.' },
    { src: US.hills, alt: 'Sinhagad trek', caption: 'Monsoon mist on the fort approach.' },
    { src: WM.sinhagad, alt: 'Fort bastions', caption: 'Battlements recall Tanaji Malusare’s daring climb.' },
  ]),
  story('snap-mahabaleshwar', 'mahabaleshwar', 'Mahabaleshwar', 'Queen of Hill Stations', 'Hill Station', [
    { src: WM.venna, alt: 'Venna Lake', caption: 'Rowboats drift on Venna Lake’s cool waters.' },
    { src: US.hills, alt: "Arthur's Seat", caption: "Arthur's Seat overlooks the Krishna valley." },
    { src: US.valley, alt: 'Mapro Garden', caption: 'Strawberries and waffles at Mapro Garden.' },
    { src: US.forest, alt: 'Lingmala Waterfall', caption: 'Mist rises from Lingmala in the rains.' },
    { src: US.mist, alt: 'Elephant Head Point', caption: 'Elephant Head Point frames dramatic Sahyadri views.' },
    { src: US.sunset, alt: 'Wilson Point sunrise', caption: 'Wilson Point catches the first light over the ghats.' },
    { src: WM.venna, alt: 'Lake promenade', caption: 'Pony rides and pine-scented evenings.' },
    { src: US.hills, alt: 'Plateau meadows', caption: 'Tableland walks through wildflowers.' },
  ]),
  story('snap-sindhudurg', 'sindhudurg-fort', 'Sindhudurg Fort', 'Guardian of the Arabian Sea', 'Fort', [
    { src: WM.sindhudurg, alt: 'Sindhudurg Fort walls', caption: 'Sea fort built on an island off Malvan.' },
    { src: WM.tarkarli, alt: 'Tarkarli Beach', caption: 'Crystal waters for snorkelling near the fort.' },
    { src: US.water, alt: 'Scuba diving Malvan', caption: 'Coral gardens beneath the Konkan surf.' },
    { src: US.coast, alt: 'Devbag beach', caption: 'Palm-fringed shores south of Malvan.' },
    { src: WM.sindhudurg, alt: 'Fort ramparts', caption: 'Laterite walls withstand monsoon swells.' },
    { src: US.sunset, alt: 'Arabian Sea sunset', caption: 'Golden hour from the ferry deck.' },
    { src: US.coast, alt: 'Konkan fishing village', caption: 'Malvani cuisine and homestays by the shore.' },
  ]),
  story('snap-tadoba', 'tadoba-national-park', 'Tadoba National Park', 'Home of the Tigers', 'Wildlife', [
    { src: WM.tadoba, alt: 'Tadoba National Park', caption: 'Teak forests of Tadoba Andhari Tiger Reserve.' },
    { src: US.wildlife, alt: 'Tiger in the wild', caption: 'India’s tiger heartland in Chandrapur district.' },
    { src: US.safari, alt: 'Jeep safari', caption: 'Dawn safaris along Tadoba’s lake trails.' },
    { src: US.forest, alt: 'Forest canopy', caption: 'Sloth bears and langurs in the understorey.' },
    { src: US.wildlife, alt: 'Spotted deer', caption: 'Chital gather at waterholes at dusk.' },
    { src: WM.tadoba, alt: 'Park landscape', caption: 'Irai Lake reflects monsoon clouds.' },
    { src: US.safari, alt: 'Birdlife', caption: 'Hornbills and eagles above the meadows.' },
    { src: US.forest, alt: 'Bamboo thickets', caption: 'Bamboo groves rustle in the afternoon wind.' },
  ]),
  story('snap-kolhapur', 'kolhapur', 'Kolhapur', 'Tradition & Royal Heritage', 'Culture', [
    { src: WM.mahalaxmi, alt: 'Mahalaxmi Temple Kolhapur', caption: 'Sacred Mahalaxmi Temple in the old city.' },
    { src: US.lake, alt: 'Rankala Lake', caption: 'Evening strolls around Rankala Lake.' },
    { src: US.heritage, alt: 'New Palace Kolhapur', caption: 'Chhatrapati palace museum and darbar hall.' },
    { src: US.forest, alt: 'Panhala Fort', caption: 'Panhala Fort overlooks the Western Ghats.' },
    { src: US.city, alt: 'Kolhapur markets', caption: 'Kolhapuri chappals and spice-laden bazaars.' },
    { src: WM.mahalaxmi, alt: 'Temple architecture', caption: 'Stone pillars carved with mythic scenes.' },
    { src: US.heritage, alt: 'Royal heritage', caption: 'Wrestling akhadas and lavani performance traditions.' },
    { src: US.lake, alt: 'Lake gardens', caption: 'Boating and street food by the water.' },
  ]),
];

export function getSnapshotStories(): SnapshotStory[] {
  return SNAPSHOT_STORIES;
}
