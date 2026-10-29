import rawClips from '@/data/destination-videos.json';
export type DestinationClip = {
  id: string;
  label: string;
  assetBase: string;
  source?: string;
  author: string;
  license: string;
  licenseUrl: string;
  checked?: string;
  start?: number;
  duration?: number;
  tourSlugs: string[];
  destinationSlugs: string[];
  shots?: {
    id: string;
    label: string;
    author: string;
    source: string;
    downloadUrl: string;
    license: string;
    licenseUrl: string;
    sourceFile: string;
    start: number;
    duration: number;
    focusY: number;
    timelineStart: number;
    timelineEnd: number;
    checked?: string;
  }[];
};
export const destinationVideos = rawClips as DestinationClip[];
export const videoForTour = (slug: string) =>
  destinationVideos.find((clip) => clip.tourSlugs.includes(slug));
export const videoForDestination = (slug: string) =>
  destinationVideos.find((clip) => clip.destinationSlugs.includes(slug));
