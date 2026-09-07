"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { DecorId } from "@/lib/decor";
import DecorFlower from "./DecorFlower";
import SectionHeading from "./SectionHeading";

const COLUMNS = ["clinical", "design", "professional", "certifications"] as const;

export default function Skills({ dict }: { dict: Dictionary }) {
  return (
    <section id="skills" className="relative py-24 md:py-36">
      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow={dict.skills.eyebrow} heading={dict.skills.heading} />

        <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-x-10 gap-y-16 md:gap-x-14 md:gap-y-20">
          {COLUMNS.map((key, i) => {
            const col = dict.skills[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="relative"
              >
                {/* Paper scrap, behind the text — draggable/resizable via the
                    "Mover flores" dev toggle, same as every other DecorFlower
                    on the site, just pinned under the content instead of over
                    it (`behind`). Desktop-only, like every other decoration —
                    on a phone/tablet card this small, the paper competed with
                    the text instead of reading as a nice backdrop. */}
                <div className="hidden lg:contents">
                  <DecorFlower id={`skills-${key}` as DecorId} behind />
                </div>

                <div className="relative z-10">
                  <h3 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
                    <span className="w-6 h-px bg-sage-500" />
                    {col.title}
                  </h3>
                  <ul className="space-y-2">
                    {col.items.map((item) => (
                      <li key={item} className="text-ink-soft leading-relaxed flex gap-3">
                        <span className="text-sage-500 mt-2.5">
                          <span className="block w-1 h-1 rounded-full bg-current" />
                        </span>
                        <span className="whitespace-pre-line">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
