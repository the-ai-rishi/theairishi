export type ContentPresentation =
  | "magazine"
  | "lab"
  | "journal"
  | "timeline"
  | "conversation"
  | "media";

export interface ContentSourceLike {
  kind?: string;
  format?: string;
  topicId?: string;
  channelId?: string;
  id?: string;
}

function inferHomogeneousFormat(items?: Array<{ type?: string }>): string {
  if (!items || items.length === 0) return "";
  const types = new Set(
    items.map((item) => String(item.type || "").toLowerCase()).filter(Boolean)
  );
  if (types.size === 1) return [...types][0];
  return "";
}

/**
 * Infer a format-specific homepage presentation from section source + items.
 * Never switches on frozen section ids.
 */
export function presentationForContentList(
  source?: ContentSourceLike,
  items?: Array<{ type?: string }>
): ContentPresentation {
  const kind = String(source?.kind || "").toLowerCase();
  const format = String(source?.format || inferHomogeneousFormat(items) || "").toLowerCase();

  if (kind === "recent") return "journal";
  if (format === "guide" || format === "guides") return "magazine";
  if (format === "project" || format === "projects") return "lab";
  if (format === "update" || format === "updates") return "timeline";
  if (format === "interview") return "conversation";
  if (format === "youtube" || format === "instagram") return "media";
  if (kind === "channel") return "media";
  return "journal";
}

export function sectionAnchorId(
  type: string,
  source?: ContentSourceLike,
  items?: Array<{ type?: string }>
): string {
  if (type === "course-list") return "learn";
  if (type === "topic-grid") return "explore";
  if (type === "channel-grid") return "watch";
  if (type === "cta") return "close";
  if (type === "continue-learning") return "continue";
  if (type === "content-list") {
    const presentation = presentationForContentList(source, items);
    if (presentation === "magazine") return "read";
    if (presentation === "lab") return "build";
    if (presentation === "journal") return "desk";
    if (presentation === "timeline") return "feed";
    if (presentation === "conversation") return "voices";
    if (presentation === "media") return "watch";
  }
  return type;
}
