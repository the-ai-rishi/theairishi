/** Display labels. URLs and filenames stay zero-padded (day-01). */

export function formatDayLabel(day: number): string {
  return `Day ${day}`;
}

export function formatPhaseLabel(number: number): string {
  return `Phase ${number}`;
}

export function daySlug(day: number): string {
  return `day-${String(day).padStart(2, "0")}`;
}
