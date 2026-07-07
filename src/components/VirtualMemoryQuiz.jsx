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
    padding: "16px",
    width: "100%",
    display: "block",
    borderRadius: 12,
    border: active
      ? `2px solid ${theme.accent}`
      : `1px solid ${theme.cardBorderStrong}`,
    background: active ? theme.accentBg : theme.cardBg,
    boxShadow: active ? `0 0 0 3px ${theme.accentBg}` : "none",
    transform: active ? "translateY(-1px)" : "none",
    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s",
    fontFamily: theme.fontSans,
  }),
  checkmark: {
    position: "absolute",
    top: 12,
    right: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: theme.accent,
    color: "#0a0e1a",
  },
  nextBtn: (enabled) => ({
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: 14,
    padding: "10px 22px",
    borderRadius: 999,
    border: `1px solid ${theme.cardBorderStrong}`,
    background: enabled ? theme.accentBg : "transparent",
    color: enabled ? theme.accent : theme.textSecondary,
    opacity: enabled ? 1 : 0.5,
    fontFamily: theme.fontSans,
    fontWeight: 600,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  }),
  tag: {
    fontSize: 11,
    padding: "3px 9px",
    background: "rgba(255, 255, 255, 0.04)",
    border: `1px solid ${theme.cardBorderStrong}`,
    borderRadius: 6,
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
    <div style={{ padding: "0.5rem 0", fontFamily: theme.fontSans, color: theme.textPrimary }}>

      {/* -- Intro / Redesigned -- */}
      {isIntro && (
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 18,
          padding: "2.5rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle background glow */}
          <div style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle at center, rgba(56, 189, 248, 0.06) 0%, transparent 60%)",
            pointerEvents: "none",
            zIndex: 0
          }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Pulsing visual header */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#quiz-header-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.3))" }}>
                <defs>
                  <linearGradient id="quiz-header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="7" strokeDasharray="3 3" />
              </svg>
            </div>

            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.4rem", fontWeight: 800, background: "linear-gradient(135deg, #f1f5f9 0%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Page Replacement Matcher
            </h3>
            
            <p style={{ color: theme.textSecondary, marginBottom: "1.75rem", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "460px", marginLeft: "auto", marginRight: "auto" }}>
              Answer 5 quick questions about constraints and environments to find which OS page replacement strategy matches your workload profile.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.75rem",
              maxWidth: "400px",
              margin: "0 auto 2rem auto",
              textAlign: "left",
            }}>
              <div style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f1f5f9" }}>5 Questions</div>
                  <div style={{ fontSize: "0.65rem", color: "#64748b" }}>Take matching diagnostic</div>
                </div>
              </div>
              
              <div style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f1f5f9" }}>Instant Profile</div>
                  <div style={{ fontSize: "0.65rem", color: "#64748b" }}>See algorithm breakdown</div>
                </div>
              </div>
            </div>

            <button
              style={{
                cursor: "pointer",
                fontSize: "0.95rem",
                padding: "0.8rem 2rem",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                color: "#0a0e1a",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(56, 189, 248, 0.25)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(56, 189, 248, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(56, 189, 248, 0.25)";
              }}
              onClick={() => setStep(1)}
            >
              Analyze Workload Profile
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
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

          <p style={{ fontSize: 12, color: theme.textSecondary, margin: "0 0 0.4rem" }}>
            Question {step} of {totalQ}
          </p>
          <h3 style={{ margin: "0 0 1.25rem", fontSize: 17, fontWeight: 700, color: theme.textPrimary }}>
            {currentQ.text}
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: "1.5rem",
          }}>
            {currentQ.options.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  style={styles.optionBtn(isSelected)}
                  onClick={() => setSelected(opt.id)}
                  aria-pressed={isSelected}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(196, 164, 255, 0.35)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = theme.cardBorderStrong;
                      e.currentTarget.style.background = theme.cardBg;
                    }
                  }}
                >
                  {isSelected && (
                    <span style={styles.checkmark}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  )}
                  <div style={{
                    fontWeight: isSelected ? 700 : 600,
                    fontSize: 13.5,
                    color: isSelected ? theme.accent : theme.textPrimary,
                    marginBottom: 4,
                    paddingRight: 20,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: theme.textSecondary, lineHeight: 1.4 }}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            style={styles.nextBtn(!!selected)}
            disabled={!selected}
            onClick={handleNext}
            onMouseEnter={(e) => {
              if (selected) {
                e.currentTarget.style.borderColor = theme.accent;
                e.currentTarget.style.background = "rgba(56, 189, 248, 0.18)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (selected) {
                e.currentTarget.style.borderColor = theme.cardBorderStrong;
                e.currentTarget.style.background = theme.accentBg;
                e.currentTarget.style.transform = "none";
              }
            }}
          >
            {step === totalQ ? "See my result" : "Next"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      )}

      {/* -- Result -- */}
      {isResult && result && (
        <div>
          <p style={{ fontSize: 12, color: theme.textSecondary, margin: "0 0 0.5rem" }}>
            Your recommended algorithm
          </p>
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: `2px solid ${theme.accent}`,
            borderRadius: 16,
            padding: "1.5rem",
            marginBottom: "1.25rem",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: `radial-gradient(circle at center, ${result.color}08 0%, transparent 60%)`,
              pointerEvents: "none",
              zIndex: 0
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: result.color, flexShrink: 0, boxShadow: `0 0 8px ${result.color}` }} />
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: theme.textPrimary, letterSpacing: "0.2px" }}>
                    {result.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: theme.textSecondary, fontStyle: "italic", marginTop: 2 }}>
                    {result.tagline}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, padding: "3px 10px",
                  background: theme.accentBg, color: theme.accent,
                  borderRadius: 6, whiteSpace: "nowrap", fontWeight: 700,
                  border: "1px solid rgba(56, 189, 248, 0.15)"
                }}>
                  Since {result.year}
                </span>
              </div>

              <p style={{ margin: "0 0 1.25rem 0", fontSize: 13.5, lineHeight: 1.6, color: theme.textPrimary }}>
                {result.desc}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.25rem" }}>
                {result.tags.map((t) => (
                  <span key={t} style={styles.tag}>{t}</span>
                ))}
              </div>

              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: theme.accent, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                Learn more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </a>
            </div>
          </div>

          <button
            style={styles.nextBtn(true)}
            onClick={handleRestart}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.background = "rgba(56, 189, 248, 0.18)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.cardBorderStrong;
              e.currentTarget.style.background = theme.accentBg;
              e.currentTarget.style.transform = "none";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Retake Matcher
          </button>
        </div>
      )}
    </div>
  );
}