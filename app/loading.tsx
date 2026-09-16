export default function Loading() {
  return (
    <main
      id="main-content"
      className="flex min-h-[50vh] items-center justify-center bg-ink px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="font-mono text-[13px] tracking-[0.18em] uppercase text-cream/40">
        Loading
      </p>
    </main>
  );
}
