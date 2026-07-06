import { ArrowUpRight } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@maharashtratourismofficial',
    href: 'https://www.instagram.com/maharashtratourismofficial/',
    ariaLabel: 'Visit Maharashtra Tourism on Instagram (opens in new tab)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden className="text-white">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: '@MaharashtraTourismOfficial',
    href: 'https://www.facebook.com/MaharashtraTourismOfficial',
    ariaLabel: 'Visit Maharashtra Tourism on Facebook (opens in new tab)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'x',
    name: 'X',
    handle: '@maha_tourism',
    href: 'https://x.com/maha_tourism',
    ariaLabel: 'Visit Maharashtra Tourism on X (opens in new tab)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
] as const;

const EMAIL = {
  label: 'Email',
  value: 'diot@maharashtratourism.gov.in',
  href: 'mailto:diot@maharashtratourism.gov.in',
};

const socialCardClass =
  'group relative flex items-center gap-4 min-h-[96px] p-6 rounded-[18px] bg-[#121212] border border-white/[0.08] text-white cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#F59E0B] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(245,158,11,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ivory)]';

export function ContactSocialSection() {
  return (
    <div className="space-y-6">
      <a
        href={EMAIL.href}
        className="block bg-white rounded-2xl border hairline p-6 transition-all duration-300 ease-out hover:border-[color:var(--ink)] hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)] focus-visible:ring-offset-2 group"
      >
        <p className="eyebrow">{EMAIL.label}</p>
        <p className="mt-2 text-lg font-display text-[color:var(--ink)] group-hover:text-[color:var(--saffron)] transition-colors duration-300">
          {EMAIL.value}
        </p>
      </a>

      <div>
        <h2 className="font-display text-xl text-[color:var(--ink)] mb-4">Follow Maharashtra Tourism</h2>
        <ul className="space-y-4" aria-label="Social media links">
          {SOCIAL_LINKS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                className={socialCardClass}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-[#F59E0B] opacity-0 scale-y-75 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-y-100"
                />
                <span className="flex shrink-0 items-center justify-center w-11 h-11 text-white">{item.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold tracking-[0.08em] uppercase text-white">{item.name}</span>
                  <span className="mt-1 block text-sm font-medium text-white/90 truncate">{item.handle}</span>
                </span>
                <ArrowUpRight
                  className="w-5 h-5 shrink-0 text-white transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
