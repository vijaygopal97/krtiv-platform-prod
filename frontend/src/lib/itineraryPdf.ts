import type { ParsedItinerary } from '@/lib/parseItinerary';
import type { ItineraryExtras } from '@/lib/itineraryExtras';
import { krtivLogo } from '@/lib/krtivPaths';

export type ItineraryPdfInput = {
  title: string;
  parsed: ParsedItinerary;
  rawText: string;
  extras: ItineraryExtras;
  keywords: string[];
  categoryFocus: string;
  userName?: string;
};

const SLOT_LABELS: Record<string, string> = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absoluteUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const origin = window.location.origin;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

function hasMeaningfulItinerary(input: ItineraryPdfInput): boolean {
  const raw = (input.rawText || '').trim();
  const dayCount = input.parsed?.days?.length ?? 0;
  if (dayCount > 0) return true;
  if (raw.length >= 80) return true;
  return false;
}

export function validateItineraryForPdf(input: ItineraryPdfInput): { ok: true } | { ok: false; message: string } {
  if (!input.title?.trim() && !input.parsed?.theme) {
    return { ok: false, message: 'Please generate an itinerary before downloading.' };
  }
  if (!hasMeaningfulItinerary(input)) {
    return { ok: false, message: 'Please generate an itinerary before downloading.' };
  }
  return { ok: true };
}

function activitiesHtml(activities: string): string {
  const text = (activities || '').trim();
  if (!text) return '';
  const parts = text.split(/[,;]|\n/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return `<p class="activities">${escapeHtml(text)}</p>`;
  }
  return `<ul class="activities">${parts.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>`;
}

function dayScheduleHtml(parsed: ParsedItinerary): string {
  if (!parsed.days?.length) return '';
  return parsed.days
    .map((day) => {
      const slots = (day.slots || [])
        .map((slot) => {
          const label = SLOT_LABELS[slot.time] || slot.time;
          return `
          <div class="slot">
            <h4>${escapeHtml(label)}</h4>
            ${slot.location ? `<p class="location"><strong>${escapeHtml(slot.location)}</strong>${slot.duration ? ` · ${escapeHtml(slot.duration)}` : ''}</p>` : ''}
            ${activitiesHtml(slot.activities)}
            ${slot.why ? `<p class="why">${escapeHtml(slot.why)}</p>` : ''}
          </div>`;
        })
        .join('');
      return `
      <section class="day-block">
        <h3>Day ${day.dayNum}${day.baseCity ? ` — ${escapeHtml(day.baseCity)}` : ''}</h3>
        ${slots || '<p class="muted">Schedule details for this day are not available.</p>'}
      </section>`;
    })
    .join('');
}

function rawFallbackHtml(raw: string): string {
  const text = (raw || '').trim();
  if (!text) return '';
  return `<section class="section"><h2>Itinerary details</h2><pre class="raw-fallback">${escapeHtml(text)}</pre></section>`;
}

function recommendationBlock(label: string, value: string): string {
  if (!value?.trim()) return '';
  return `
  <div class="rec">
    <h4>${escapeHtml(label)}</h4>
    <p>${escapeHtml(value.trim())}</p>
  </div>`;
}

export function buildItineraryPrintDocument(input: ItineraryPdfInput): string {
  const generatedAt = new Date();
  const dateStr = generatedAt.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = generatedAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const logo = absoluteUrl(krtivLogo());
  const durationDays = input.parsed.days?.length
    ? `${input.parsed.days.length} day${input.parsed.days.length === 1 ? '' : 's'}`
    : '—';
  const theme = input.parsed.theme || input.title;
  const region = input.parsed.region || 'Maharashtra';
  const keywords = (input.keywords || []).filter(Boolean);
  const schedule = dayScheduleHtml(input.parsed);
  const scheduleOrRaw = schedule || rawFallbackHtml(input.rawText);

  const recommendations = [
    recommendationBlock('Best time to visit', input.extras.bestTimeToVisit),
    recommendationBlock('Travel tips & packing suggestions', input.extras.travelTips),
    recommendationBlock('Food recommendations', input.extras.foodRecommendations),
    recommendationBlock('Nearby attractions', input.extras.nearbyPlaces),
    recommendationBlock('Related destinations', input.extras.relatedDestinations),
    recommendationBlock('Hidden gems', input.extras.hiddenGems),
    recommendationBlock('Similar experiences', input.extras.similarExperiences),
    recommendationBlock('Estimated budget', input.extras.estimatedBudget),
  ].join('');

  const interestsHtml =
    keywords.length > 0
      ? `<ul class="tags">${keywords.map((k) => `<li>${escapeHtml(k)}</li>`).join('')}</ul>`
      : '<p class="muted">No interest tags selected.</p>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.title)} — Maharashtra Tourism</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: "Georgia", "Times New Roman", serif;
      color: #1a1a1a;
      margin: 0;
      padding: 0;
      background: #fff;
      font-size: 11pt;
      line-height: 1.45;
    }
    .page {
      max-width: 720px;
      margin: 0 auto;
      padding: 20mm 16mm 24mm;
    }
    header.doc-header {
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 2px solid #c45c26;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    header.doc-header img {
      width: 72px;
      height: 72px;
      object-fit: contain;
    }
    header.doc-header h1 {
      font-size: 20pt;
      margin: 0 0 4px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    header.doc-header .sub {
      font-size: 10pt;
      color: #555;
      margin: 0;
    }
    h2.section-title {
      font-size: 13pt;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #c45c26;
      border-bottom: 1px solid #e8e4dc;
      padding-bottom: 6px;
      margin: 24px 0 12px;
    }
    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      font-size: 10.5pt;
    }
    .overview-grid dt { font-weight: 600; color: #444; margin: 0; }
    .overview-grid dd { margin: 0 0 8px; }
    ul.tags {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    ul.tags li {
      background: #fef3e8;
      border: 1px solid #e8c9a8;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 10pt;
    }
    .day-block {
      page-break-inside: avoid;
      margin-bottom: 18px;
      border: 1px solid #e5e2db;
      border-radius: 8px;
      overflow: hidden;
    }
    .day-block h3 {
      margin: 0;
      padding: 10px 14px;
      background: #f5f3ee;
      font-size: 12pt;
      border-bottom: 1px solid #e5e2db;
    }
    .slot {
      padding: 10px 14px;
      border-bottom: 1px solid #f0eeea;
    }
    .slot:last-child { border-bottom: none; }
    .slot h4 {
      margin: 0 0 6px;
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #c45c26;
    }
    .location { margin: 0 0 4px; font-size: 11pt; }
    ul.activities { margin: 4px 0 0 18px; padding: 0; }
    ul.activities li { margin-bottom: 2px; }
    .why { margin: 6px 0 0; font-size: 9.5pt; color: #666; font-style: italic; }
    .rec { margin-bottom: 12px; page-break-inside: avoid; }
    .rec h4 { margin: 0 0 4px; font-size: 10.5pt; color: #333; }
    .rec p { margin: 0; white-space: pre-wrap; font-size: 10pt; color: #444; }
    .muted { color: #888; font-size: 10pt; }
    pre.raw-fallback {
      white-space: pre-wrap;
      font-family: ui-monospace, monospace;
      font-size: 9pt;
      background: #faf9f7;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e5e2db;
    }
    footer.doc-footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e5e2db;
      text-align: center;
      font-size: 9pt;
      color: #666;
      page-break-inside: avoid;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 12mm 14mm 18mm; max-width: none; }
      @page {
        size: A4;
        margin: 14mm 12mm;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="doc-header">
      <img src="${escapeHtml(logo)}" alt="Maharashtra Tourism" />
      <div>
        <h1>Maharashtra Tourism</h1>
        <p class="sub">Your personalized travel itinerary</p>
        <p class="sub">Generated ${escapeHtml(dateStr)}${input.userName ? ` · Prepared for ${escapeHtml(input.userName)}` : ''}</p>
      </div>
    </header>

    <h2 class="section-title">Selected interests</h2>
    ${interestsHtml}

    <h2 class="section-title">Itinerary overview</h2>
    <dl class="overview-grid">
      <dt>Title</dt><dd>${escapeHtml(input.title)}</dd>
      <dt>Category</dt><dd>${escapeHtml(input.categoryFocus || 'Maharashtra Tourism')}</dd>
      <dt>Duration</dt><dd>${escapeHtml(durationDays)}</dd>
      <dt>Region</dt><dd>${escapeHtml(region)}</dd>
      <dt>Travel theme</dt><dd>${escapeHtml(theme)}</dd>
    </dl>

    <h2 class="section-title">Day-wise schedule</h2>
    ${scheduleOrRaw}

    <h2 class="section-title">Recommendations</h2>
    ${recommendations || '<p class="muted">No additional recommendations were included in this itinerary.</p>'}

    <footer class="doc-footer">
      <p><strong>Generated by Krtiv.ai</strong></p>
      <p>Maharashtra Tourism Platform</p>
      <p>${escapeHtml(dateStr)} at ${escapeHtml(timeStr)}</p>
    </footer>
  </div>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () {
        try { window.focus(); window.print(); } catch (e) {}
      }, 350);
    });
  </script>
</body>
</html>`;
}

/**
 * Opens a print-ready document (Save as PDF in browser). Never writes blank files silently.
 */
export function downloadItineraryPdf(input: ItineraryPdfInput): { ok: true } | { ok: false; message: string } {
  const validation = validateItineraryForPdf(input);
  if (!validation.ok) return validation;

  const html = buildItineraryPrintDocument(input);
  let printed = false;

  const triggerPrint = (target: Window) => {
    if (printed) return;
    printed = true;
    try {
      target.focus();
      target.print();
    } catch {
      printed = false;
    }
  };

  try {
    const win = window.open('', '_blank');
    if (!win) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('title', 'Itinerary PDF');
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow;
      if (!doc) {
        document.body.removeChild(iframe);
        return { ok: false, message: 'Unable to generate PDF. Please try again.' };
      }
      doc.document.open();
      doc.document.write(html);
      doc.document.close();
      iframe.onload = () => {
        triggerPrint(doc);
        window.setTimeout(() => document.body.removeChild(iframe), 2000);
      };
      window.setTimeout(() => triggerPrint(doc), 800);
      return { ok: true };
    }

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.onload = () => triggerPrint(win);
    window.setTimeout(() => triggerPrint(win), 800);
    return { ok: true };
  } catch {
    return { ok: false, message: 'Unable to generate PDF. Please try again.' };
  }
}
