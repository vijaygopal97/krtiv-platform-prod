import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  className?: string;
};

export function PageBreadcrumb({ items, className = '' }: Props) {
  return (
    <nav
      className={`relative z-[1] px-4 sm:px-6 md:px-10 py-2 text-xs sm:text-[12px] text-[color:var(--ink-soft)] max-w-[1440px] mx-auto bg-[color:var(--ivory)] ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap gap-x-2 gap-y-1 items-center">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-x-2">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[color:var(--saffron)]">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-[color:var(--ink)]' : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
