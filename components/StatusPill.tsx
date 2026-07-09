type Props = {
  label: string;
  tone?: "cream" | "sage";
};

/**
 * Small pill used to badge in-progress projects. Editorial, low-contrast,
 * uses the same pastel tokens as the rest of the site so it doesn't scream.
 */
export default function StatusPill({ label, tone = "sage" }: Props) {
  const cls =
    tone === "sage"
      ? "bg-sage-100 text-sage-700 border-sage-200"
      : "bg-cream-50/90 backdrop-blur text-sage-700 border-sage-200";
  return (
    <span
      className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] border rounded-full px-3 py-1 ${cls}`}
    >
      <span className="relative flex w-1.5 h-1.5">
        <span className="absolute inset-0 rounded-full bg-terracotta-500 animate-ping opacity-40" />
        <span className="relative w-1.5 h-1.5 rounded-full bg-terracotta-500" />
      </span>
      {label}
    </span>
  );
}
