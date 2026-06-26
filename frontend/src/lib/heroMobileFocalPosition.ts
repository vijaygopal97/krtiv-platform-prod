/**
 * Mobile hero background focal positioning (<768px).
 * Revert: set HERO_MOBILE_FOCAL_FIX_ENABLED = false and remove hero-mobile.css import.
 */
export const HERO_MOBILE_FOCAL_FIX_ENABLED = true;

export const HERO_MOBILE_MAX_WIDTH = 767;

export function isMobileHeroViewport(width: number) {
  return width <= HERO_MOBILE_MAX_WIDTH;
}

export function getMobileFocalAnchor(isLandscape: boolean) {
  return {
    anchorX: 50,
    anchorY: isLandscape ? 44 : 36,
  };
}

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
  isLandscape?: boolean;
};

export function getHeroFocalStyles({
  containerW,
  containerH,
  imageW,
  imageH,
  focalX,
  focalY,
  isMobile,
  isLandscape = false,
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

  const { anchorX, anchorY } = getMobileFocalAnchor(isLandscape);
  const { x, y } = computeCoverObjectPosition(
    containerW,
    containerH,
    imageW,
    imageH,
    fx,
    fy,
    anchorX,
    anchorY,
  );

  return {
    objectPosition: `${x}% ${y}%`,
    transformOrigin: `${fx}% ${fy}%`,
    useMobileFocal: true,
  };
}
