type Props = {
  highlight: string;
  /** Center within hero (circuit pages + home). */
  centered?: boolean;
  className?: string;
};

/**
 * Premium hero line: "You will find {highlight} here" with orange underline on keyword.
 */
export function LuxuryHeroHeading({ highlight, centered = false, className = '' }: Props) {
  return (
    <h1
      className={`luxury-hero-heading ${centered ? 'luxury-hero-heading--center' : ''} ${className}`}
    >
      <span className="luxury-hero-heading__line">
        You will find{' '}
        <span className="luxury-hero-heading__keyword">
          <span className="luxury-hero-heading__keyword-text">{highlight}</span>
          <span className="luxury-hero-heading__underline" aria-hidden />
        </span>{' '}
        here
      </span>
    </h1>
  );
}
