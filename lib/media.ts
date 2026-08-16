import fs from "fs";
import path from "path";

const mediaDir = path.join(process.cwd(), "content", "media");

export interface YoutubeItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  youtubeUrl: string;
  thumbnail?: string;
  tags?: string[];
  featured?: boolean;
}

export interface InstagramItem {
  id: string;
  title: string;
  caption: string;
  publishedAt: string;
  type: "Carousel" | "Reel" | "Single";
  instagramUrl: string;
  thumbnail?: string;
  likes?: number;
  featured?: boolean;
}

export function getYoutubeVideos(): YoutubeItem[] {
  const filePath = path.join(mediaDir, "youtube.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getInstagramPosts(): InstagramItem[] {
  const filePath = path.join(mediaDir, "instagram.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
