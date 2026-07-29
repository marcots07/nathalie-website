"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import SectionHeading from "./SectionHeading";

export default function Experience({ dict }: { dict: Dictionary }) {
  return (
    <section id="experience" className="relative py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading
          eyebrow={dict.experience.eyebrow}
          heading={dict.experience.heading}
        />

        <div className="mt-16 md:mt-20 relative">
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-px bg-sage-200" />
          <div className="space-y-16">
            {dict.experience.roles.map((role, i) => (
              <TimelineRole
                key={i}
                role={role}
                index={i}
                currentLabel={dict.experience.current}
                isCurrent={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineRole({
  role,
  index,
  currentLabel,
  isCurrent,
}: {
  role: Dictionary["experience"]["roles"][number];
  index: number;
  currentLabel: string;
  isCurrent: boolean;
}) {
  const isEven = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative md:grid md:grid-cols-2 md:gap-16"
    >
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-2 z-10">
        <div className="relative">
          <div className={`w-3 h-3 rounded-full ${isCurrent ? "bg-terracotta-500" : "bg-sage-500"}`} />
          {isCurrent && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-terracotta-500 animate-ping opacity-40" />
          )}
        </div>
      </div>

      <div className={`pl-12 md:pl-0 ${isEven ? "md:col-start-1 md:text-right md:pr-8" : "md:col-start-2 md:pl-8"}`}>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">
            {role.period}
          </span>
          {isCurrent && (
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta-700 font-medium">
              {currentLabel}
            </span>
          )}
        </div>
        <h3 className="font-display text-2xl md:text-3xl text-ink leading-tight">
          {role.company}
        </h3>
        <p className="text-sage-700 font-medium mt-1">{role.role}</p>
        <p className="text-sm text-ink-muted mt-1">{role.location}</p>
      </div>

      <div className={`pl-12 md:pl-0 mt-4 md:mt-0 ${isEven ? "md:col-start-2 md:pl-8" : "md:col-start-1 md:row-start-1 md:pr-8"}`}>
        <ul className="space-y-2.5">
          {role.bullets.map((b, i) => (
            <li key={i} className="text-ink-soft text-sm leading-relaxed flex gap-2">
              <span className="text-sage-500 mt-2 flex-shrink-0">
                <span className="block w-1 h-1 rounded-full bg-current" />
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
