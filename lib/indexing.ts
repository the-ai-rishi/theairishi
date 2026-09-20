import { getTopicRecord, type TopicConfig } from "./config";

/**
 * A public page can exist without being a discovery surface.
 * Topics with includeInSitemap / includeInSearch set false stay off Google.
 */
export function isTopicIndexable(topicKey?: string | null): boolean {
  if (!topicKey) return true;
  const topic = getTopicRecord(topicKey) as (TopicConfig & {
    includeInSitemap?: boolean;
    includeInSearch?: boolean;
  }) | null;
  if (!topic) return true;
  if (topic.includeInSitemap === false) return false;
  if (topic.includeInSearch === false) return false;
  return true;
}

export function indexRobots(indexable: boolean) {
  return indexable
    ? { index: true, follow: true }
    : { index: false, follow: true };
}
