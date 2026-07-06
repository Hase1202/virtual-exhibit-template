/**
 * VirtualMemoryQuiz.jsx
 *
 * A multi-step "which page replacement algorithm fits you?" quiz. The viewer
 * answers a few questions, each answer adds points to different algorithms,
 * and the highest-scoring algorithm is shown as the result at the end.
 *
 * Refactored from DistroQuiz.jsx -- same state machine, scoring engine, and
 * styling; only the content (`questions`, `algorithms`, `scoring`) changed.
 *
 * ## Props
 *   None. Just drop it in:
 *
 * ## Usage Example
 *   <VirtualMemoryQuiz />
 *
 * ## How to customize
 *   - Add or edit a question        -> the `questions` array
 *   - Add or edit an algorithm      -> the `algorithms` object
 *   - Change how answers score      -> the `scoring` map (answer id -> algorithm points)
 */

import { useState } from "react";

// -- Quiz data --------------------------------------------
const questions = [
  {
    text: "How do you decide what to evict?",
    options: [
      { id: "order", label: "Strict arrival order", desc: "Whatever came in first, leaves first" },
      { id: "recency", label: "Recent usage", desc: "Kick out whatever hasn't been touched in a while" },
      { id: "foresight", label: "Future knowledge", desc: "Evict whatever won't be needed for the longest time" },
      { id: "approx", label: "A cheap approximation", desc: "Something close to 'recently used', without the bookkeeping" },
    ],
  },
  {
    text: "What do you value most in a replacement policy?",
    options: [
      { id: "simplicity", label: "Simplicity", desc: "Easy to implement, easy to reason about" },
      { id: "accuracy", label: "Accuracy", desc: "Make the theoretically best decision every time" },
      { id: "adaptability", label: "Adaptability", desc: "Adjust to changing access patterns on the fly" },
      { id: "lowoverhead", label: "Low overhead", desc: "Minimal extra bookkeeping per access" },
    ],
  },
  {
    text: "How do you feel about tracking extra metadata?",
    options: [
      { id: "avoid", label: "Avoid it entirely", desc: "One bit or nothing at all" },
      { id: "minimal", label: "Keep it minimal", desc: "A reference bit or two is fine" },
      { id: "moderate", label: "Moderate bookkeeping", desc: "Counters or timestamps are worth it" },
      { id: "heavy", label: "Whatever it takes", desc: "Full history, ghost lists, the works" },
    ],
  },
  {
    text: "What's your target environment?",
    options: [
      { id: "embedded", label: "Embedded / simple systems", desc: "Tight resources, predictable behavior" },
      { id: "generalos", label: "General-purpose OS", desc: "Everyday multitasking workloads" },
      { id: "cache", label: "Database / cache systems", desc: "High-throughput, pattern-sensitive workloads" },
      { id: "theory", label: "Research / theoretical", desc: "Benchmarking, teaching, or proving bounds" },
    ],
  },
  {
    text: "How predictable is your workload?",
    options: [
      { id: "verypredictable", label: "Fully known in advance", desc: "The whole reference string is available" },
      { id: "stable", label: "Mostly stable", desc: "Access patterns don't shift much" },
      { id: "bursty", label: "Bursty and changing", desc: "Hot sets shift over time" },
      { id: "adversarial", label: "Unknown or adversarial", desc: "Could be anything, including worst-case" },
    ],
  },
];

// Every algorithm the quiz can recommend.
const algorithms = {
  fifo: {
    name: "FIFO",
    tagline: "First in, first out",
    year: 1960,
    color: "#87CF3E",
    tags: ["Simple", "Low overhead", "Suffers Belady's anomaly", "Queue-based"],
    url: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#First-in,_first-out",
    desc: "The simplest policy there is: evict whatever has been resident the longest, no questions asked. Cheap to implement, but can behave counter-intuitively as you add more frames.",
  },
  lru: {
    name: "LRU (Least Recently Used)",
    tagline: "Recency is destiny",
    year: 1965,
    color: "#E95420",
    tags: ["Recency-based", "Good average performance", "Moderate bookkeeping", "General-purpose"],
    url: "https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)",
    desc: "Evicts the page that hasn't been touched in the longest time. A strong default for general-purpose OS kernels and caches, at the cost of tracking access order.",
  },
  optimal: {
    name: "Optimal (Belady's Algorithm)",
    tagline: "The unbeatable benchmark",
    year: 1966,
    color: "#3C6EB4",
    tags: ["Theoretical", "Requires future knowledge", "Best possible", "Used as a baseline"],
    url: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#The_theoretically_optimal_page_replacement_algorithm",
    desc: "Evicts whichever page won't be used for the longest time in the future. Impossible to implement in a real system since it needs to see ahead, but it's the yardstick every other algorithm is measured against.",
  },
  clock: {
    name: "Clock (Second-Chance)",
    tagline: "One more chance before you go",
    year: 1969,
    color: "#A80030",
    tags: ["Approximates LRU", "One reference bit", "Cheap", "Widely deployed"],
    url: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#Clock",
    desc: "Sweeps a circular list of pages, giving each one a 'second chance' if its reference bit is set. Nearly as effective as LRU with a fraction of the bookkeeping -- used in real kernels for exactly that reason.",
  },
  lfu: {
    name: "LFU (Least Frequently Used)",
    tagline: "Popularity contest",
    year: 1970,
    color: "#15A4FB",
    tags: ["Frequency-based", "Good for skewed access", "Needs counters", "Cache-friendly"],
    url: "https://en.wikipedia.org/wiki/Least_frequently_used",
    desc: "Evicts the page accessed the fewest times. Shines when some pages are genuinely 'hotter' than others over the long run, though it can cling to once-popular pages that have gone cold.",
  },
  random: {
    name: "Random Replacement",
    tagline: "Why overthink it",
    year: 1969,
    color: "#35BF5C",
    tags: ["Zero bookkeeping", "No pathological cases", "Simple", "Embedded-friendly"],
    url: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#Random",
    desc: "Picks a victim page at random. Surprisingly competitive in practice, with no metadata to maintain and no worst-case access pattern that can trick it.",
  },
  nru: {
    name: "NRU (Not Recently Used)",
    tagline: "Good enough, fast enough",
    year: 1975,
    color: "#4A4A6A",
    tags: ["Reference + dirty bits", "Cheap approximation", "Classic OS technique", "Low overhead"],
    url: "https://en.wikipedia.org/wiki/Page_replacement_algorithm#Not_recently_used",
    desc: "Classifies pages into a few simple buckets using reference and modified bits, then evicts from the lowest-priority bucket. A pragmatic, low-cost stand-in for true LRU.",
  },
  workingset: {
    name: "Working Set Model",
    tagline: "Keep what's actually in use",
    year: 1968,
    color: "#48B9C7",
    tags: ["Locality-aware", "Thrashing prevention", "Per-process", "Adaptive"],
    url: "https://en.wikipedia.org/wiki/Working_set",
    desc: "Tracks the set of pages a process has touched in a recent time window and keeps exactly that set resident. Built specifically to prevent thrashing under multiprogramming.",
  },
  arc: {
    name: "ARC (Adaptive Replacement Cache)",
    tagline: "Learns as it goes",
    year: 2003,
    color: "#7F3FB8",
    tags: ["Self-tuning", "Combines recency + frequency", "Used in storage systems", "Higher complexity"],
    url: "https://en.wikipedia.org/wiki/Adaptive_replacement_cache",
    desc: "Balances recency and frequency dynamically, using ghost lists to learn which strategy is working better for the current workload. Popular in databases and storage caches.",
  },
  mfu: {
    name: "MFU (Most Frequently Used)",
    tagline: "The contrarian's choice",
    year: 1970,
    color: "#00A98F",
    tags: ["Niche", "Frequency-based", "Assumes popular = done", "Rarely used alone"],
    url: "https://en.wikipedia.org/wiki/Cache_replacement_policies#Most_frequently_used_(MFU)",
    desc: "Evicts the most frequently accessed page, on the theory that a page used heavily has probably already served its purpose. An edge-case tool, useful mostly in specific access patterns.",
  },
};

// Maps each answer's id to the algorithms it rewards, and by how much.
const scoring = {
  order: { fifo: 3, nru: 1 },
  recency: { lru: 3, clock: 2, workingset: 1, arc: 1 },
  foresight: { optimal: 3 },
  approx: { clock: 3, nru: 2, arc: 1 },
  simplicity: { fifo: 3, random: 3, nru: 1 },
  accuracy: { optimal: 3, lru: 2, arc: 1 },
  adaptability: { arc: 3, workingset: 2, lfu: 1 },
  lowoverhead: { random: 3, fifo: 2, clock: 2, nru: 1 },
  avoid: { random: 3, fifo: 2 },
  minimal: { clock: 3, nru: 2 },
  moderate: { lru: 2, lfu: 2, workingset: 1 },
  heavy: { arc: 3, optimal: 1 },
  embedded: { random: 2, fifo: 2, nru: 1 },
  generalos: { lru: 3, clock: 2, nru: 1 },
  cache: { lfu: 3, arc: 2, mfu: 1 },
  theory: { optimal: 3, lru: 1 },
  verypredictable: { optimal: 3 },
  stable: { lru: 2, lfu: 2, nru: 1 },
  bursty: { arc: 3, workingset: 2, clock: 1 },
  adversarial: { random: 3, fifo: 1 },
};

// Tally the answers and return the winning algorithm object.
function getResult(answers) {
  const scores = Object.fromEntries(Object.keys(algorithms).map((d) => [d, 0]));

  answers.forEach((a) => {
    const pts = scoring[a] ?? {};
    Object.entries(pts).forEach(([d, v]) => { scores[d] += v; });
  });

  const winnerKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return algorithms[winnerKey];
}

// -- Theme --------------------------------------------------
// Hardcoded to match the Memory Lab exhibit's dark theme (see ConceptCard
// accents: #f87171, #38bdf8, #a78bfa, #22d3ee). The original artifact used
// var(--color-...) tokens that only exist inside claude.ai -- those resolve to
// nothing on a real site, which is why text/borders were invisible.
const theme = {
  fontSans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  accent: "#38bdf8",
  accentBg: "rgba(56, 189, 248, 0.12)",
  cardBg: "rgba(255, 255, 255, 0.03)",
  cardBorderStrong: "rgba(148, 163, 184, 0.25)",
  trackBg: "rgba(255, 255, 255, 0.08)",
};

// -- Styles -----------------------------------------------
const styles = {
  progressBar: (filled) => ({
    flex: 1,
    height: 4,
    borderRadius: 2,
    background: filled ? theme.accent : theme.trackBg,
    transition: "background 0.2s",
  }),
  optionBtn: (active) => ({
    position: "relative",
    cursor: "pointer",
    textAlign: "left",
    padding: "12px 14px",
    width: "100%",
    display: "block",
    borderRadius: 10,
    border: active
      ? `2px solid ${theme.accent}`
      : `1px solid ${theme.cardBorderStrong}`,
    background: active ? theme.accentBg : theme.cardBg,
    boxShadow: active ? `0 0 0 3px ${theme.accentBg}` : "none",
    transform: active ? "translateY(-1px)" : "none",
    transition: "border-color 0.12s, background 0.12s, box-shadow 0.12s, transform 0.12s",
    fontFamily: theme.fontSans,
  }),
  checkmark: {
    position: "absolute",
    top: 10,
    right: 12,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1,
    color: theme.accent,
  },
  nextBtn: (enabled) => ({
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: 14,
    padding: "8px 18px",
    borderRadius: 10,
    border: `1px solid ${theme.cardBorderStrong}`,
    background: enabled ? theme.accentBg : "transparent",
    color: enabled ? theme.accent : theme.textSecondary,
    opacity: enabled ? 1 : 0.5,
    fontFamily: theme.fontSans,
    fontWeight: 600,
  }),
  tag: {
    fontSize: 12,
    padding: "3px 10px",
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorderStrong}`,
    borderRadius: 8,
    color: theme.textSecondary,
  },
};

export default function VirtualMemoryQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const totalQ = questions.length;
  const isIntro = step === 0;
  const isResult = step > totalQ;
  const currentQ = questions[step - 1];

  function handleNext() {
    if (!selected) return;
    setAnswers((prev) => [...prev, selected]);
    setSelected(null);
    setStep((s) => s + 1);
  }

  function handleRestart() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
  }

  const result = isResult ? getResult(answers) : null;

  return (
    <div style={{ padding: "1.5rem 0", fontFamily: theme.fontSans, color: theme.textPrimary }}>

      {/* -- Intro -- */}
      {isIntro && (
        <div>
          <p style={{ color: theme.textSecondary, marginBottom: "1.25rem", fontSize: 15, lineHeight: 1.6 }}>
            Answer 5 quick questions to find the page replacement algorithm that fits your workload.
          </p>
          <button style={styles.nextBtn(true)} onClick={() => setStep(1)}>
            Start the quiz →
          </button>
        </div>
      )}

      {/* -- Question -- */}
      {!isIntro && !isResult && currentQ && (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem" }}>
            {questions.map((_, i) => (
              <div key={i} style={styles.progressBar(i < step)} />
            ))}
          </div>

          <p style={{ fontSize: 13, color: theme.textSecondary, margin: "0 0 0.4rem" }}>
            Question {step} of {totalQ}
          </p>
          <h3 style={{ margin: "0 0 1.25rem", fontSize: 18, fontWeight: 600, color: theme.textPrimary }}>
            {currentQ.text}
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginBottom: "1.25rem",
          }}>
            {currentQ.options.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  style={styles.optionBtn(isSelected)}
                  onClick={() => setSelected(opt.id)}
                  aria-pressed={isSelected}
                >
                  {isSelected && <span style={styles.checkmark}>✓</span>}
                  <div style={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: 14,
                    color: isSelected ? theme.accent : theme.textPrimary,
                    marginBottom: 3,
                    paddingRight: 16,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textSecondary }}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>

          <button style={styles.nextBtn(!!selected)} disabled={!selected} onClick={handleNext}>
            {step === totalQ ? "See my result ->" : "Next ->"}
          </button>
        </div>
      )}

      {/* -- Result -- */}
      {isResult && result && (
        <div>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: "0 0 0.5rem" }}>
            Your recommended algorithm
          </p>
          <div style={{
            background: theme.cardBg,
            border: `2px solid ${theme.accent}`,
            borderRadius: 16,
            padding: "1.25rem",
            marginBottom: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: result.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary }}>
                  {result.name}
                </div>
                <div style={{ fontSize: 13, color: theme.textSecondary, fontStyle: "italic" }}>
                  {result.tagline}
                </div>
              </div>
              <span style={{
                fontSize: 12, padding: "3px 10px",
                background: theme.accentBg, color: theme.accent,
                borderRadius: 8, whiteSpace: "nowrap", fontWeight: 600,
              }}>
                Since {result.year}
              </span>
            </div>

            <p style={{ margin: "0 0 1rem", fontSize: 14, lineHeight: 1.65, color: theme.textPrimary }}>
              {result.desc}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1rem" }}>
              {result.tags.map((t) => (
                <span key={t} style={styles.tag}>{t}</span>
              ))}
            </div>

            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: theme.accent, fontWeight: 600 }}
            >
              Learn more ↗
            </a>
          </div>

          <button style={styles.nextBtn(true)} onClick={handleRestart}>
            ↺ Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}