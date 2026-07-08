'use client';

import { AiTripPlannerWizard } from '@/components/planner/AiTripPlannerWizard';
import { PlannerAmbientProvider } from '@/components/planner/PlannerAmbientContext';
import { PlannerTravelAmbient } from '@/components/planner/PlannerTravelAmbient';
import '@/styles/planner-interactions.css';
import '@/styles/planner-travel-ambient.css';

export function FloatingInterestBubbles() {
  return (
    <PlannerAmbientProvider>
      <section
        id="floating-interest-bubbles"
        className="planner-section-premium planner-section-enter relative overflow-hidden scroll-mt-24 py-8 md:py-12 pb-14 md:pb-12 px-4 md:px-8 border-b hairline"
        aria-labelledby="fib-heading"
      >
        <PlannerTravelAmbient />

        <div className="relative z-10 max-w-5xl mx-auto text-center mb-5 md:mb-6">
          <p className="planner-heading-enter eyebrow text-[color:var(--saffron)]">AI travel planner</p>
          <h2
            id="fib-heading"
            className="planner-heading-enter-delay font-display text-3xl md:text-[2.5rem] mt-3 text-[color:var(--ink)] text-balance"
          >
            Plan your Maharashtra journey
          </h2>
          <p
            className="planner-heading-enter-delay lede mt-4 text-[color:var(--ink-soft)] max-w-2xl mx-auto"
            style={{ animationDelay: '0.22s' }}
          >
            Answer a few questions — no sign-in required. We&apos;ll generate a day-by-day itinerary you can save later.
          </p>
        </div>

        <div className="relative z-10 planner-form-stack">
          <AiTripPlannerWizard
            onGenerated={() => {
              document.getElementById('floating-interest-bubbles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        </div>
      </section>
    </PlannerAmbientProvider>
  );
}
