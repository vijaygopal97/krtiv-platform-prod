"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lightweight scroll-reveal wrapper. Uses IntersectionObserver to toggle a
 * CSS class — only transforms & opacity, so it never causes layout thrash.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.setTimeout(() => setOn(true), delay);
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [delay]);

  const Tag = As as any;
  return (
    <Tag
      ref={ref as any}
      className={`reveal ${on ? "reveal-on" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
