import { getDestinationHeroSlides } from '@/data/destinationHeroImages';
import type { TravelStoryDestination, TravelStorySlide } from '@/types/travelStory';

type Meta = {
  slug: string;
  title: string;
  category: string;
  highlight: string;
  description: string;
};

const DESTINATIONS: Meta[] = [
  {
    slug: 'mumbai',
    title: 'Mumbai',
    category: 'Metro',
    highlight: 'Gateway of India',
    description: "Explore India's financial capital.",
  },
  {
    slug: 'pune',
    title: 'Pune',
    category: 'Heritage',
    highlight: 'Shaniwar Wada',
    description: 'Culture, forts, and café-lined streets.',
  },
  {
    slug: 'nashik',
    title: 'Nashik',
    category: 'Spiritual',
    highlight: 'Godavari Ghats',
    description: 'Temples, vineyards, and sacred rivers.',
  },
  {
    slug: 'ajanta-ellora',
    title: 'Ajanta & Ellora',
    category: 'UNESCO',
    highlight: 'Kailasa Temple',
    description: 'Rock-cut wonders of the Deccan.',
  },
  {
    slug: 'shirdi',
    title: 'Shirdi',
    category: 'Pilgrimage',
    highlight: 'Sai Baba Temple',
    description: 'A journey of faith and quiet devotion.',
  },
  {
    slug: 'mahabaleshwar',
    title: 'Mahabaleshwar',
    category: 'Hill Station',
    highlight: 'Venna Lake',
    description: 'Mist, strawberries, and Sahyadri views.',
  },
  {
    slug: 'lonavala',
    title: 'Lonavala',
    category: 'Weekend',
    highlight: 'Bhushi Dam',
    description: 'Monsoon waterfalls and misty ghats.',
  },
  {
    slug: 'alibaug',
    title: 'Alibaug',
    category: 'Beach',
    highlight: 'Konkan Coast',
    description: 'Ferry hops and sun-washed shores.',
  },
  {
    slug: 'kolhapur',
    title: 'Kolhapur',
    category: 'Culture',
    highlight: 'Mahalaxmi Temple',
    description: 'Royal heritage and spice markets.',
  },
  {
    slug: 'nagpur',
    title: 'Nagpur',
    category: 'City',
    highlight: 'Deekshabhoomi',
    description: 'The Orange City and serene lakes.',
  },
  {
    slug: 'sindhudurg',
    title: 'Sindhudurg',
    category: 'Coast',
    highlight: 'Sindhudurg Fort',
    description: 'Sea forts and crystal Konkan waters.',
  },
  {
    slug: 'chandrapur',
    title: 'Chandrapur',
    category: 'Wildlife',
    highlight: 'Tadoba Tigers',
    description: 'Safaris in teak country.',
  },
];

function toStorySlides(meta: Meta): TravelStorySlide[] {
  const heroes = getDestinationHeroSlides(meta.slug);
  return heroes.slice(0, 8).map((h, i) => {
    const shortTitle = (h.alt ?? '').split(',')[0]?.trim() || meta.highlight;
    return {
      image: h.imageUrl,
      title: i === 0 ? meta.highlight : shortTitle,
      caption: h.alt || shortTitle,
      location: meta.title,
    };
  });
}

function buildDestination(meta: Meta): TravelStoryDestination {
  const stories = toStorySlides(meta);
  const cover = stories[0]?.image ?? '';
  return {
    id: `travel-story-${meta.slug}`,
    slug: meta.slug,
    title: meta.title,
    category: meta.category,
    coverImage: cover,
    avatarImage: cover,
    highlight: meta.highlight,
    description: meta.description,
    stories,
  };
}

export const TRAVEL_STORY_DESTINATIONS: TravelStoryDestination[] = DESTINATIONS.map(buildDestination);

export function getTravelStories(): TravelStoryDestination[] {
  return TRAVEL_STORY_DESTINATIONS;
}
