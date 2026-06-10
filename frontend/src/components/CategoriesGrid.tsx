'use client';

import Link from 'next/link';
import { assetPath } from '@/lib/basePath';

const categories = [
  { slug: 'historical', title: 'Historical & Heritage', description: 'Explore ancient forts and Maratha Empire legacy', image: assetPath('/categories/historical-heritage.jpg'), icon: '🏰' },
  { slug: 'spiritual', title: 'Spiritual & Pilgrimage', description: 'Sacred temples and divine destinations', image: assetPath('/categories/spiritual-pilgrimage.jpg'), icon: '🕉️' },
  { slug: 'adventure', title: 'Adventure & Ecotourism', description: 'Thrilling treks and natural wonders', image: assetPath('/categories/adventure-ecotourism.jpg'), icon: '⛰️' },
  { slug: 'culinary', title: 'Culinary & Rural', description: 'Authentic flavors and village experiences', image: assetPath('/categories/culinary-rural.jpg'), icon: '🍛' },
  { slug: 'art-culture', title: 'Art, Craft & Culture', description: 'Traditional arts and cultural heritage', image: assetPath('/categories/art-craft-culture.jpg'), icon: '🎨' },
  { slug: 'urban', title: 'Urban & Contemporary', description: 'Modern cities and cosmopolitan experiences', image: assetPath('/categories/urban-contemporary.jpg'), icon: '🏙️' },
  { slug: 'weddings', title: 'Weddings', description: 'Dream venues and celebration planning', image: assetPath('/categories/weddings.jpg'), icon: '💍' },
];

export default function CategoriesGrid() {
  const handleCategoryClick = (slug: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="explore-by-categories" className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-[#FF9933]/10 rounded-full border border-[#FF9933]/20">
            <span className="text-[#FF9933] font-bold text-sm tracking-wide">EXPLORE BY INTEREST</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Explore by Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover Maharashtra through experiences tailored to your interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              onClick={() => handleCategoryClick(category.slug)}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer block"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl border-2 border-white/30">
                  {category.icon}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center text-white font-semibold text-sm">
                    <span className="mr-2">Explore Journey</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
