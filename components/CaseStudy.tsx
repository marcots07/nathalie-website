"use client";

import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/lib/i18n";
import { projectHref } from "@/lib/i18n";
import { getNextProject, estimateReadMinutes, type Project } from "@/lib/projects";
import Placeholder from "./Placeholder";
import SusGauge from "./SusGauge";
import BeforeAfterSlider from "./BeforeAfterSlider";
import ResearchGrid from "./ResearchGrid";
import StatusPill from "./StatusPill";
import TransitionLink from "./TransitionLink";
import FlowShowcase from "./FlowShowcase";
import ProjectHeroMedia from "./ProjectHeroMedia";
import ProjectFigure from "./ProjectFigure";
import EvolutionRow from "./EvolutionRow";
import SketchToScreens from "./SketchToScreens";
import UsabilityFindings from "./UsabilityFindings";
import PersonaCard from "./PersonaCard";
import CountUp from "./CountUp";

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
  const showTesting = Boolean(project.features.showTesting && t.testing);
  const showSus =
    project.features.showSusGauge &&
    project.metrics.susScore !== null &&
    project.metrics.susScore !== undefined;
  const readMinutes = estimateReadMinutes(t);

  return (
    // Small top padding, not nav-clearing: every case study renders under
    // <ProjectSwitcher>, whose own `pt-20 md:pt-28` already clears the
    // fixed nav. A second full clearance here stacked on top of it and
    // left a ~190px dead band between the filter tags and the title.
    <article className="pt-10 md:pt-14 pb-16">
      {/* Hero */}
      <header className="relative">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-3 flex-wrap">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-label uppercase tracking-[0.28em] text-sage-700"
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
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-xs font-label uppercase tracking-[0.28em] text-ink-muted inline-flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-ink-muted" />
              {readMinutes} {dict.caseStudy.readTime}
            </motion.span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-5xl md:text-6xl lg:text-7xl text-ink italic leading-none"
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
                className="text-xs font-label uppercase tracking-[0.14em] text-sage-700 border border-sage-200 rounded-full px-3 py-1"
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
          {project.media?.hero ? (
            <ProjectHeroMedia
              hero={project.media.hero}
              alt={`${t.hero.title} — ${t.hero.tagline}`}
              aspectRatio={project.media.screensAspectRatio}
              viewLabels={dict.caseStudy.viewLabels}
            />
          ) : (
            <Placeholder
              aspect="aspect-[16/9]"
              rounded="rounded-3xl"
              variant="browser"
              ariaLabel={`${t.hero.title} hero image`}
            />
          )}
        </motion.div>
      </header>

      {/* Overview */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-20 md:mt-24">
        <p className="text-xs font-label uppercase tracking-[0.28em] text-sage-700 mb-6 inline-flex items-center gap-3">
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
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-20 md:mt-24">
        <p className="text-xs font-label uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
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

        {t.research.personas && t.research.personas.length > 0 ? (
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {t.research.personas.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1 }}
              >
                <PersonaCard
                  persona={p}
                  goalsLabel={dict.caseStudy.persona.goals}
                  frustrationsLabel={dict.caseStudy.persona.frustrations}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          t.research.persona && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-10 max-w-2xl"
            >
              <PersonaCard
                persona={t.research.persona}
                goalsLabel={dict.caseStudy.persona.goals}
                frustrationsLabel={dict.caseStudy.persona.frustrations}
              />
            </motion.div>
          )
        )}

        {t.research.insight && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="mt-10 pl-6 border-l-2 border-sage-500 font-display italic text-2xl md:text-3xl text-ink leading-snug max-w-3xl"
          >
            {t.research.insight}
          </motion.p>
        )}

        {project.media?.researchFigure && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10"
          >
            <ProjectFigure
              src={project.media.researchFigure.src}
              alt={t.research.heading}
              aspectRatio={project.media.researchFigure.aspectRatio}
              scrollable={project.media.researchFigure.scrollable}
              viewFullSizeLabel={dict.caseStudy.viewFullSize}
              label={t.research.figure?.label}
              caption={t.research.figure?.caption}
            />
          </motion.div>
        )}
      </section>

      {/* Process */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-20 md:mt-24">
        <p className="text-xs font-label uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
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

        {project.media?.evolution && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10"
          >
            <EvolutionRow
              stages={project.media.evolution.stages}
              labels={t.process.evolutionLabels}
              alt={t.process.heading}
              tornVariant={2}
            />
          </motion.div>
        )}

        {project.media?.evolutions && project.media.evolutions.length > 0 && (
          <div className="mt-10 space-y-14">
            {project.media.evolutions.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {t.process.evolutionsLabels?.[i] && (
                  <p className="mb-5 text-xs font-label uppercase tracking-[0.24em] text-sage-700 text-center">
                    {t.process.evolutionsLabels[i]}
                  </p>
                )}
                <EvolutionRow
                  stages={row.stages}
                  labels={t.process.evolutionLabels}
                  alt={t.process.evolutionsLabels?.[i] ?? t.process.heading}
                  tornVariant={((i % 3) + 1) as 1 | 2 | 3}
                />
              </motion.div>
            ))}
          </div>
        )}

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
              beforeSrc={project.media?.beforeAfter?.before}
              afterSrc={project.media?.beforeAfter?.after}
              aspectRatio={project.media?.beforeAfter?.aspectRatio}
              frame={project.media?.beforeAfter?.frame}
            />
          </motion.div>
        )}

        {project.media?.sketchToScreens && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-14"
          >
            {t.process.sketchToScreensLabel && (
              <p className="text-xs font-label uppercase tracking-[0.24em] text-sage-700 mb-8 text-center">
                {t.process.sketchToScreensLabel}
              </p>
            )}
            <SketchToScreens
              sketch={project.media.sketchToScreens.sketch}
              sketchAspectRatio={project.media.sketchToScreens.sketchAspectRatio}
              midScreens={project.media.sketchToScreens.midScreens}
              screens={project.media.sketchToScreens.screens}
              captions={t.process.sketchToScreensCaptions}
              stageLabels={t.process.sketchToScreensStageLabels}
              alt={t.process.heading}
            />
          </motion.div>
        )}

        {project.media?.processFigure && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-14 max-w-3xl"
          >
            <ProjectFigure
              src={project.media.processFigure.src}
              alt={t.process.heading}
              aspectRatio={project.media.processFigure.aspectRatio}
              scrollable={project.media.processFigure.scrollable}
              viewFullSizeLabel={dict.caseStudy.viewFullSize}
              label={t.process.figure?.label}
              caption={t.process.figure?.caption}
            />
          </motion.div>
        )}

        {showFlows && (
          <>
            <div className={showSlider ? "mt-14" : "mt-10"}>
              <p className="text-xs font-label uppercase tracking-[0.24em] text-sage-700 mb-4">
                {dict.caseStudy.flowsLabel}
              </p>
            </div>
            {t.process.flowGroups && t.process.flowGroups.length > 0 ? (
              <div className="space-y-16 md:space-y-20">
                {t.process.flowGroups.map((group, g) => (
                  <div key={group.title}>
                    <h3 className="font-display text-xl md:text-2xl text-ink mb-8 flex items-center gap-3">
                      <span className="w-6 h-px bg-sage-500" />
                      {group.title}
                    </h3>
                    <FlowShowcase
                      flows={group.flows}
                      notes={group.notes}
                      decisionLabel={dict.caseStudy.designDecision}
                      screens={project.media?.screenGroups?.[g]?.screens}
                      aspectRatio={project.media?.screensAspectRatio}
                      frame={project.media?.screensFrame}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <FlowShowcase
                flows={t.process.flows}
                notes={t.process.flowNotes}
                decisionLabel={dict.caseStudy.designDecision}
                screens={project.media?.screens}
                aspectRatio={project.media?.screensAspectRatio}
                frame={project.media?.screensFrame}
              />
            )}
          </>
        )}
      </section>

      {/* Testing */}
      {showTesting && t.testing && (
        <section className="max-w-5xl mx-auto px-6 md:px-10 mt-20 md:mt-24">
          <p className="text-xs font-label uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
            <span className="w-6 h-px bg-sage-500" />
            {dict.caseStudy.testing}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl md:text-4xl text-ink leading-snug max-w-3xl"
          >
            {t.testing.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 text-lg text-ink-soft leading-relaxed max-w-3xl"
          >
            {t.testing.body}
          </motion.p>

          {t.testing.stats.length > 0 && (
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 border-t border-b border-sage-100 py-8">
              {t.testing.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl md:text-4xl text-sage-700">
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-1 text-xs font-label uppercase tracking-[0.2em] text-ink-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12">
            <UsabilityFindings
              findings={t.testing.findings}
              severityLabels={dict.caseStudy.severity}
              recommendationLabel={dict.caseStudy.recommendation}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="mt-12 pl-6 border-l-2 border-terracotta-400 font-display italic text-2xl md:text-3xl text-ink leading-snug max-w-3xl"
          >
            {t.testing.insight}
          </motion.p>
        </section>
      )}

      {/* Results */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-20 md:mt-24">
        <p className="text-xs font-label uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
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
      <TextSection
        eyebrow={dict.caseStudy.reflection}
        heading={t.reflection.heading}
        extra={
          t.reflection.moments && t.reflection.moments.length > 0 ? (
            <div className="mt-8 space-y-6">
              {t.reflection.moments.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="pl-5 border-l-2 border-sage-200"
                >
                  <p className="font-display text-lg text-ink leading-snug">{m.title}</p>
                  <p className="mt-2 text-ink-soft leading-relaxed">{m.body}</p>
                </motion.div>
              ))}
            </div>
          ) : undefined
        }
      >
        {t.reflection.body}
      </TextSection>

      {/* Next project */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mt-20 md:mt-24">
        <TransitionLink
          href={projectHref(locale, next.slug)}
          className="group block border-t border-sage-100 pt-10"
          style={{ viewTransitionName: `project-${next.slug}` }}
        >
          <p className="text-xs font-label uppercase tracking-[0.28em] text-sage-700 mb-3">
            {dict.caseStudy.next}
          </p>
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className="font-display text-3xl md:text-4xl text-ink italic group-hover:text-sage-700 transition-colors">
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
        </TransitionLink>
      </section>
    </article>
  );
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-label uppercase tracking-[0.24em] text-sage-700 mb-2">
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
  extra,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
  /** Rendered after the body paragraph, outside the <p> — for content a
      paragraph can't legally contain (lists, cards). */
  extra?: React.ReactNode;
}) {
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-10 mt-20 md:mt-24">
      <p className="text-xs font-label uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3">
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
      {extra}
    </section>
  );
}
