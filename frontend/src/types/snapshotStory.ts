export type SnapshotGalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export type SnapshotStory = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  coverImage: string;
  galleryImages: SnapshotGalleryImage[];
};
