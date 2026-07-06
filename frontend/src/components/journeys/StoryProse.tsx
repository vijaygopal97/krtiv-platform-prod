'use client';

export type StorySection = {
  heading: string;
  paragraphs: string[];
};

export function StoryProse({ sections, fallback }: { sections?: StorySection[]; fallback?: string }) {
  if (sections?.length) {
    return (
      <div className="journey-prose">
        {sections.map((section) => (
          <div key={section.heading} className="journey-prose__section">
            <h3 className="journey-prose__heading">{section.heading}</h3>
            {section.paragraphs.map((para, i) => (
              <p key={i} className="journey-prose__p">
                {para}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (!fallback) return null;
  return (
    <div className="journey-prose">
      {fallback.split(/\n\n+/).map((block, i) => (
        <p key={i} className="journey-prose__p">
          {block}
        </p>
      ))}
    </div>
  );
}
