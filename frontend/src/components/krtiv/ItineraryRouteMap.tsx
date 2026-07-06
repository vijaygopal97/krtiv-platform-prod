'use client';

import { useEffect, useRef } from 'react';
import type { GeoMapPoint } from './maharashtraMapUtils';
import 'leaflet/dist/leaflet.css';
import '@/styles/itinerary-route-map.css';

type LeafletMap = import('leaflet').Map;
type LeafletLayer = import('leaflet').Layer;

type Props = {
  points: GeoMapPoint[];
  activeDay: number;
  onActiveDayChange: (index: number) => void;
};

/** Stop trackpad pinch from zooming the whole page while the pointer is over the map. */
function attachMapGestureGuards(el: HTMLElement) {
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) e.preventDefault();
  };
  const onGestureStart = (e: Event) => {
    e.preventDefault();
  };

  el.addEventListener('wheel', onWheel, { passive: false });
  el.addEventListener('gesturestart', onGestureStart);
  el.addEventListener('gesturechange', onGestureStart);

  return () => {
    el.removeEventListener('wheel', onWheel);
    el.removeEventListener('gesturestart', onGestureStart);
    el.removeEventListener('gesturechange', onGestureStart);
  };
}

export function ItineraryRouteMap({ points, activeDay, onActiveDayChange }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletLayer[]>([]);
  const routeRef = useRef<LeafletLayer | null>(null);
  const onSelectRef = useRef(onActiveDayChange);
  const detachGesturesRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onSelectRef.current = onActiveDayChange;
  }, [onActiveDayChange]);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    let cancelled = false;

    void import('leaflet').then((L) => {
      if (cancelled || !containerRef.current) return;

      detachGesturesRef.current?.();
      detachGesturesRef.current = wrapRef.current
        ? attachMapGestureGuards(wrapRef.current)
        : null;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        zoomControl: true,
        attributionControl: false,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 19,
      }).addTo(map);

      const latLngs = points.map((p) => L.latLng(p.lat, p.lng));
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds.pad(0.22));

      if (points.length > 1) {
        routeRef.current = L.polyline(latLngs, {
          color: '#B5562D',
          weight: 4,
          opacity: 0.85,
          dashArray: '10 8',
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
      }

      markersRef.current = points.map((p, i) => {
        const isActive = activeDay === i;
        const icon = L.divIcon({
          className: 'itinerary-route-map__pin-wrap',
          html: `<div class="itinerary-route-map__pin${isActive ? ' itinerary-route-map__pin--active' : ''}" aria-hidden="true">${p.day.day}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([p.lat, p.lng], { icon, alt: `Day ${p.day.day}, ${p.label}` });
        marker.bindPopup(`<strong>Day ${p.day.day}</strong><br/>${p.label}`);
        marker.on('click', () => onSelectRef.current(i));
        marker.addTo(map);
        return marker;
      });
    });

    return () => {
      cancelled = true;
      detachGesturesRef.current?.();
      detachGesturesRef.current = null;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
      routeRef.current = null;
    };
  }, [points]);

  useEffect(() => {
    if (!mapRef.current || markersRef.current.length === 0) return;

    void import('leaflet').then((L) => {
      markersRef.current.forEach((layer, i) => {
        const marker = layer as import('leaflet').Marker;
        const isActive = activeDay === i;
        const p = points[i];
        if (!p) return;
        const icon = L.divIcon({
          className: 'itinerary-route-map__pin-wrap',
          html: `<div class="itinerary-route-map__pin${isActive ? ' itinerary-route-map__pin--active' : ''}" aria-hidden="true">${p.day.day}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        marker.setIcon(icon);
        if (isActive) {
          marker.openPopup();
          mapRef.current?.panTo([p.lat, p.lng], { animate: true, duration: 0.45 });
        }
      });
    });
  }, [activeDay, points]);

  return (
    <div ref={wrapRef} className="itinerary-route-map-shell relative w-full h-full min-h-[280px]">
      <div ref={containerRef} className="itinerary-route-map absolute inset-0 rounded-[inherit]" />
      <div className="itinerary-route-map__badge">
        Maharashtra · {points.length} {points.length === 1 ? 'stop' : 'stops'}
      </div>
    </div>
  );
}
