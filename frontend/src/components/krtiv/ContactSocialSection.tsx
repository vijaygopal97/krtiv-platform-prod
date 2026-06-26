const SOCIAL_LINKS = [
  {
    id: 'instagram',
    name: 'Instagram',
    href: 'https://www.instagram.com/maharashtratourismofficial/',
    ariaLabel: 'Visit Maharashtra Tourism Instagram',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    ariaLabel: 'Visit Maharashtra Tourism Facebook',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'x',
    name: 'X',
    href: 'https://x.com/maha_tourism',
    ariaLabel: 'Visit Maharashtra Tourism X',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
] as const;

const EMAIL = {
  label: 'Email',
  value: 'info@maharashtratourism.com',
  href: 'mailto:info@maharashtratourism.com',
};

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
                className="flex items-center gap-4 bg-white rounded-2xl border hairline p-6 transition-all duration-300 ease-out hover:border-[color:var(--saffron)] hover:bg-[color:var(--bone)] hover:scale-[1.02] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)] focus-visible:ring-offset-2 group"
              >
                <span className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-[color:var(--ivory)] text-[color:var(--ink)] transition-colors duration-300 group-hover:text-[color:var(--saffron)] group-hover:bg-white">
                  {item.icon}
                </span>
                <span>
                  <span className="block eyebrow">{item.name}</span>
                  <span className="mt-1 block text-[15px] text-[color:var(--ink-soft)] group-hover:text-[color:var(--ink)] transition-colors duration-300">
                    @{item.id === 'x' ? 'maha_tourism' : item.id === 'instagram' ? 'maharashtratourismofficial' : 'MaharashtraTourismOfficial'}
                  </span>
                </span>
                <span className="ml-auto text-[color:var(--ink-soft)] group-hover:text-[color:var(--saffron)] transition-colors duration-300" aria-hidden>
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
