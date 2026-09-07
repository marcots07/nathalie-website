"use client";

import { motion } from "framer-motion";
import type { ProjectPersona } from "@/lib/projects";

type Props = {
  persona: ProjectPersona;
  goalsLabel: string;
  frustrationsLabel: string;
};

/**
 * A named persona anchoring the research — deliberately lightweight (no
 * fake demographic icons), just enough to show the decisions ahead had a
 * specific person behind them, not an abstract "the user."
 */
export default function PersonaCard({ persona, goalsLabel, frustrationsLabel }: Props) {
  const initials = persona.name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-sage-100 bg-cream-50/60 p-6 md:p-7"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-sage-600 text-cream-50 flex items-center justify-center font-display text-lg shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-display text-lg text-ink leading-snug">{persona.name}</p>
          <p className="text-sm text-ink-muted leading-snug">{persona.role}</p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <div>
          <p className="text-[10px] font-label uppercase tracking-[0.24em] text-sage-700 mb-1.5">
            {goalsLabel}
          </p>
          <p className="text-sm text-ink-soft leading-relaxed">{persona.goals}</p>
        </div>
        <div>
          <p className="text-[10px] font-label uppercase tracking-[0.24em] text-sage-700 mb-1.5">
            {frustrationsLabel}
          </p>
          <p className="text-sm text-ink-soft leading-relaxed">{persona.frustrations}</p>
        </div>
      </div>

      <div className="mt-6 pl-5 border-l-2 border-sage-300">
        <p className="font-display italic text-lg text-ink leading-snug">
          {persona.statement}
        </p>
      </div>
    </motion.div>
  );
}
