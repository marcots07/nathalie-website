"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import SectionHeading from "./SectionHeading";

const COLUMNS = ["clinical", "design", "professional", "certifications"] as const;

export default function Skills({ dict }: { dict: Dictionary }) {
  return (
    <section id="skills" className="relative py-24 md:py-36 bg-cream-100/40">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow={dict.skills.eyebrow} heading={dict.skills.heading} />

        <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-10 md:gap-14">
          {COLUMNS.map((key, i) => {
            const col = dict.skills[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              >
                <h3 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
                  <span className="w-6 h-px bg-sage-500" />
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="text-ink-soft leading-relaxed flex gap-3"
                    >
                      <span className="text-sage-500 mt-2.5">
                        <span className="block w-1 h-1 rounded-full bg-current" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
