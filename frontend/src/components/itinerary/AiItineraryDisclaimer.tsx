'use client';

type Props = {
  className?: string;
};

/**
 * Subtle, footnote-style AI transparency note. Shown small and muted at the
 * bottom of an itinerary — no warning icon, just an asterisk.
 */
export default function AiItineraryDisclaimer({ className = '' }: Props) {
  return (
    <p
      role="note"
      aria-label="AI-generated itinerary disclaimer"
      className={`text-[11px] leading-relaxed text-gray-400 ${className}`}
    >
      <span aria-hidden className="mr-0.5">*</span>
      AI-generated itinerary.
    </p>
  );
}
