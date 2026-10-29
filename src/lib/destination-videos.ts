import clips from '@/data/destination-videos.json';
export const destinationVideos = clips;
export type DestinationClip = (typeof clips)[number];
export const videoForTour = (slug: string) =>
  clips.find((clip) => clip.tourSlugs.includes(slug));
export const videoForDestination = (slug: string) =>
  clips.find((clip) => clip.destinationSlugs.includes(slug));
