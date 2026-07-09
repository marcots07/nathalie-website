"use client";

import { motion } from "framer-motion";

type Block = {
  label: string;
  glyph: "personas" | "competitive" | "valueProp" | "hmw";
};

type Props = {
  blocks: Block[];
};

/**
 * Four visual research-artifact tiles used inside the case study "Research"
 * section — each tile evokes a specific research artifact so it doesn't
 * read as an interchangeable placeholder grid.
 */
export default function ResearchGrid({ blocks }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {blocks.map((b, i) => (
        <motion.div
          key={b.label + i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          className="aspect-[4/5] rounded-2xl bg-cream-100 border border-sage-100 overflow-hidden relative flex flex-col"
        >
          <div className="flex-1 relative">
            <Glyph name={b.glyph} />
          </div>
          <div className="px-3 py-2 border-t border-sage-100 bg-cream-50/60">
            <p className="text-[10px] uppercase tracking-[0.24em] text-sage-700">
              {b.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Glyph({ name }: { name: Block["glyph"] }) {
  if (name === "personas") {
    return (
      <svg viewBox="0 0 160 200" className="w-full h-full" aria-hidden>
        <rect x="20" y="20" width="120" height="160" rx="8" fill="none" stroke="#a3c199" strokeDasharray="4 4" strokeWidth="1" />
        <circle cx="80" cy="60" r="20" fill="#c6d9c0" />
        <rect x="50" y="90" width="60" height="6" rx="3" fill="#a3c199" />
        <rect x="40" y="110" width="80" height="4" rx="2" fill="#e2ecdf" />
        <rect x="40" y="120" width="70" height="4" rx="2" fill="#e2ecdf" />
        <rect x="40" y="140" width="60" height="4" rx="2" fill="#e2ecdf" />
        <rect x="40" y="150" width="80" height="4" rx="2" fill="#e2ecdf" />
        <rect x="40" y="160" width="50" height="4" rx="2" fill="#e2ecdf" />
      </svg>
    );
  }
  if (name === "competitive") {
    return (
      <svg viewBox="0 0 160 200" className="w-full h-full" aria-hidden>
        {[
          [20, 30, 50],
          [80, 30, 30],
          [20, 90, 40],
          [80, 90, 55],
          [20, 150, 25],
          [80, 150, 45],
        ].map(([x, y, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width="60" height="40" rx="4" fill="none" stroke="#a3c199" strokeWidth="1" />
            <rect x={x + 8} y={y + 10} width={h} height="4" rx="2" fill="#5f8555" />
            <rect x={x + 8} y={y + 20} width={h - 10} height="3" rx="1.5" fill="#e2ecdf" />
            <rect x={x + 8} y={y + 27} width={h - 20} height="3" rx="1.5" fill="#e2ecdf" />
          </g>
        ))}
      </svg>
    );
  }
  if (name === "valueProp") {
    return (
      <svg viewBox="0 0 160 200" className="w-full h-full" aria-hidden>
        <path d="M80 30 L130 100 L80 170 L30 100 Z" fill="none" stroke="#c47758" strokeWidth="1.2" />
        <path d="M80 60 L110 100 L80 140 L50 100 Z" fill="#e3b09a" opacity="0.5" />
        <rect x="55" y="94" width="50" height="4" rx="2" fill="#c47758" />
        <rect x="60" y="104" width="40" height="3" rx="1.5" fill="#c47758" opacity="0.6" />
      </svg>
    );
  }
  // HMW
  return (
    <svg viewBox="0 0 160 200" className="w-full h-full" aria-hidden>
      {[30, 65, 100, 135].map((y, i) => (
        <g key={y}>
          <circle cx="24" cy={y + 8} r="4" fill="none" stroke="#5f8555" strokeWidth="1" />
          <rect x="40" y={y} width={100 - i * 8} height="4" rx="2" fill="#5f8555" />
          <rect x="40" y={y + 8} width={110 - i * 6} height="3" rx="1.5" fill="#c6d9c0" />
          <rect x="40" y={y + 15} width={80 - i * 4} height="3" rx="1.5" fill="#c6d9c0" />
        </g>
      ))}
    </svg>
  );
}
