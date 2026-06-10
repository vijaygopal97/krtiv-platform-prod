import Link from 'next/link';
import { assetPath } from '@/lib/basePath';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Same orange/saffron family as CTA — deepens to dark orange, no red */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-600 via-orange-700 to-orange-900"></div>
      <div className="absolute inset-0 bg-pattern-warli opacity-10"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
                         radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0, 0, 0, 0.15) 0%, transparent 50%)`
      }}></div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={assetPath('/maharashtra-logo.png')}
              alt="Maharashtra Tourism"
              className="w-12 h-12 object-contain"
            />
            <span className="text-white font-display font-bold text-lg md:text-xl">Maharashtra Tourism</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <Link
              href="/dashboard"
              className="text-orange-100 hover:text-white transition-colors font-medium cursor-pointer"
            >
              Itinerary Builder
            </Link>
            <Link
              href="/about"
              className="text-orange-100 hover:text-white transition-colors font-medium cursor-pointer"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-orange-100 hover:text-white transition-colors font-medium cursor-pointer"
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-white/15 text-center">
          <p className="text-orange-200/90 text-sm">
            Developed by <span className="text-white font-semibold">Convergent x SignPost</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
