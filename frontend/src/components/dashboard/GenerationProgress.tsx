'use client';

import { ShekruLoader } from '@/components/krtiv/ShekruLoader';

const STEPS = [
  { label: 'Analyzing preferences', icon: '🎯' },
  { label: 'Finding locations', icon: '📍' },
  { label: 'Planning routes', icon: '🗺️' },
  { label: 'Finalizing', icon: '✨' },
];

interface GenerationProgressProps {
  /** 0–100, or undefined to show indeterminate. */
  progress?: number;
}

export default function GenerationProgress({ progress = 50 }: GenerationProgressProps) {
  const pct = Math.min(100, Math.max(0, progress));
  const currentStep = pct < 25 ? 0 : pct < 50 ? 1 : pct < 75 ? 2 : 3;

  return (
    <div className="w-full max-w-md mx-auto pointer-events-none" aria-live="polite" aria-busy="true">
      <div className="text-center mb-8">
        <ShekruLoader variant="walking" />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 mt-4">Planning your Maharashtra journey…</h3>
        <p className="text-sm text-gray-600">Shekru and our AI are crafting your itinerary</p>
      </div>

      <div className="mb-6">
        <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF9933] to-orange-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="text-lg font-bold text-[#FF9933]">{Math.round(pct)}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {STEPS.map((step, index) => (
          <div
            key={step.label}
            className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
              index === currentStep
                ? 'bg-orange-50 border-2 border-[#FF9933]/50'
                : index < currentStep
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 ${
                index === currentStep
                  ? 'bg-[#FF9933]'
                  : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
              }`}
            >
              <span className="text-xl">{step.icon}</span>
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                  index === currentStep
                    ? 'text-orange-900'
                    : index < currentStep
                      ? 'text-green-900'
                      : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < currentStep && (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {index === currentStep && (
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
