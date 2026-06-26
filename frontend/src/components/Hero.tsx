'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authService } from '@/services/authService';
import VideoPlayer from '@/components/VideoPlayer';
import CategoryVideoWithEngagement, {
  type CategoryPageVideo,
} from '@/components/CategoryVideoWithEngagement';
import { heroVideoConfig } from '@/config/video';
import { assetPath } from '@/lib/basePath';

const MAHARASHTRA_TOURISM_INSTAGRAM =
  'https://www.instagram.com/maharashtratourismofficial?igsh=anhlNHpkNGd1aTJv';

/** Signpost-backed hero video (metrics + ranking) or legacy URL-only. */
export type HeroCategoryVideo =
  | { kind: 'signpost'; video: CategoryPageVideo }
  | { kind: 'url'; url: string; title: string };

interface HeroProps {
  category?: string;
  categoryData?: {
    title: string;
    subtitle: string;
    description: string;
    days: Array<{ image: string }>;
  };
  categoryVideo?: HeroCategoryVideo | null;
}

export default function Hero({ category, categoryData, categoryVideo }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const defaultContent = {
    badge: 'DISCOVER INCREDIBLE MAHARASHTRA',
    title: 'You will find India here',
    subtitle: 'Maharashtra',
    image: assetPath('/hero-image.jpeg'),
  };

  const categoryContent = categoryData ? {
    badge: categoryData.title.toUpperCase(),
    title: categoryData.subtitle,
    subtitle: categoryData.description,
    image: categoryData.days[0]?.image || defaultContent.image,
  } : defaultContent;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden pb-32 sm:pb-48 md:pb-64">
        <div className="absolute inset-0 z-0" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <img
            src={categoryContent.image}
            alt="Maharashtra Landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-black/24 to-black/50 md:from-black/28 md:via-black/16 md:to-black/36"></div>
        </div>

        <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between backdrop-blur-md bg-black/20 border-b border-white/10">
          <Link href="/" className="flex flex-col md:flex-row items-center md:items-center gap-0.5 md:gap-3 shrink-0 min-w-0">
            <img
              src={assetPath('/maharashtra-logo.png')}
              alt="Maharashtra Tourism"
              className="w-10 h-10 md:w-12 md:h-12 object-contain shadow-lg shrink-0"
            />
            <h1 className="text-white font-display text-sm md:text-2xl font-bold tracking-tight drop-shadow-lg leading-tight md:leading-normal text-center md:text-left">Maharashtra Tourism</h1>
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex space-x-8 text-white font-medium drop-shadow-lg">
              <Link href="/" className="hover:text-[#FF9933] transition-colors cursor-pointer">Categories</Link>
              <Link href="/" className="hover:text-[#FF9933] transition-colors cursor-pointer">Itinerary Generator</Link>
            </nav>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className="px-3 py-1.5 md:px-6 md:py-2 bg-gradient-maharashtra rounded-full hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 md:gap-3 text-sm md:text-base cursor-pointer">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="text-white font-semibold hover:opacity-80 transition-opacity cursor-pointer">Dashboard</Link>
                ) : (
                  <>
                    <Link href="/login" className="text-white font-semibold hover:opacity-80 transition-opacity cursor-pointer">Login</Link>
                    <span className="text-white/50">|</span>
                    <Link href="/register" className="text-white font-semibold hover:opacity-80 transition-opacity cursor-pointer">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-30 md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`fixed top-0 right-0 z-40 h-full w-full max-w-sm bg-gray-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl md:hidden transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col pt-20 px-6 pb-8">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 text-white font-medium hover:bg-white/10 hover:text-[#FF9933] rounded-lg transition-colors cursor-pointer"
              >
                Categories
              </Link>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 text-white font-medium hover:bg-white/10 hover:text-[#FF9933] rounded-lg transition-colors cursor-pointer"
              >
                Itinerary Generator
              </Link>
            </nav>
          </div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-[72px] pb-24 sm:pt-[88px] sm:pb-28 md:pt-[100px] md:pb-36 lg:pt-[115px] lg:pb-[168px]">
          <div
            className="w-full max-w-6xl mx-auto mb-6 sm:mb-8 transform transition-all duration-1000"
            style={{
              opacity: Math.max(0, 1 - Math.max(0, scrollY - 400) / 600),
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          >
            <div className="inline-block mb-4 sm:mb-6 px-4 py-2 sm:px-8 sm:py-3 bg-white/10 backdrop-blur-xl rounded-full border-2 border-white/20 shadow-2xl">
              <span className="text-white font-bold text-xs sm:text-sm tracking-widest drop-shadow-lg">{categoryContent.badge}</span>
            </div>
            <header className="w-full px-4 sm:px-6 md:px-8 lg:px-10 mb-8 sm:mb-12 space-y-3 sm:space-y-4 text-center">
              <h1 className="block w-full text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl break-words">
                {categoryContent.title}
              </h1>
              <h3 className="block w-full max-w-full text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-display font-medium text-white/90 leading-snug drop-shadow-lg break-words text-center">
                {categoryContent.subtitle}
              </h3>
            </header>

            <div className="w-full max-w-4xl mx-auto mb-8 sm:mb-12 px-2 sm:px-4 md:px-8 lg:px-16">
              {category && categoryVideo?.kind === 'signpost' ? (
                <CategoryVideoWithEngagement
                  video={categoryVideo.video}
                  defaultThumbnail={categoryContent.image}
                />
              ) : category && categoryVideo?.kind === 'url' ? (
                <VideoPlayer
                  src={categoryVideo.url}
                  defaultThumbnail={categoryContent.image}
                  title={categoryVideo.title}
                  subtitle="Click to watch"
                  lightbox
                  generatePosterFromVideo
                  instagramUrl={MAHARASHTRA_TOURISM_INSTAGRAM}
                />
              ) : (
                <VideoPlayer
                  src={heroVideoConfig.src}
                  thumbnailUrl={heroVideoConfig.thumbnailUrl}
                  defaultThumbnail={heroVideoConfig.defaultThumbnail}
                  title={heroVideoConfig.title}
                  subtitle={heroVideoConfig.subtitle}
                  lightbox
                  instagramUrl={MAHARASHTRA_TOURISM_INSTAGRAM}
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={category ? '#itinerary' : '#explore-by-categories'}
                className="group px-8 py-4 sm:px-10 sm:py-5 bg-gradient-maharashtra hover:shadow-2xl hover:shadow-orange-500/50 text-white font-bold text-base sm:text-lg rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl"
              >
                <span className="flex items-center gap-2">
                  Explore Itinerary
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-orange-50 to-transparent z-10"></div>
      </div>

    </>
  );
}
