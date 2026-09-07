"use client";

import { motion } from "framer-motion";
import type { ProjectFinding } from "@/lib/projects";

type Props = {
  findings: ProjectFinding[];
  severityLabels: Record<string, string>;
  recommendationLabel: string;
};

const SEVERITY_STYLE: Record<string, string> = {
  low: "bg-sage-100 text-sage-700",
  medium: "bg-terracotta-300/40 text-terracotta-700",
  high: "bg-terracotta-400/50 text-terracotta-700",
};

/**
 * One card per usability-study finding — a claim backed by what
 * participants actually did or said, not a design opinion floating on its
 * own. The optional quote renders like the site's other blockquotes so a
 * verbatim line from a session reads as evidence, not decoration.
 */
export default function UsabilityFindings({
  findings,
  severityLabels,
  recommendationLabel,
}: Props) {
  return (
    <div className="space-y-8">
      {findings.map((f, i) => {
        const key = f.severity.toLowerCase();
        const badgeClass = SEVERITY_STYLE[key] ?? "bg-sage-100 text-sage-700";
        const severityText = severityLabels[key] ?? f.severity;
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="rounded-2xl border border-sage-100 bg-cream-50/60 p-6 md:p-7"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="font-display text-xl md:text-2xl text-ink leading-snug">
                {f.title}
              </h3>
              <span
                className={`text-[10px] font-label uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shrink-0 ${badgeClass}`}
              >
                {severityText}
              </span>
            </div>

            {f.quote && (
              <blockquote className="mt-4 pl-5 border-l-2 border-sage-300 font-display italic text-lg text-ink-soft leading-snug">
                &ldquo;{f.quote}&rdquo;
              </blockquote>
            )}

            <p className="mt-4 text-xs font-label uppercase tracking-[0.24em] text-sage-700">
              {recommendationLabel}
            </p>
            <p className="mt-2 text-ink-soft leading-relaxed">{f.recommendation}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
