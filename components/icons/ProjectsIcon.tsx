export default function ProjectsIcon({ className }: { className?: string }) {
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
      <rect width="20" height="16" x="2" y="4" rx="3" ry="3" />
      <path d="m8 10-2 2 2 2" />
      <path d="m12 14 4-4" />
    </svg>
  );
}
