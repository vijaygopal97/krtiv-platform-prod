/**
 * Mobile hero focal-point fix.
 * Set to false to revert to legacy object-position (focalX% focalY%) everywhere.
 */
export const HERO_MOBILE_FOCAL_FIX_ENABLED = true;

const MOBILE_MAX_WIDTH = 767;

export function isMobileHeroViewport(width: number) {
  return width <= MOBILE_MAX_WIDTH;
}

/**
 * Place the image focal point at `anchor` within the container under object-fit: cover.
 */
export function computeCoverObjectPosition(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  focalXPercent: number,
  focalYPercent: number,
  anchorXPercent = 50,
  anchorYPercent = 50,
): { x: number; y: number } {
  if (!containerW || !containerH || !imageW || !imageH) {
    return { x: focalXPercent, y: focalYPercent };
  }

  const scale = Math.max(containerW / imageW, containerH / imageH);
  const renderedW = imageW * scale;
  const renderedH = imageH * scale;

  const fx = (focalXPercent / 100) * renderedW;
  const fy = (focalYPercent / 100) * renderedH;
  const ax = (anchorXPercent / 100) * containerW;
  const ay = (anchorYPercent / 100) * containerH;

  let x = 50;
  let y = 50;

  const overflowX = renderedW - containerW;
  if (overflowX > 0.5) {
    x = ((fx - ax) / overflowX) * 100;
    x = Math.max(0, Math.min(100, x));
  }

  const overflowY = renderedH - containerH;
  if (overflowY > 0.5) {
    y = ((fy - ay) / overflowY) * 100;
    y = Math.max(0, Math.min(100, y));
  }

  return { x, y };
}

export type HeroFocalStyleInput = {
  containerW: number;
  containerH: number;
  imageW: number;
  imageH: number;
  focalX: number;
  focalY: number;
  isMobile: boolean;
};

export function getHeroFocalStyles({
  containerW,
  containerH,
  imageW,
  imageH,
  focalX,
  focalY,
  isMobile,
}: HeroFocalStyleInput): {
  objectPosition: string;
  transformOrigin: string;
  useMobileFocal: boolean;
} {
  const fx = focalX ?? 50;
  const fy = focalY ?? 50;

  if (!HERO_MOBILE_FOCAL_FIX_ENABLED || !isMobile || !imageW || !imageH) {
    return {
      objectPosition: `${fx}% ${fy}%`,
      transformOrigin: `${fx}% ${fy}%`,
      useMobileFocal: false,
    };
  }

  // Anchor slightly above center so the subject stays above bottom hero copy.
  const { x, y } = computeCoverObjectPosition(
    containerW,
    containerH,
    imageW,
    imageH,
    fx,
    fy,
    50,
    42,
  );

  return {
    objectPosition: `${x}% ${y}%`,
    transformOrigin: `${fx}% ${fy}%`,
    useMobileFocal: true,
  };
}
