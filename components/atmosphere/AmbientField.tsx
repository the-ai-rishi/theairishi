/** Static atmosphere shared across pages. No canvas, no animation. */
export default function AmbientField() {
  return (
    <div className="ambient-field" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-orbit" />
    </div>
  );
}
