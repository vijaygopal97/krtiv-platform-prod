'use client';

type Props = { lat: number; lng: number; title: string; zoom?: number };

export function PlaceGoogleMap({ lat, lng, title, zoom = 12 }: Props) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=${zoom}&output=embed`;
  return (
    <section className="py-16 px-6 max-w-[1200px] mx-auto" aria-labelledby="place-map-heading">
      <h2 id="place-map-heading" className="display-md mb-4">Map — {title}</h2>
      <div className="rounded-2xl overflow-hidden border hairline aspect-video">
        <iframe title={`Map of ${title}`} src={src} className="w-full h-full border-0" loading="lazy" allowFullScreen />
      </div>
    </section>
  );
}
