import { useState } from "react";

const theme = {
  fontSans: "'Inter', system-ui, -apple-system, sans-serif",
  textPrimary: "var(--ml-heading)",
  textSecondary: "var(--ml-text-muted)",
  accent: "var(--ml-accent)",
  accentBg: "var(--ml-accent-dim)",
  cardBg: "var(--ml-bg-card)",
  cardBorder: "var(--ml-border)",
  trackBg: "var(--ml-border)",
  radiusSm: "var(--ml-radius-sm)",
  radiusMd: "var(--ml-radius-md)",
  radiusLg: "var(--ml-radius-lg)",
  correct: "#4ade80",
  correctBg: "rgba(74, 222, 128, 0.12)",
  incorrect: "#f87171",
  incorrectBg: "rgba(248, 113, 113, 0.12)",
};

// Quiz
const questions = [
  {
    id: "q1",
    text: "Why does external fragmentation happen?",
    options: [
      { id: "a", text: "RAM chips physically wear out over time" },
      { id: "b", text: "Programs opening and closing leave scattered free holes, even though total free memory may be enough" },
      { id: "c", text: "The CPU runs out of registers" },
      { id: "d", text: "The page table gets corrupted" },
    ],
    correctId: "b",
    explanation: "As programs start and stop, the holes they leave behind end up scattered. The total free space can be plenty, but no single hole may be big enough for a new program.",
  },
  {
    id: "q2",
    text: "What's the relationship between a page and a frame?",
    options: [
      { id: "a", text: "Pages are physical, frames are virtual" },
      { id: "b", text: "They're the same thing, just different names" },
      { id: "c", text: "Pages are fixed-size chunks of virtual memory; frames are the matching fixed-size chunks of physical RAM" },
      { id: "d", text: "A page is always 1 GB, a frame is always 4 KB" },
    ],
    correctId: "c",
    explanation: "Both virtual memory and physical RAM are divided into fixed-size chunks (typically 4 KB) -- the virtual-side chunks are pages, the physical-side chunks are frames.",
  },
  {
    id: "q3",
    text: "What does the page table actually store?",
    options: [
      { id: "a", text: "The mapping from each virtual page to the physical frame it lives in" },
      { id: "b", text: "A backup copy of every running program" },
      { id: "c", text: "The list of programs waiting to open" },
      { id: "d", text: "The user's saved passwords" },
    ],
    correctId: "a",
    explanation: "One page table per process, storing virtual-page-to-physical-frame mappings. The CPU consults it (or the TLB) on every memory access to translate addresses.",
  },
  {
    id: "q4",
    text: "Why does the CPU have a TLB (Translation Lookaside Buffer) at all?",
    options: [
      { id: "a", text: "To store swapped-out pages" },
      { id: "b", text: "To cache recently used page-to-frame mappings so translation doesn't require a slow page table walk every time" },
      { id: "c", text: "To physically expand RAM capacity" },
      { id: "d", text: "To detect malicious programs" },
    ],
    correctId: "b",
    explanation: "Walking the full page table in main memory on every single access would be slow. The TLB is a small, fast cache of recent translations -- a hit means near-instant translation.",
  },
  {
    id: "q5",
    text: "A program accesses a virtual page that isn't currently loaded into RAM. What is this event called?",
    options: [
      { id: "a", text: "A TLB hit" },
      { id: "b", text: "A stack overflow" },
      { id: "c", text: "A page fault" },
      { id: "d", text: "A kernel panic" },
    ],
    correctId: "c",
    explanation: "A page fault pauses the program, loads the needed page from disk into a free frame, updates the page table, then resumes -- all handled by the OS.",
  },
  {
    id: "q6",
    text: "What is demand paging?",
    options: [
      { id: "a", text: "Loading a program's entire memory footprint into RAM the instant it opens" },
      { id: "b", text: "Only loading pages into RAM when they're actually needed, rather than all at once" },
      { id: "c", text: "Deleting unused programs permanently" },
      { id: "d", text: "Doubling the size of RAM automatically" },
    ],
    correctId: "b",
    explanation: "Instead of front-loading everything, the OS loads pages on demand -- which is what makes page faults possible and keeps RAM usage efficient.",
  },
  {
    id: "q7",
    text: "RAM is completely full and you try to open a new program. What does virtual memory let the OS do?",
    options: [
      { id: "a", text: "Immediately throw an 'Out of Memory' error with no recovery" },
      { id: "b", text: "Compact and rewrite all of RAM from scratch" },
      { id: "c", text: "Swap idle pages out to disk to free up frames, then swap them back in when needed" },
      { id: "d", text: "Permanently delete the least-used program" },
    ],
    correctId: "c",
    explanation: "This is swapping: idle pages get moved to a swap file on disk to free RAM for what's needed now. It's what creates the illusion of near-infinite memory, at some speed cost.",
  },
  {
    id: "q8",
    text: "Four running programs all use the same C library (libc). How does virtual memory avoid wasting RAM on 4 duplicate copies?",
    options: [
      { id: "a", text: "It compresses each copy individually" },
      { id: "b", text: "It deletes the library from 3 of the 4 programs" },
      { id: "c", text: "It points every program's virtual address space to the same single physical copy of the library — shared pages" },
      { id: "d", text: "It's not possible to avoid this; 4 copies are always loaded" },
    ],
    correctId: "c",
    explanation: "Because virtual-to-physical translation is just a mapping, multiple processes' virtual pages can point at the exact same physical frame -- one physical copy, shared by all.",
  },
];

function getTier(score, total) {
  const pct = score / total;
  if (pct === 1) return { label: "Memory Master", desc: "Perfect score — you could explain the MMU pipeline to a CPU." };
  if (pct >= 0.75) return { label: "Solid Understanding", desc: "You've got the core mechanics down. A quick re-read of the missed items below will lock it in." };
  if (pct >= 0.5) return { label: "Getting There", desc: "Halfway there — revisit the Deep Dive section for the ones you missed." };
  return { label: "Needs Review", desc: "Worth another pass through the exhibit before this one sticks. Check the explanations below." };
}

// Styles
const styles = {
  progressBar: (filled) => ({
    flex: 1,
    height: 4,
    borderRadius: 2,
    background: filled ? theme.accent : theme.trackBg,
    transition: "background 0.2s",
  }),
  optionBtn: (state) => {
    // state: 'default' | 'correct' | 'incorrect' | 'reveal-correct' (unselected but is the right answer, shown after reveal)
    let border = `1px solid ${theme.cardBorder}`;
    let background = theme.cardBg;
    if (state === "correct") { border = `2px solid ${theme.correct}`; background = theme.correctBg; }
    if (state === "incorrect") { border = `2px solid ${theme.incorrect}`; background = theme.incorrectBg; }
    if (state === "reveal-correct") { border = `2px dashed ${theme.correct}`; background = theme.correctBg; }
    return {
      position: "relative",
      cursor: state === "locked" ? "default" : "pointer",
      textAlign: "left",
      padding: "12px 14px",
      width: "100%",
      display: "block",
      borderRadius: theme.radiusMd,
      border,
      background,
      transition: "border-color 0.15s, background 0.15s",
      fontFamily: theme.fontSans,
    };
  },
  nextBtn: (enabled) => ({
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: 14,
    padding: "8px 18px",
    borderRadius: theme.radiusMd,
    border: `1px solid ${theme.cardBorder}`,
    background: enabled ? theme.accentBg : "transparent",
    color: enabled ? theme.accent : theme.textSecondary,
    opacity: enabled ? 1 : 0.5,
    fontFamily: theme.fontSans,
    fontWeight: 600,
  }),
  reviewCard: (isCorrect) => ({
    background: theme.cardBg,
    border: `1px solid ${isCorrect ? theme.correct : theme.incorrect}`,
    borderRadius: theme.radiusMd,
    padding: "1rem",
    marginBottom: 10,
  }),
};

export default function VirtualMemoryKnowledgeQuiz() {
  const [step, setStep] = useState(0); // 0 = intro, 1..totalQ = questions, >totalQ = result
  const [selected, setSelected] = useState(null); // option id chosen for the current question
  const [answers, setAnswers] = useState({}); // { questionId: optionId }

  const totalQ = questions.length;
  const isIntro = step === 0;
  const isResult = step > totalQ;
  const currentQ = questions[step - 1];

  function handleSelect(optId) {
    if (selected) return; // lock after first pick so the reveal can't be gamed
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
    <div style={{ padding: "1.5rem 0", fontFamily: theme.fontSans, color: theme.textPrimary }}>

      {/* -- Intro -- */}
      {isIntro && (
        <div>
          <p style={{ color: theme.textSecondary, marginBottom: "1.25rem", fontSize: 15, lineHeight: 1.6 }}>
            8 questions covering fragmentation, paging, the page table, the TLB, page faults, demand paging, swap, and shared pages. Answers are revealed as you go.
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

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.25rem" }}>
            {currentQ.options.map((opt) => {
              let state = "default";
              if (selected) {
                if (opt.id === currentQ.correctId) {
                  state = opt.id === selected ? "correct" : "reveal-correct";
                } else if (opt.id === selected) {
                  state = "incorrect";
                }
              }
              return (
                <button
                  key={opt.id}
                  style={styles.optionBtn(state)}
                  onClick={() => handleSelect(opt.id)}
                  aria-pressed={selected === opt.id}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, color: theme.textPrimary }}>{opt.text}</span>
                    {state === "correct" && <span style={{ color: theme.correct, fontWeight: 700 }}>✓</span>}
                    {state === "incorrect" && <span style={{ color: theme.incorrect, fontWeight: 700 }}>✗</span>}
                    {state === "reveal-correct" && <span style={{ color: theme.correct, fontSize: 12 }}>correct answer</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {selected && (
            <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {currentQ.explanation}
            </p>
          )}

          <button style={styles.nextBtn(!!selected)} disabled={!selected} onClick={handleNext}>
            {step === totalQ ? "See my results ->" : "Next ->"}
          </button>
        </div>
      )}

      {/* -- Result -- */}
      {isResult && (
        <div>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: "0 0 0.5rem" }}>
            Your score
          </p>
          <div style={{
            background: theme.cardBg,
            border: `2px solid ${theme.accent}`,
            borderRadius: theme.radiusLg,
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: theme.textPrimary, marginBottom: 4 }}>
              {score} / {totalQ}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: theme.accent, marginBottom: 6 }}>
              {tier.label}
            </div>
            <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>
              {tier.desc}
            </p>
          </div>

          <p style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary, marginBottom: "0.75rem" }}>
            Review
          </p>
          {questions.map((q) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctId;
            const userOpt = q.options.find((o) => o.id === userAnswer);
            const correctOpt = q.options.find((o) => o.id === q.correctId);
            return (
              <div key={q.id} style={styles.reviewCard(isCorrect)}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>{q.text}</span>
                  <span style={{ color: isCorrect ? theme.correct : theme.incorrect, fontWeight: 700, flexShrink: 0 }}>
                    {isCorrect ? "✓" : "✗"}
                  </span>
                </div>
                {!isCorrect && (
                  <p style={{ fontSize: 13, color: theme.incorrect, margin: "0 0 4px" }}>
                    Your answer: {userOpt?.text ?? "—"}
                  </p>
                )}
                <p style={{ fontSize: 13, color: theme.correct, margin: "0 0 6px" }}>
                  Correct answer: {correctOpt.text}
                </p>
                <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.55, margin: 0 }}>
                  {q.explanation}
                </p>
              </div>
            );
          })}

          <button style={{ ...styles.nextBtn(true), marginTop: 8 }} onClick={handleRestart}>
            ↺ Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}