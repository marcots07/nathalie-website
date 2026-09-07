"use client";

import { motion, type Variants } from "framer-motion";

type Props = {
  text: string;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  delay?: number;
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.012 },
  },
};

const letter: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Section headings type themselves on, letter by letter — the typewriter
 * face (Courier Prime) already implies this, so section titles lean into
 * it instead of just fading up as a block. Words stay on `inline-block`
 * spans so they still wrap as whole words, not mid-word; the literal
 * space between words is a plain text node (not its own animated span)
 * so word spacing behaves normally.
 *
 * Screen readers get the plain `text` once via `aria-label` on the
 * wrapping element — the per-letter spans are `aria-hidden` so this never
 * reads out as a wall of single characters.
 */
export default function TypewriterHeading({ text, as: Tag = "span", className, delay = 0 }: Props) {
  const MotionTag = motion.create(Tag) as typeof motion.span;
  const words = text.split(" ");

  return (
    <MotionTag
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      transition={{ delayChildren: delay }}
      className={className}
    >
      <span aria-hidden="true">
        {words.flatMap((word, wi) => {
          const wordSpan = (
            <span key={`w-${wi}`} className="inline-block whitespace-nowrap">
              {word.split("").map((char, ci) => (
                <motion.span key={ci} variants={letter} className="inline-block">
                  {char}
                </motion.span>
              ))}
            </span>
          );
          return wi < words.length - 1 ? [wordSpan, " "] : [wordSpan];
        })}
      </span>
    </MotionTag>
  );
}
