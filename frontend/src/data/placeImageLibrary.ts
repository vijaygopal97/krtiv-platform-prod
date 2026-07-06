/**
 * Verified Maharashtra place imagery — client DOT library + Wikimedia Commons landmarks.
 * Use these paths for activities, journeys, and destination slides (never stock placeholders).
 */
export const PLACE_IMAGES = {
  ajantaAerial: '/places/slides/ajanta-ellora/ajanta-aerial.jpg',
  elloraCaves: '/places/slides/ajanta-ellora/ellora-caves.jpg',
  elloraDetail: '/places/slides/ajanta-ellora/ellora-detail.jpg',
  kailasa: '/places/slides/ajanta-ellora/kailasa-temple.jpg',
  raigadFort: '/places/slides/raigad/raigad-fort.jpg',
  shaniwarWada: '/places/slides/pune/shaniwar-wada.jpg',
  sinhagad: '/places/slides/pune/sinhagad-fort.jpg',
  agaKhan: '/places/slides/pune/aga-khan-palace.jpg',
  warli: '/places/slides/pune/warli-painting.jpg',
  shirdiTemple: '/places/slides/shirdi/sai-baba-temple.jpg',
  trimbakeshwar: '/places/slides/nashik/trimbakeshwar.jpg',
  nashikVineyard: '/places/slides/nashik/vineyard.jpg',
  pandharpurVitthal: '/places/slides/pandharpur/vitthal-temple.jpg',
  shaniShingnapur: '/places/slides/shani-shingnapur/shani-temple.jpg',
  kalsubaiSunrise: '/places/slides/kalsubai/kalsubai-sunrise.jpg',
  kalsubaiLadders: '/places/slides/kalsubai/kalsubai-ladders.jpg',
  kalsubaiPeak: '/places/slides/kalsubai/kalsubai-peak.jpg',
  bhandardaraLake: '/places/slides/kalsubai/bhandardara-lake.jpg',
  tadobaTiger: '/places/slides/chandrapur/tiger-tadoba.jpg',
  tadobaSafari: '/places/slides/chandrapur/tadoba-safari.jpg',
  karnala: '/places/slides/karnala/karnala-sanctuary.jpg',
  lonavalaHills: '/places/slides/lonavala/lonavala-hills.jpg',
  konkanKashid: '/places/slides/konkan/kashid-beach.jpg',
  konkanKolaba: '/places/slides/konkan/kolaba-fort.jpg',
  alibaugDiveAgar: '/places/slides/alibaug/dive-agar-beach.jpg',
  alibaugAnjarle: '/places/slides/alibaug/anjarle-beach.jpg',
  murudJanjira: '/places/slides/alibaug/murud-janjira.jpg',
  sindhudurgTarkarli: '/places/slides/sindhudurg/tarkarli-beach.jpg',
  sindhudurgKunkeshwar: '/places/slides/sindhudurg/kunkeshwar.jpg',
  kolhapurRankala: '/places/slides/kolhapur/rankala-lake.jpg',
  kolhapurPalace: '/places/slides/kolhapur/new-palace-kolhapur.jpg',
  kolhapurMahalaxmi: '/places/slides/kolhapur/mahalaxmi-temple.jpg',
  paithani: '/places/slides/paithan/paithani-saree.jpg',
  mumbaiGateway: '/places/slides/mumbai/gateway-of-india.jpg',
  mumbaiMarineDrive: '/places/slides/mumbai/marine-drive.jpg',
  mumbaiSeaLink: '/places/slides/mumbai/bandra-worli-sea-link.jpg',
  mumbaiCst: '/places/slides/mumbai/cst-mumbai.jpg',
  mahabaleshwarHills: '/places/slides/mahabaleshwar/hills.jpg',
  mahabaleshwarVenna: '/places/slides/mahabaleshwar/venna-lake.jpg',
} as const;

/** Activity slug → hero + gallery (place-accurate, 3–4 images each). */
export const ACTIVITY_IMAGE_SETS: Record<string, { hero: string; gallery: string[] }> = {
  'explore-ajanta-caves': {
    hero: PLACE_IMAGES.ajantaAerial,
    gallery: [PLACE_IMAGES.ajantaAerial, PLACE_IMAGES.elloraDetail, PLACE_IMAGES.kailasa],
  },
  'trek-raigad-fort': {
    hero: PLACE_IMAGES.raigadFort,
    gallery: [PLACE_IMAGES.raigadFort, PLACE_IMAGES.sinhagad, PLACE_IMAGES.raigadFort],
  },
  'tour-ellora-caves': {
    hero: PLACE_IMAGES.kailasa,
    gallery: [PLACE_IMAGES.kailasa, PLACE_IMAGES.elloraCaves, PLACE_IMAGES.elloraDetail, PLACE_IMAGES.ajantaAerial],
  },
  'visit-shaniwar-wada': {
    hero: PLACE_IMAGES.shaniwarWada,
    gallery: [PLACE_IMAGES.shaniwarWada, PLACE_IMAGES.agaKhan, PLACE_IMAGES.sinhagad],
  },
  'shirdi-sai-baba-temple-darshan': {
    hero: PLACE_IMAGES.shirdiTemple,
    gallery: [PLACE_IMAGES.shirdiTemple, PLACE_IMAGES.trimbakeshwar],
  },
  'trimbakeshwar-jyotirlinga-pilgrimage': {
    hero: PLACE_IMAGES.trimbakeshwar,
    gallery: [PLACE_IMAGES.trimbakeshwar, PLACE_IMAGES.nashikVineyard],
  },
  'pandharpur-vitthal-temple-yatra': {
    hero: PLACE_IMAGES.pandharpurVitthal,
    gallery: [PLACE_IMAGES.pandharpurVitthal, PLACE_IMAGES.kolhapurMahalaxmi],
  },
  'shani-shingnapur-temple-darshan': {
    hero: PLACE_IMAGES.shaniShingnapur,
    gallery: [PLACE_IMAGES.shaniShingnapur, PLACE_IMAGES.trimbakeshwar],
  },
  'kalsubai-peak-trek': {
    hero: PLACE_IMAGES.kalsubaiSunrise,
    gallery: [PLACE_IMAGES.kalsubaiSunrise, PLACE_IMAGES.kalsubaiLadders, PLACE_IMAGES.kalsubaiPeak, PLACE_IMAGES.bhandardaraLake],
  },
  'tadoba-andhari-tiger-reserve-safari': {
    hero: PLACE_IMAGES.tadobaTiger,
    gallery: [PLACE_IMAGES.tadobaTiger, PLACE_IMAGES.tadobaSafari, PLACE_IMAGES.lonavalaHills],
  },
  'raigad-fort-trek': {
    hero: PLACE_IMAGES.raigadFort,
    gallery: [PLACE_IMAGES.raigadFort, PLACE_IMAGES.sinhagad],
  },
  'karnala-bird-sanctuary-trek': {
    hero: PLACE_IMAGES.karnala,
    gallery: [PLACE_IMAGES.karnala, PLACE_IMAGES.lonavalaHills],
  },
  'konkan-coastal-cuisine-trail-sindhudurg': {
    hero: PLACE_IMAGES.sindhudurgTarkarli,
    gallery: [PLACE_IMAGES.sindhudurgTarkarli, PLACE_IMAGES.sindhudurgKunkeshwar, PLACE_IMAGES.konkanKashid],
  },
  'nashik-wine-tasting-tour': {
    hero: PLACE_IMAGES.nashikVineyard,
    gallery: [PLACE_IMAGES.nashikVineyard, PLACE_IMAGES.trimbakeshwar],
  },
  'malvan-sea-food-festival': {
    hero: PLACE_IMAGES.sindhudurgTarkarli,
    gallery: [PLACE_IMAGES.sindhudurgTarkarli, PLACE_IMAGES.sindhudurgKunkeshwar],
  },
  'agra-rural-farm-stay-and-cooking-class': {
    hero: PLACE_IMAGES.kolhapurRankala,
    gallery: [PLACE_IMAGES.kolhapurRankala, PLACE_IMAGES.kolhapurMahalaxmi],
  },
  'warli-painting-workshop-palghar': {
    hero: PLACE_IMAGES.warli,
    gallery: [PLACE_IMAGES.warli, PLACE_IMAGES.agaKhan],
  },
  'ellora-caves-festival-august': {
    hero: PLACE_IMAGES.elloraDetail,
    gallery: [PLACE_IMAGES.elloraDetail, PLACE_IMAGES.kailasa, PLACE_IMAGES.elloraCaves],
  },
  'paithani-saree-weaving-paithan': {
    hero: PLACE_IMAGES.paithani,
    gallery: [PLACE_IMAGES.paithani, PLACE_IMAGES.ajantaAerial],
  },
  'gondhal-folk-performance-sindhudurg': {
    hero: PLACE_IMAGES.sindhudurgKunkeshwar,
    gallery: [PLACE_IMAGES.sindhudurgKunkeshwar, PLACE_IMAGES.sindhudurgTarkarli],
  },
  'marine-drive-evening-walk': {
    hero: PLACE_IMAGES.mumbaiMarineDrive,
    gallery: [PLACE_IMAGES.mumbaiMarineDrive, PLACE_IMAGES.mumbaiGateway, PLACE_IMAGES.mumbaiCst],
  },
  'shaniwar-wada-pune-fort': {
    hero: PLACE_IMAGES.shaniwarWada,
    gallery: [PLACE_IMAGES.shaniwarWada, PLACE_IMAGES.agaKhan],
  },
  'bandra-worli-sea-link-drive': {
    hero: PLACE_IMAGES.mumbaiSeaLink,
    gallery: [PLACE_IMAGES.mumbaiSeaLink, PLACE_IMAGES.mumbaiMarineDrive, PLACE_IMAGES.mumbaiGateway],
  },
  'koregaon-park-pune-cafe-hopping': {
    hero: PLACE_IMAGES.agaKhan,
    gallery: [PLACE_IMAGES.agaKhan, PLACE_IMAGES.shaniwarWada],
  },
  'destination-wedding-at-sahyadri-resort-mahabaleshwar': {
    hero: PLACE_IMAGES.mahabaleshwarHills,
    gallery: [PLACE_IMAGES.mahabaleshwarHills, PLACE_IMAGES.mahabaleshwarVenna],
  },
  'beach-wedding-at-tarkarli': {
    hero: PLACE_IMAGES.sindhudurgTarkarli,
    gallery: [PLACE_IMAGES.sindhudurgTarkarli, PLACE_IMAGES.konkanKashid],
  },
  'heritage-wedding-at-jaivilas-palace-kolhapur': {
    hero: PLACE_IMAGES.kolhapurPalace,
    gallery: [PLACE_IMAGES.kolhapurPalace, PLACE_IMAGES.kolhapurMahalaxmi],
  },
  'vineyard-wedding-at-sula-winery-nashik': {
    hero: PLACE_IMAGES.nashikVineyard,
    gallery: [PLACE_IMAGES.nashikVineyard, PLACE_IMAGES.trimbakeshwar],
  },
};

export const JOURNEY_IMAGE_SETS = {
  'kalsubai-sunrise': {
    hero: PLACE_IMAGES.kalsubaiSunrise,
    gallery: [
      PLACE_IMAGES.kalsubaiSunrise,
      PLACE_IMAGES.kalsubaiLadders,
      PLACE_IMAGES.kalsubaiPeak,
      PLACE_IMAGES.bhandardaraLake,
    ],
  },
  'kohinoor-of-the-deccan': {
    hero: PLACE_IMAGES.ajantaAerial,
    gallery: [
      PLACE_IMAGES.ajantaAerial,
      PLACE_IMAGES.kailasa,
      PLACE_IMAGES.elloraCaves,
      PLACE_IMAGES.elloraDetail,
    ],
  },
  'konkan-slow-lunch': {
    hero: PLACE_IMAGES.alibaugDiveAgar,
    gallery: [
      PLACE_IMAGES.alibaugDiveAgar,
      PLACE_IMAGES.konkanKolaba,
      PLACE_IMAGES.konkanKashid,
      PLACE_IMAGES.murudJanjira,
    ],
  },
} as const;
