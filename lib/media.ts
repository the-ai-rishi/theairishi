import fs from "fs";
import path from "path";

const mediaDir = path.join(process.cwd(), "content", "media");

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
  const filePath = path.join(mediaDir, `${safe}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
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
