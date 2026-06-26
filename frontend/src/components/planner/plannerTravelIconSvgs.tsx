import type { ReactNode, SVGProps } from 'react';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

type P = SVGProps<SVGSVGElement> & { size?: number };

function S({ size = 48, className, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export function PlannerTravelIcon({ id, size = 48, className }: { id: string; size?: number; className?: string }) {
  switch (id) {
    case 'compass':
      return (
        <S size={size} className={className}>
          <circle cx="24" cy="24" r="14" {...stroke} />
          <path d="M24 10 L28 28 L24 24 L20 28 Z" {...stroke} />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
        </S>
      );
    case 'plane':
      return (
        <S size={size} className={className}>
          <path d="M8 28 L40 16 L26 26 L28 38 L22 32 L14 34 Z" {...stroke} />
        </S>
      );
    case 'temple':
      return (
        <S size={size} className={className}>
          <path d="M24 8 L38 20 L10 20 Z" {...stroke} />
          <rect x="14" y="20" width="20" height="18" rx="1" {...stroke} />
          <path d="M18 38 L18 28 M24 38 L24 26 M30 38 L30 28" {...stroke} />
        </S>
      );
    case 'fort':
      return (
        <S size={size} className={className}>
          <rect x="10" y="18" width="28" height="22" {...stroke} />
          <path d="M10 18 L14 12 L18 18 M30 18 L34 12 L38 18" {...stroke} />
          <rect x="20" y="28" width="8" height="12" {...stroke} />
        </S>
      );
    case 'camera':
      return (
        <S size={size} className={className}>
          <rect x="8" y="16" width="32" height="22" rx="3" {...stroke} />
          <circle cx="24" cy="27" r="6" {...stroke} />
          <path d="M16 16 L20 10 L28 10 L32 16" {...stroke} />
        </S>
      );
    case 'pin':
      return (
        <S size={size} className={className}>
          <path d="M24 6 C16 6 12 14 12 20 C12 30 24 42 24 42 C24 42 36 30 36 20 C36 14 32 6 24 6 Z" {...stroke} />
          <circle cx="24" cy="20" r="4" {...stroke} />
        </S>
      );
    case 'map':
      return (
        <S size={size} className={className}>
          <path d="M10 12 L18 10 L30 14 L38 12 L38 36 L30 38 L18 34 L10 36 Z" {...stroke} />
          <path d="M18 10 L18 34 M30 14 L30 38" {...stroke} />
        </S>
      );
    case 'sparkle-a':
    case 'sparkle-b':
    case 'sparkle-c':
    case 'sparkle-d':
      return (
        <S size={size} className={className}>
          <path d="M24 6 L26 22 L42 24 L26 26 L24 42 L22 26 L6 24 L22 22 Z" {...stroke} />
        </S>
      );
    case 'mountain':
      return (
        <S size={size} className={className}>
          <path d="M6 38 L18 14 L26 28 L34 18 L42 38 Z" {...stroke} />
          <path d="M30 22 L34 18 L38 24" {...stroke} />
        </S>
      );
    case 'beach':
      return (
        <S size={size} className={className}>
          <path d="M6 32 Q24 20 42 32" {...stroke} />
          <circle cx="36" cy="12" r="5" {...stroke} />
          <path d="M8 38 L42 38" {...stroke} />
        </S>
      );
    case 'forest':
      return (
        <S size={size} className={className}>
          <path d="M24 8 L32 22 L28 22 L34 38 L14 38 L20 22 L16 22 Z" {...stroke} />
        </S>
      );
    case 'train':
      return (
        <S size={size} className={className}>
          <rect x="10" y="14" width="28" height="20" rx="4" {...stroke} />
          <path d="M14 34 L14 38 M34 34 L34 38 M10 38 L38 38" {...stroke} />
          <circle cx="18" cy="38" r="2" fill="currentColor" />
          <circle cx="30" cy="38" r="2" fill="currentColor" />
        </S>
      );
    case 'backpack':
      return (
        <S size={size} className={className}>
          <path d="M16 18 C16 12 32 12 32 18 L34 38 L14 38 Z" {...stroke} />
          <path d="M20 18 L20 14 C20 10 28 10 28 14 L28 18" {...stroke} />
        </S>
      );
    case 'peacock':
      return (
        <S size={size} className={className}>
          <path d="M24 10 C30 10 34 16 34 22 C34 30 24 40 24 40 C24 40 14 30 14 22 C14 16 18 10 24 10 Z" {...stroke} />
          <circle cx="24" cy="22" r="3" {...stroke} />
        </S>
      );
    case 'dhol':
      return (
        <S size={size} className={className}>
          <ellipse cx="24" cy="26" rx="14" ry="10" {...stroke} />
          <path d="M10 26 L6 20 M38 26 L42 20" {...stroke} />
        </S>
      );
    case 'sunrise':
      return (
        <S size={size} className={className}>
          <path d="M24 32 C16 32 12 26 12 22 C12 16 17 12 24 12 C31 12 36 16 36 22 C36 26 32 32 24 32 Z" {...stroke} />
          <path d="M24 6 L24 10 M8 14 L11 17 M40 14 L37 17 M6 24 L10 24 M38 24 L42 24" {...stroke} />
        </S>
      );
    case 'culinary':
      return (
        <S size={size} className={className}>
          <path d="M14 10 L14 28 C14 34 20 38 24 38 C28 38 34 34 34 28 L34 10" {...stroke} />
          <path d="M10 10 L10 22 C10 26 12 28 14 28 M38 10 L38 22 C38 26 36 28 34 28" {...stroke} />
        </S>
      );
    case 'palette':
      return (
        <S size={size} className={className}>
          <path d="M28 8 C38 8 42 18 38 28 C34 38 20 40 12 34 C8 30 8 22 14 18 C18 14 22 8 28 8 Z" {...stroke} />
          <circle cx="20" cy="22" r="2" fill="currentColor" />
          <circle cx="28" cy="18" r="2" fill="currentColor" />
          <circle cx="32" cy="26" r="2" fill="currentColor" />
        </S>
      );
    case 'skyline':
      return (
        <S size={size} className={className}>
          <path d="M6 38 L6 22 L12 22 L12 14 L18 14 L18 26 L24 10 L30 20 L30 16 L36 16 L36 38 Z" {...stroke} />
        </S>
      );
    case 'rings':
      return (
        <S size={size} className={className}>
          <circle cx="20" cy="26" r="8" {...stroke} />
          <circle cx="28" cy="26" r="8" {...stroke} />
          <path d="M20 18 L28 18" {...stroke} />
        </S>
      );
    case 'binoculars':
      return (
        <S size={size} className={className}>
          <circle cx="17" cy="24" r="7" {...stroke} />
          <circle cx="31" cy="24" r="7" {...stroke} />
          <path d="M24 24 L24 20 M14 18 L10 14 M34 18 L38 14" {...stroke} />
        </S>
      );
    case 'warli':
      return (
        <S size={size} className={className}>
          <circle cx="24" cy="14" r="4" {...stroke} />
          <path d="M24 18 L24 28 M16 38 L24 28 L32 38 M12 38 L36 38" {...stroke} />
          <path d="M10 32 L18 26 M38 32 L30 26" {...stroke} />
        </S>
      );
    default:
      return (
        <S size={size} className={className}>
          <circle cx="24" cy="24" r="10" {...stroke} />
        </S>
      );
  }
}
