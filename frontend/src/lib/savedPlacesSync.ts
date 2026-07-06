import { fetchMyPlaces, syncMyPlaces, deleteMyPlace, upsertMyPlace } from '@/lib/myPlacesApi';
import { authService } from '@/services/authService';
import { getSavedPlaces, mergeSavedPlaces } from '@/lib/savedPlacesStorage';
import type { SavedPlaceMeta } from '@/lib/savePlaceSlug';

let syncInFlight: Promise<SavedPlaceMeta[]> | null = null;

export async function syncSavedPlacesToAccount(): Promise<SavedPlaceMeta[]> {
  const user = authService.getCurrentUser();
  if (!user?.token) return getSavedPlaces();

  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    const local = getSavedPlaces();
    const remote = await fetchMyPlaces();
    const remoteMeta: SavedPlaceMeta[] = remote.map((p) => ({
      slug: p.slug,
      title: p.title,
      image: p.image,
      locationLabel: p.locationLabel,
      source: p.source,
      lat: p.lat,
      lng: p.lng,
    }));
    const union = mergeSavedPlaces(remoteMeta);
    if (union.length) {
      const synced = await syncMyPlaces(union);
      if (synced.length) {
        const fromServer: SavedPlaceMeta[] = synced.map((p) => ({
          slug: p.slug,
          title: p.title,
          image: p.image,
          locationLabel: p.locationLabel,
          source: p.source,
          lat: p.lat,
          lng: p.lng,
        }));
        mergeSavedPlaces(fromServer);
        return fromServer;
      }
    }
    return union;
  })();

  try {
    return await syncInFlight;
  } finally {
    syncInFlight = null;
  }
}

export async function persistSavedPlaceToggle(meta: SavedPlaceMeta, saved: boolean): Promise<void> {
  const user = authService.getCurrentUser();
  if (!user?.token) return;
  if (saved) {
    await upsertMyPlace(meta);
  } else {
    await deleteMyPlace(meta.slug);
  }
}
