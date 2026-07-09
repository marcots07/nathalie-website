import type { Dictionary } from "@/lib/i18n";

export default function Footer({ dict }: { dict: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-sage-100 py-12">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-ink-muted">
        <p>
          &copy; {year} Nathalie González Pérez. {dict.footer.rights}
        </p>
        <p className="text-xs">{dict.footer.builtWith}</p>
      </div>
    </footer>
  );
}
