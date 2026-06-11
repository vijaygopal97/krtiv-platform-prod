export type HeroSlideRecord = {
  _id?: string;
  imageUrl: string;
  alt?: string;
  focalX?: number;
  focalY?: number;
  kicker?: string;
  title: string;
  description?: string;
  scope?: string;
  sortOrder?: number;
  active?: boolean;
};

export type HeroAsset = {
  url: string;
  label: string;
};
