/**
 * Ad placement container. Replace children or set data-ad-slot in layout
 * with your ad network script (e.g. GPT, AdSense).
 */
export default function AdSlot({
  id,
  label,
  className = "",
  minHeight = "90px",
}) {
  return (
    <aside
      id={id}
      data-ad-slot={id}
      className={`ad-slot flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-700/60 bg-zinc-900/50 ${className}`}
      style={{ minHeight }}
      aria-label={label}
    >
      <span className="pointer-events-none select-none text-xs font-medium uppercase tracking-wider text-zinc-600">
        {label}
      </span>
    </aside>
  );
}
