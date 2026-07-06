export type TravelStorySlide = {
  image: string;
  title: string;
  caption: string;
  location: string;
};

export type TravelStoryDestination = {
  id: string;
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  avatarImage: string;
  highlight: string;
  description: string;
  stories: TravelStorySlide[];
};
