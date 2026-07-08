import { ScrollReveal } from '@/components/krtiv/ScrollReveal';

type Props = {
  title: string;
  subtitle: string;
  paragraphs: string[];
};

export function DestinationOverviewSection({ title, subtitle, paragraphs }: Props) {
  if (!paragraphs.length) return null;

  return (
    <section className="bg-[color:var(--bone)]/30 border-t hairline py-8 md:py-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <ScrollReveal className="lg:col-span-4 lg:sticky lg:top-28">
            <p className="eyebrow">Discover</p>
            <h2 className="display-md mt-4 text-balance">{title}</h2>
            <p className="mt-4 text-[color:var(--terracotta)] text-lg">{subtitle}</p>
          </ScrollReveal>
          <div className="lg:col-span-8 space-y-6">
            {paragraphs.map((para, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <p className="text-[17px] md:text-lg leading-[1.75] text-[color:var(--ink-soft)]">{para}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
