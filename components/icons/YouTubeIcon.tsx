export default function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className || "h-6 w-6 text-violet-400"}
    >
      <rect width="20" height="15" x="2" y="4.5" rx="4" ry="4" />
      <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" fillOpacity={0.2} />
    </svg>
  );
}
