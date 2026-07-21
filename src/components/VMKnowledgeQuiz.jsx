import { useState } from "react";

const theme = {
  fontSans: "'Inter', system-ui, -apple-system, sans-serif",
  textPrimary: "var(--ml-heading, #faf8ff)",
  textSecondary: "var(--ml-text-muted, #b0a6d9)",
  textDim: "var(--ml-text-dim, #8478b8)",
  accent: "var(--ml-accent, #c084fc)",
  accentDim: "var(--ml-accent-dim, rgba(192, 132, 252, 0.16))",
  neonCyan: "var(--ml-neon-cyan, #22d3ee)",
  cardBg: "rgba(15, 10, 36, 0.65)",
  cardBorder: "rgba(196, 164, 255, 0.15)",
  borderGlow: "rgba(192, 132, 252, 0.35)",
  trackBg: "rgba(255, 255, 255, 0.08)",
  radiusSm: "8px",
  radiusMd: "14px",
  radiusLg: "20px",
  correct: "#4ade80",
  correctBg: "rgba(74, 222, 128, 0.14)",
  incorrect: "#f87171",
  incorrectBg: "rgba(248, 113, 113, 0.14)",
};

const questions = [
  {
    id: "q1",
    text: "Why does external fragmentation happen in physical RAM?",
    options: [
      { id: "a", label: "A", text: "RAM chips physically wear out over time" },
      { id: "b", label: "B", text: "Programs opening and closing leave scattered free holes, even though total free memory may be enough" },
      { id: "c", label: "C", text: "The CPU runs out of registers" },
      { id: "d", label: "D", text: "The page table gets corrupted" },
    ],
    correctId: "b",
    explanation: "As programs start and stop, the free memory holes left behind end up scattered. The total free space can be plenty, but no single continuous hole may be big enough for a new program.",
  },
  {
    id: "q2",
    text: "What is the relationship between a Virtual Page and a Physical Frame?",
    options: [
      { id: "a", label: "A", text: "Pages are physical, frames are virtual" },
      { id: "b", label: "B", text: "They are the same thing, just different names" },
      { id: "c", label: "C", text: "Pages are fixed-size chunks of virtual memory; frames are the matching fixed-size chunks of physical RAM" },
      { id: "d", label: "D", text: "A page is always 1 GB, a frame is always 4 KB" },
    ],
    correctId: "c",
    explanation: "Both virtual memory and physical RAM are divided into fixed-size chunks (typically 4 KB) — virtual-side chunks are pages, physical-side chunks are frames.",
  },
  {
    id: "q3",
    text: "What does the Page Table actually store?",
    options: [
      { id: "a", label: "A", text: "The mapping from each virtual page to the physical frame it lives in" },
      { id: "b", label: "B", text: "A backup copy of every running program" },
      { id: "c", label: "C", text: "The list of programs waiting to open" },
      { id: "d", label: "D", text: "The user's saved passwords" },
    ],
    correctId: "a",
    explanation: "Each running process has its own page table storing virtual-page-to-physical-frame mappings. The MMU consults it to translate addresses on every memory access.",
  },
  {
    id: "q4",
    text: "Why does the CPU have a Translation Lookaside Buffer (TLB)?",
    options: [
      { id: "a", label: "A", text: "To store swapped-out pages" },
      { id: "b", label: "B", text: "To cache recently used page-to-frame mappings so translation doesn't require a slow page table walk every time" },
      { id: "c", label: "C", text: "To physically expand RAM capacity" },
      { id: "d", label: "D", text: "To detect malicious programs" },
    ],
    correctId: "b",
    explanation: "Walking the full page table in main RAM on every single access is slow. The TLB is an ultra-fast hardware cache of recent translations — a hit translates instantly.",
  },
  {
    id: "q5",
    text: "A program accesses a virtual page that isn't currently loaded in RAM. What is this event called?",
    options: [
      { id: "a", label: "A", text: "A TLB hit" },
      { id: "b", label: "B", text: "A stack overflow" },
      { id: "c", label: "C", text: "A Page Fault" },
      { id: "d", label: "D", text: "A kernel panic" },
    ],
    correctId: "c",
    explanation: "A Page Fault triggers a hardware trap that pauses the program, loads the needed page from disk into a free frame, updates the page table, and resumes execution.",
  },
  {
    id: "q6",
    text: "What is Demand Paging?",
    options: [
      { id: "a", label: "A", text: "Loading a program's entire memory footprint into RAM the instant it opens" },
      { id: "b", label: "B", text: "Only loading pages into RAM when they're actually accessed, rather than all at once" },
      { id: "c", label: "C", text: "Deleting unused programs permanently" },
      { id: "d", label: "D", text: "Doubling the size of physical RAM automatically" },
    ],
    correctId: "b",
    explanation: "Instead of front-loading everything, the OS loads pages on demand as they are referenced, keeping physical RAM usage lean and efficient.",
  },
  {
    id: "q7",
    text: "RAM is completely full and you try to open a new app. What does virtual memory allow the OS to do?",
    options: [
      { id: "a", label: "A", text: "Immediately throw an 'Out of Memory' crash error" },
      { id: "b", label: "B", text: "Compact and rewrite all of RAM from scratch" },
      { id: "c", label: "C", text: "Swap idle pages out to disk to free up frames, then swap them back in when needed" },
      { id: "d", label: "D", text: "Permanently delete the least-used program" },
    ],
    correctId: "c",
    explanation: "This is Swapping: idle pages get written to a swap file on disk to free physical RAM frames for active tasks, creating the illusion of infinite memory.",
  },
  {
    id: "q8",
    text: "Four running apps all use the same C library (libc). How does virtual memory avoid wasting RAM on duplicate copies?",
    options: [
      { id: "a", label: "A", text: "It compresses each copy individually" },
      { id: "b", label: "B", text: "It deletes the library from 3 of the 4 programs" },
      { id: "c", label: "C", text: "It points every program's virtual page space to the same single physical copy of the library — Shared Pages" },
      { id: "d", label: "D", text: "It's not possible to avoid this; 4 copies are always loaded" },
    ],
    correctId: "c",
    explanation: "Because address translation is a mapping table, multiple processes' virtual pages can point to the exact same physical frame in RAM — sharing memory effortlessly.",
  },
];

function getTier(score, total) {
  const pct = score / total;
  if (pct === 1) return { label: "Memory Architect", desc: "Perfect score! You understand virtual memory, TLB caching, and MMU hardware down to the bit level." };
  if (pct >= 0.75) return { label: "Solid OS Engineer", desc: "Great work! You have a strong grasp of virtual memory mechanics and page translation." };
  if (pct >= 0.5) return { label: "System Apprentice", desc: "Good effort! You're halfway there — review the Deep Dive sections for the missed topics." };
  return { label: "RAM Rookie", desc: "Worth another pass through the interactive visualizers before taking another shot!" };
}

export default function VMKnowledgeQuiz() {
  const [step, setStep] = useState(0); // 0 = intro, 1..8 = questions, >8 = results
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});

  const totalQ = questions.length;
  const isIntro = step === 0;
  const isResult = step > totalQ;
  const currentQ = questions[step - 1];

  function handleSelect(optId) {
    if (selected) return;
    setSelected(optId);
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  }

  function handleNext() {
    if (!selected) return;
    setSelected(null);
    setStep((s) => s + 1);
  }

  function handleRestart() {
    setStep(0);
    setSelected(null);
    setAnswers({});
  }

  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctId ? 1 : 0), 0);
  const tier = isResult ? getTier(score, totalQ) : null;

  return (
    <div style={{
      width: "100%",
      background: theme.cardBg,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1.5px solid ${theme.cardBorder}`,
      borderRadius: theme.radiusLg,
      padding: "2rem",
      color: theme.textPrimary,
      fontFamily: theme.fontSans,
      boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Glow effect */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '250px', height: '250px',
        background: `radial-gradient(circle, ${theme.accent}22 0%, transparent 70%)`,
        filter: 'blur(45px)', pointerEvents: 'none'
      }} />

      {/* INTRO SCREEN (CENTERED & ELEVATED UI) */}
      {isIntro && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem 0', gap: '1.25rem' }}>
          {/* Glowing Processor Icon Badge */}
          <div style={{
            width: '56px',
            height: '56px',
            minWidth: '56px',
            minHeight: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%)',
            border: '1px solid rgba(192, 132, 252, 0.35)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto',
            boxShadow: '0 0 25px rgba(192, 132, 252, 0.25)',
            boxSizing: 'border-box'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
              <rect x="9" y="9" width="6" height="6"/>
              <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
              <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
              <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/>
              <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/>
            </svg>
          </div>

          <div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 800, color: theme.neonCyan,
              letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '6px'
            }}>
              KNOWLEDGE CHECKPOINT // 8 QUESTIONS
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Virtual Memory Mastery Quiz
            </h3>
          </div>

          <p style={{ color: theme.textSecondary, fontSize: '0.95rem', lineHeight: 1.65, margin: 0, maxWidth: '620px' }}>
            Test your understanding of fragmentation, page tables, TLB cache hits, page faults, demand paging, swapping, and shared library memory. Instant answers & explanations provided!
          </p>

          {/* Centered Topic Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: '600px' }}>
            {['Fragmentation', 'Paging', 'Page Tables', 'TLB', 'Page Faults', 'Swap', 'Shared Pages'].map((topic) => (
              <span key={topic} style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: theme.accent,
                background: theme.accentDim,
                padding: '4px 12px',
                borderRadius: '999px',
                border: `1px solid ${theme.accent}33`
              }}>
                {topic}
              </span>
            ))}
          </div>

          {/* Quiz Meta Info (SVG Icons, NO EMOJIS) */}
          <div style={{ fontSize: '0.78rem', color: theme.textDim, display: 'flex', gap: '1.25rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              8 Questions
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ~3 min
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              Immediate Feedback
            </span>
          </div>

          {/* Centered Start CTA Button */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              onClick={() => setStep(1)}
              style={{
                background: `linear-gradient(135deg, ${theme.accent} 0%, #38bdf8 100%)`,
                color: '#000',
                border: 'none',
                padding: '0.85rem 2.5rem',
                borderRadius: '999px',
                fontSize: '0.95rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: `0 4px 25px ${theme.accent}55`,
                transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.boxShadow = `0 6px 30px ${theme.accent}77`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 25px ${theme.accent}55`;
              }}
            >
              Start the Quiz
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* QUESTION SCREEN */}
      {!isIntro && !isResult && currentQ && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* STEP PROGRESS BAR */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.neonCyan, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Question {step} of {totalQ}
              </span>
              <span style={{ fontSize: '0.75rem', color: theme.textDim, fontFamily: 'monospace' }}>
                {Math.round((step / totalQ) * 100)}% Complete
              </span>
            </div>

            <div style={{ display: 'flex', gap: '4px', height: '6px', borderRadius: '3px', overflow: 'hidden', background: theme.trackBg }}>
              {questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: i < step ? theme.accent : 'transparent',
                    transition: 'background 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* QUESTION TEXT */}
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: theme.textPrimary, lineHeight: 1.4 }}>
            {currentQ.text}
          </h3>

          {/* OPTIONS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQ.options.map((opt) => {
              let isSelected = selected === opt.id;
              let isCorrect = opt.id === currentQ.correctId;
              
              let borderColor = 'rgba(255,255,255,0.12)';
              let bg = 'rgba(255,255,255,0.03)';
              let textColor = theme.textPrimary;

              if (selected) {
                if (isCorrect) {
                  borderColor = theme.correct;
                  bg = theme.correctBg;
                } else if (isSelected) {
                  borderColor = theme.incorrect;
                  bg = theme.incorrectBg;
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    gap: '12px',
                    textAlign: 'left',
                    padding: '0.85rem 1.1rem',
                    borderRadius: theme.radiusMd,
                    border: `1.5px solid ${borderColor}`,
                    background: bg,
                    color: textColor,
                    cursor: selected ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 0 15px ${borderColor}33` : 'none',
                    fontFamily: theme.fontSans
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.08)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: isSelected ? '#fff' : theme.accent,
                      flexShrink: 0
                    }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{opt.text}</span>
                  </div>

                  {selected && isCorrect && (
                    <span style={{ color: theme.correct, fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>✓</span>
                  )}
                  {selected && isSelected && !isCorrect && (
                    <span style={{ color: theme.incorrect, fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* EXPLANATION CARD */}
          {selected && (
            <div style={{
              background: 'rgba(34, 211, 238, 0.08)',
              border: `1px solid ${theme.neonCyan}44`,
              borderRadius: theme.radiusMd,
              padding: '1rem 1.25rem',
              marginTop: '0.5rem',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.neonCyan} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.55 }}>
                <strong style={{ color: theme.neonCyan }}>Explanation: </strong>
                {currentQ.explanation}
              </div>
            </div>
          )}

          {/* NEXT / RESULTS BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              disabled={!selected}
              onClick={handleNext}
              style={{
                background: selected ? `linear-gradient(135deg, ${theme.accent} 0%, #818cf8 100%)` : 'rgba(255,255,255,0.05)',
                color: selected ? '#fff' : theme.textDim,
                border: `1px solid ${selected ? theme.accent : 'rgba(255,255,255,0.1)'}`,
                padding: '0.65rem 1.5rem',
                borderRadius: theme.radiusMd,
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: selected ? 'pointer' : 'not-allowed',
                transition: 'all 0.25s ease',
                opacity: selected ? 1 : 0.5
              }}
            >
              {step === totalQ ? "See Final Results →" : "Next Question →"}
            </button>
          </div>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {isResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.neonCyan, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
              QUIZ COMPLETED
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
              Your Virtual Memory Score
            </h3>
          </div>

          {/* SCORE CARD */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.accentDim} 0%, rgba(34, 211, 238, 0.08) 100%)`,
            border: `2px solid ${theme.accent}`,
            borderRadius: theme.radiusLg,
            padding: '1.75rem',
            textAlign: 'center',
            boxShadow: `0 0 30px ${theme.accent}25`
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: '6px' }}>
              {score} / {totalQ}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: theme.accent, marginBottom: '8px' }}>
              {tier.label}
            </div>
            <p style={{ fontSize: '0.9rem', color: theme.textSecondary, margin: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
              {tier.desc}
            </p>
          </div>

          {/* REVIEW LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', color: theme.textPrimary, fontWeight: 700 }}>
              Answer Breakdown
            </h4>

            {questions.map((q) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctId;
              const userOpt = q.options.find((o) => o.id === userAnswer);
              const correctOpt = q.options.find((o) => o.id === q.correctId);

              return (
                <div key={q.id} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isCorrect ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
                  borderRadius: theme.radiusMd,
                  padding: '1rem 1.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: theme.textPrimary }}>
                      {q.text}
                    </span>
                    <span style={{ color: isCorrect ? theme.correct : theme.incorrect, fontWeight: 800, flexShrink: 0 }}>
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>

                  {!isCorrect && (
                    <div style={{ fontSize: '0.8rem', color: theme.incorrect, marginBottom: '4px' }}>
                      Your answer: {userOpt ? `${userOpt.label}. ${userOpt.text}` : '—'}
                    </div>
                  )}

                  <div style={{ fontSize: '0.8rem', color: theme.correct, marginBottom: '6px' }}>
                    Correct answer: {correctOpt.label}. {correctOpt.text}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: theme.textDim, lineHeight: 1.5 }}>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={handleRestart}
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: `1px solid ${theme.border}`,
                padding: '0.75rem 2rem',
                borderRadius: theme.radiusMd,
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              ↺ Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}