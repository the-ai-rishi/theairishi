export default function Loading() {
  return (
    <main
      id="main-content"
      className="glass-stage flex min-h-[50vh] items-center justify-center px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="glass-sheet px-6 py-4 font-mono text-[13px] tracking-[0.18em] uppercase text-cream/40">
        Loading
      </p>
    </main>
  );
}
