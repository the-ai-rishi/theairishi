import { readContentFile } from "./content-runtime";

export interface ChannelItem {
  id: string;
  title: string;
  description?: string;
  caption?: string;
  publishedAt: string;
  duration?: string;
  url?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  thumbnail?: string;
  tags?: string[];
  featured?: boolean;
  type?: string;
  likes?: number;
}

export type YoutubeItem = ChannelItem & { youtubeUrl: string; duration: string };
export type InstagramItem = ChannelItem & {
  caption: string;
  type: "Carousel" | "Reel" | "Single";
  instagramUrl: string;
};

export function getChannelItems(channelId: string): ChannelItem[] {
  const safe = String(channelId || "").replace(/[^a-z0-9-]/gi, "");
  if (!safe) return [];
  const filePath = `content/media/${safe}.json`;
  const raw = readContentFile(filePath);
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getYoutubeVideos(): YoutubeItem[] {
  return getChannelItems("youtube") as YoutubeItem[];
}

export function getInstagramPosts(): InstagramItem[] {
  return getChannelItems("instagram") as InstagramItem[];
}
