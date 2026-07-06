import Link from 'next/link';

export function DashboardLuxuryFooter() {
  return (
    <footer className="mt-16 border-t border-[color:var(--lux-border)] bg-[color:var(--lux-card)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-display-lux text-lg">Quick links</p>
          <ul className="mt-3 space-y-2 text-[color:var(--lux-muted)]">
            <li>
              <Link href="/explore" className="hover:text-[color:var(--lux-primary)]">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/dashboard?tab=builder" className="hover:text-[color:var(--lux-primary)]">
                AI Planner
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[color:var(--lux-primary)]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display-lux text-lg">Support</p>
          <p className="mt-3 text-[color:var(--lux-muted)] leading-relaxed">
            Maharashtra Tourism dashboard — plan, save, and download itineraries powered by AI.
          </p>
        </div>
        <div>
          <p className="font-display-lux text-lg">Stay connected</p>
          <p className="mt-3 text-[color:var(--lux-muted)]">© {new Date().getFullYear()} Developed by eFlag Corp</p>
        </div>
      </div>
    </footer>
  );
}
