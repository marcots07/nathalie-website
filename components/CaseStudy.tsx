"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/lib/i18n";
import { projectHref } from "@/lib/i18n";
import { getNextProject, type Project } from "@/lib/projects";
import Placeholder from "./Placeholder";
import SusGauge from "./SusGauge";
import BeforeAfterSlider from "./BeforeAfterSlider";
import ResearchGrid from "./ResearchGrid";
import StatusPill from "./StatusPill";

type Props = {
  project: Project;
  dict: Dictionary;
  locale: Locale;
};

export default function CaseStudy({ project, dict, locale }: Props) {
  const t = project.translations[locale];
  const next = getNextProject(project);
  const nextT = next.translations[locale];
  const artifacts = dict.caseStudy.researchArtifacts;
  const slider = dict.caseStudy.slider;
  const showSlider = project.features.showBeforeAfterSlider;
  const showFlows = project.features.showFlowsGallery;
  const showResearchGrid = project.features.showResearchGrid;
  const showSus =
    project.features.showSusGauge &&
    project.metrics.susScore !== null &&
    project.metrics.susScore !== undefined;

  return (
    <article className="pt-28 md:pt-32 pb-16">
      {/* Hero */}
      <header className="relative">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-3 flex-wrap">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.28em] text-sage-700"
            >
              {dict.projects.eyebrow}
            </motion.p>
            {project.status === "in_progress" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <StatusPill label={dict.caseStudy.status.inProgress} />
              </motion.div>
            )}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-6xl md:text-7xl lg:text-8xl text-ink italic leading-none"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 text-xl md:text-2xl text-ink-soft max-w-2xl leading-snug"
          >
            {t.hero.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {t.hero.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-[0.14em] text-sage-700 border border-sage-200 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto px-6 md:px-10 mt-14"
          style={{ viewTransitionName: `project-${project.slug}` }}
        >
          <Placeholder
            aspect="aspect-[16/9]"
            rounded="rounded-3xl"
            variant="browser"
            ariaLabel={`${t.hero.title} hero image`}
          />
        </motion.div>
      </header>

      {/* Overview */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-24 md:mt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-6 inline-flex items-center gap-3">
          <span className="w-6 h-px bg-sage-500" />
          {dict.caseStudy.overview}
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-sage-100 pt-8">
          <OverviewItem label={dict.caseStudy.role} value={t.overview.role} />
          <OverviewItem label={dict.caseStudy.tools} value={t.overview.tools} />
          <OverviewItem label={dict.caseStudy.duration} value={t.overview.duration} />
          <OverviewItem label={dict.caseStudy.type} value={t.overview.type} />
        </div>
      </section>

      {/* Problem */}
      <TextSection eyebrow={dict.caseStudy.problem} heading={t.problem.heading}>
        {t.problem.body}
      </TextSection>

      {/* Research */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-24 md:mt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
          <span className="w-6 h-px bg-sage-500" />
          {dict.caseStudy.research}
        </p>
        <div className="grid md:grid-cols-12 gap-10">
          <div className={showResearchGrid ? "md:col-span-7" : "md:col-span-12"}>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="font-display text-3xl md:text-4xl text-ink leading-snug"
            >
              {t.research.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-5 text-lg text-ink-soft leading-relaxed"
            >
              {t.research.body}
            </motion.p>
            {t.research.bullets && (
              <ul className="mt-6 space-y-3">
                {t.research.bullets.map((b) => (
                  <li key={b} className="text-ink-soft flex gap-3">
                    <span className="text-sage-500 mt-2.5">
                      <span className="block w-1 h-1 rounded-full bg-current" />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {showResearchGrid && (
            <div className="md:col-span-5">
              <ResearchGrid
                blocks={[
                  { label: artifacts.personas, glyph: "personas" },
                  { label: artifacts.competitive, glyph: "competitive" },
                  { label: artifacts.valueProp, glyph: "valueProp" },
                  { label: artifacts.hmw, glyph: "hmw" },
                ]}
              />
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-24 md:mt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
          <span className="w-6 h-px bg-sage-500" />
          {dict.caseStudy.process}
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="font-display text-3xl md:text-4xl text-ink leading-snug max-w-3xl"
        >
          {t.process.heading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 text-lg text-ink-soft leading-relaxed max-w-3xl"
        >
          {t.process.body}
        </motion.p>

        {showSlider && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10"
          >
            <BeforeAfterSlider
              beforeLabel={slider.before}
              afterLabel={slider.after}
              dragHint={slider.hint}
            />
          </motion.div>
        )}

        {showFlows && (
          <>
            <div className={showSlider ? "mt-14" : "mt-10"}>
              <p className="text-xs uppercase tracking-[0.24em] text-sage-700 mb-4">
                {dict.caseStudy.flowsLabel}
              </p>
            </div>
            <div className="-mx-6 md:-mx-10 overflow-x-auto pb-4">
              <div className="flex gap-6 px-6 md:px-10 snap-x snap-mandatory">
                {t.process.flows.map((flow, i) => (
                  <motion.div
                    key={flow}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="flex-shrink-0 w-72 snap-start"
                  >
                    <Placeholder
                      aspect="aspect-[9/16]"
                      variant="device"
                      rounded="rounded-3xl"
                    />
                    <p className="mt-3 text-sm text-ink-muted text-center">{flow}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Results */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-24 md:mt-32">
        <p className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
          <span className="w-6 h-px bg-sage-500" />
          {dict.caseStudy.results}
        </p>
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className={showSus ? "md:col-span-7" : "md:col-span-12"}>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="font-display text-3xl md:text-4xl text-ink leading-snug"
            >
              {t.results.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-5 text-lg text-ink-soft leading-relaxed"
            >
              {t.results.body}
            </motion.p>
            <ul className="mt-6 space-y-3">
              {t.results.learnings.map((l) => (
                <li key={l} className="text-ink-soft flex gap-3">
                  <span className="text-sage-500 mt-2.5">
                    <span className="block w-1 h-1 rounded-full bg-current" />
                  </span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
          {showSus && project.metrics.susScore !== null && (
            <div className="md:col-span-5 flex justify-center">
              <SusGauge
                value={project.metrics.susScore}
                outOf={project.metrics.susOutOf ?? 100}
              />
            </div>
          )}
        </div>
      </section>

      {/* Reflection */}
      <TextSection eyebrow={dict.caseStudy.reflection} heading={t.reflection.heading}>
        {t.reflection.body}
      </TextSection>

      {/* Next project */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-24 md:mt-32">
        <Link
          href={projectHref(locale, next.slug)}
          className="group block border-t border-sage-100 pt-10"
          style={{ viewTransitionName: `project-${next.slug}` }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-3">
            {dict.caseStudy.next}
          </p>
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className="font-display text-4xl md:text-5xl text-ink italic group-hover:text-sage-700 transition-colors">
                {nextT.hero.title}
              </h3>
              <p className="text-ink-muted mt-2">{nextT.hero.tagline}</p>
              {next.status === "in_progress" && (
                <StatusPill label={dict.caseStudy.status.inProgress} />
              )}
            </div>
            <svg
              width="28"
              height="28"
              viewBox="0 0 16 16"
              fill="none"
              className="text-sage-700 transition-transform duration-500 group-hover:translate-x-2"
            >
              <path
                d="M3 8h10m0 0L9 4m4 4L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      </section>
    </article>
  );
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-sage-700 mb-2">
        {label}
      </p>
      <p className="text-ink leading-snug">{value}</p>
    </div>
  );
}

function TextSection({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-10 mt-24 md:mt-32">
      <p className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
        <span className="w-6 h-px bg-sage-500" />
        {eyebrow}
      </p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="font-display text-3xl md:text-4xl text-ink leading-snug"
      >
        {heading}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-5 text-lg text-ink-soft leading-relaxed"
      >
        {children}
      </motion.p>
    </section>
  );
}
