"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/lib/i18n";
import SectionHeading from "./SectionHeading";
import Placeholder from "./Placeholder";

const SLUGS = ["leaf", "cata"] as const;
type Slug = (typeof SLUGS)[number];

export default function Projects({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section id="projects" className="relative py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow={dict.projects.eyebrow} heading={dict.projects.heading}>
          {dict.projects.intro}
        </SectionHeading>

        <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-8 md:gap-12">
          {SLUGS.map((slug, i) => (
            <ProjectCard key={slug} slug={slug} index={i} dict={dict} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  slug,
  index,
  dict,
  locale,
}: {
  slug: Slug;
  index: number;
  dict: Dictionary;
  locale: Locale;
}) {
  const project = dict.projects.items[slug];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/${locale}/projects/${slug}`}
        className="group block"
        style={{ viewTransitionName: `project-${slug}` }}
      >
        <div className="relative overflow-hidden rounded-3xl">
          <Placeholder
            aspect="aspect-[5/4]"
            rounded="rounded-3xl"
            className="transition-transform duration-[900ms] ease-liminal group-hover:scale-[1.03]"
            ariaLabel={`${project.title} hero image`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
            <div className="bg-cream-50/90 backdrop-blur px-4 py-2 rounded-full text-sm text-ink flex items-center gap-2">
              {dict.projects.viewCase}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="font-display text-3xl md:text-4xl text-ink group-hover:text-sage-700 transition-colors">
              {project.title}
            </h3>
            <span className="text-ink-muted text-sm">{project.tagline}</span>
          </div>
          <p className="text-ink-soft leading-relaxed">{project.summary}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-[0.14em] text-sage-700 border border-sage-200 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
