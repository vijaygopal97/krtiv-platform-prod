const FOOTER_SOCIAL = [
  {
    id: 'instagram',
    name: 'Instagram',
    href: 'https://www.instagram.com/maharashtratourismofficial/',
    ariaLabel: 'Maharashtra Tourism on Instagram (opens in new tab)',
    iconClass: 'text-[#E4405F] hover:shadow-[0_0_16px_rgba(228,64,95,0.45)]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    href: 'https://www.facebook.com/MaharashtraTourismOfficial',
    ariaLabel: 'Maharashtra Tourism on Facebook (opens in new tab)',
    iconClass: 'text-[#1877F2] hover:shadow-[0_0_16px_rgba(24,119,242,0.45)]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    href: 'https://x.com/maha_tourism',
    ariaLabel: 'Maharashtra Tourism on X (opens in new tab)',
    iconClass: 'text-white hover:shadow-[0_0_16px_rgba(255,255,255,0.35)]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
] as const;

export function FooterSocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul
      className={`flex flex-wrap items-center gap-4 sm:gap-5 ${className}`}
      aria-label="Social media"
    >
      {FOOTER_SOCIAL.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.ariaLabel}
            title={item.name}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ink)] ${item.iconClass}`}
          >
            {item.icon}
            <span className="sr-only">{item.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
