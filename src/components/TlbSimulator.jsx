import { useState, useEffect } from 'react';

// Theme tokens (matches Memory Lab dark neon theme)
const theme = {
  accentCyan: "#22d3ee",
  accentBlue: "#818cf8",
  accentPurple: "#a78bfa",
  accentGreen: "#34d399",
  accentAmber: "#f59e0b",
  accentRed: "#f87171",
  bgGlass: "rgba(255, 255, 255, 0.03)",
  border: "rgba(196, 164, 255, 0.1)",
  borderGlow: "rgba(192, 132, 252, 0.3)",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textDim: "#64748b"
};

const INITIAL_TLB = [
  { slot: 0, tag: 0, frame: 4, valid: true },
  { slot: 1, tag: 2, frame: 7, valid: true },
  { slot: 2, tag: 4, frame: 1, valid: true },
  { slot: 3, tag: 5, frame: 3, valid: true },
];

const INITIAL_PAGE_TABLE = [
  { page: 0, frame: 4, valid: true },
  { page: 1, frame: 5, valid: true },
  { page: 2, frame: 7, valid: true },
  { page: 3, frame: 9, valid: true },
  { page: 4, frame: 1, valid: true },
  { page: 5, frame: 3, valid: true },
  { page: 6, frame: 2, valid: true },
  { page: 7, frame: null, valid: false }, // Triggers page fault
];

export default function TlbSimulator() {
  const [selectedPage, setSelectedPage] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tlb, setTlb] = useState(INITIAL_TLB);
  const [pageTable, setPageTable] = useState(INITIAL_PAGE_TABLE);
  
  // Simulation progress states
  const [simSteps, setSimSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [statusText, setStatusText] = useState("Select a virtual page above to begin address translation.");
  const [outcome, setOutcome] = useState(null); // 'hit' | 'miss' | 'fault'
  const [highlightTlbSlot, setHighlightTlbSlot] = useState(null);
  const [highlightPtRow, setHighlightPtRow] = useState(null);

  // Eviction pointer (for FIFO replacement demonstration)
  const [nextEvictionSlot, setNextEvictionSlot] = useState(0);

  // Stop simulation on unmount
  useEffect(() => {
    return () => {
      // Cleanup timers if any
    };
  }, []);

  function handleReset() {
    setSelectedPage(null);
    setIsSimulating(false);
    setTlb(INITIAL_TLB);
    setPageTable(INITIAL_PAGE_TABLE);
    setSimSteps([]);
    setCurrentStepIndex(-1);
    setStatusText("Select a virtual page above to begin address translation.");
    setOutcome(null);
    setHighlightTlbSlot(null);
    setHighlightPtRow(null);
    setNextEvictionSlot(0);
  }

  function startSimulation(pageIndex) {
    if (isSimulating) return;
    
    setSelectedPage(pageIndex);
    setIsSimulating(true);
    setOutcome(null);
    setHighlightTlbSlot(null);
    setHighlightPtRow(null);
    
    const pageNum = pageIndex;
    
    // Check TLB Hit
    const tlbMatch = tlb.find(e => e.tag === pageNum && e.valid);
    
    let steps = [];
    
    if (tlbMatch) {
      // TLB HIT FLOW
      steps = [
        {
          text: `CPU requests translation for Virtual Page ${pageNum}.`,
          action: () => {
            setHighlightTlbSlot(null);
            setHighlightPtRow(null);
          }
        },
        {
          text: `Searching TLB cache for Tag ${pageNum}...`,
          action: () => {
            // Flash TLB Cache
          }
        },
        {
          text: `TLB MATCH FOUND in Slot ${tlbMatch.slot}! (TLB Hit)`,
          action: () => {
            setHighlightTlbSlot(tlbMatch.slot);
            setOutcome('hit');
          }
        },
        {
          text: `Translated directly to Physical Frame ${tlbMatch.frame}. Latency: ~1 cycle (extremely fast).`,
          action: () => {}
        }
      ];
    } else {
      // TLB MISS FLOW
      const ptMatch = pageTable[pageNum];
      
      if (ptMatch.valid) {
        // TLB MISS, PAGE TABLE HIT
        steps = [
          {
            text: `CPU requests translation for Virtual Page ${pageNum}.`,
            action: () => {}
          },
          {
            text: `Searching TLB cache for Tag ${pageNum}...`,
            action: () => {}
          },
          {
            text: `TLB MISS! Tag ${pageNum} is not cached in the TLB. Checking Page Table in main memory (RAM)...`,
            action: () => {
              setOutcome('miss');
            }
          },
          {
            text: `Page Table Lookup: Page ${pageNum} is present in RAM at Physical Frame ${ptMatch.frame}.`,
            action: () => {
              setHighlightPtRow(pageNum);
            }
          },
          {
            text: `Updating TLB cache (evicting Slot ${nextEvictionSlot} to make room for Page ${pageNum} -> Frame ${ptMatch.frame}).`,
            action: () => {
              // Perform TLB Cache update
              setTlb(prev => {
                const updated = [...prev];
                updated[nextEvictionSlot] = { slot: nextEvictionSlot, tag: pageNum, frame: ptMatch.frame, valid: true };
                return updated;
              });
              setHighlightTlbSlot(nextEvictionSlot);
              setNextEvictionSlot((nextEvictionSlot + 1) % 4);
            }
          },
          {
            text: `Address translated to Physical Frame ${ptMatch.frame}. Main memory access penalty: ~100 cycles.`,
            action: () => {}
          }
        ];
      } else {
        // TLB MISS, PAGE FAULT (Page 7)
        steps = [
          {
            text: `CPU requests translation for Virtual Page ${pageNum}.`,
            action: () => {}
          },
          {
            text: `Searching TLB cache for Tag ${pageNum}...`,
            action: () => {}
          },
          {
            text: `TLB MISS! Tag ${pageNum} is not cached in the TLB. Checking Page Table...`,
            action: () => {
              setOutcome('miss');
            }
          },
          {
            text: `PAGE FAULT! Page Table shows Page ${pageNum} is not resident in physical RAM (Present bit = 0).`,
            action: () => {
              setHighlightPtRow(pageNum);
              setOutcome('fault');
            }
          },
          {
            text: `Interrupt triggered. Operating system halts the process and requests Page ${pageNum} from secondary Disk storage. (Extremely slow!)`,
            action: () => {}
          },
          {
            text: `Loading Page ${pageNum} into free physical memory (assigned Frame 6). Updating Page Table: Page ${pageNum} -> Frame 6 (Present bit = 1).`,
            action: () => {
              setPageTable(prev => {
                const updated = [...prev];
                updated[pageNum] = { page: pageNum, frame: 6, valid: true };
                return updated;
              });
              setHighlightPtRow(pageNum);
            }
          },
          {
            text: `Updating TLB cache (evicting Slot ${nextEvictionSlot} to make room for Page ${pageNum} -> Frame 6).`,
            action: () => {
              setTlb(prev => {
                const updated = [...prev];
                updated[nextEvictionSlot] = { slot: nextEvictionSlot, tag: pageNum, frame: 6, valid: true };
                return updated;
              });
              setHighlightTlbSlot(nextEvictionSlot);
              setNextEvictionSlot((nextEvictionSlot + 1) % 4);
            }
          },
          {
            text: `Instruction restarted. Translated Virtual Page ${pageNum} to Physical Frame 6. Total overhead: ~10,000,000 cycles.`,
            action: () => {}
          }
        ];
      }
    }

    setSimSteps(steps);
    setCurrentStepIndex(0);
    setStatusText(steps[0].text);
    steps[0].action();

    // Run sequential steps with timeouts to animate the flow
    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setCurrentStepIndex(stepIdx);
        setStatusText(steps[stepIdx].text);
        steps[stepIdx].action();
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1800);
  }

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${theme.border}`,
      borderRadius: 20,
      padding: "2rem",
      boxShadow: "0 4px 40px rgba(0, 0, 0, 0.35)",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: theme.textPrimary,
      marginTop: "1.5rem",
      marginBottom: "2rem"
    }}>
      {/* Title block */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ margin: "0 0 0.4rem 0", fontSize: "1.25rem", fontWeight: 800, color: theme.textPrimary }}>
          TLB Address Translation Simulator
        </h4>
        <p style={{ margin: 0, fontSize: "0.85rem", color: theme.textSecondary, lineHeight: 1.5 }}>
          Request a virtual address page lookup below to trace the hardware translation path through the fast <strong>TLB Cache</strong> and main memory <strong>Page Table</strong>.
        </p>
      </div>

      {/* Page Access Selector */}
      <div style={{
        background: "rgba(255, 255, 255, 0.01)",
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: "1rem",
        marginBottom: "1.5rem",
      }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem" }}>
          1. Select a Virtual Page to Translate:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {INITIAL_PAGE_TABLE.map((item, idx) => {
            const isSelected = selectedPage === idx;
            let expectedOutcome = "TLB Hit";
            let color = theme.accentGreen;
            
            if (idx === 1 || idx === 3 || idx === 6) {
              expectedOutcome = "TLB Miss";
              color = theme.accentAmber;
            } else if (idx === 7) {
              expectedOutcome = "Page Fault";
              color = theme.accentRed;
            }

            return (
              <button
                key={idx}
                disabled={isSimulating}
                onClick={() => startSimulation(idx)}
                style={{
                  cursor: isSimulating ? "not-allowed" : "pointer",
                  background: isSelected ? "rgba(255,255,255,0.08)" : "rgba(255, 255, 255, 0.02)",
                  border: isSelected ? `2px solid ${theme.accentCyan}` : `1px solid ${theme.border}`,
                  borderRadius: 10,
                  padding: "0.6rem 0.85rem",
                  flex: "1 1 calc(25% - 8px)",
                  minWidth: 120,
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  transform: isSelected ? "translateY(-1px)" : "none",
                  boxShadow: isSelected ? `0 0 10px rgba(34, 211, 238, 0.2)` : "none"
                }}
                onMouseEnter={(e) => {
                  if (!isSimulating && !isSelected) {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSimulating && !isSelected) {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                  }
                }}
              >
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: theme.textPrimary }}>
                  Virtual Page {idx}
                </div>
                <div style={{ fontSize: "0.65rem", color: color, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                  {expectedOutcome}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Layout of TLB and Page Table */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1.8fr",
        gap: "1.25rem",
        marginBottom: "1.5rem"
      }}>
        {/* TLB Cache Column */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: theme.accentCyan, textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
              TLB Cache
            </div>
            <span style={{ fontSize: "0.62rem", color: theme.textDim, fontWeight: 600 }}>Fast SRAM (4 Slots)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {tlb.map((entry, idx) => {
              const isHighlighted = highlightTlbSlot === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: isHighlighted ? "rgba(52, 211, 153, 0.08)" : "rgba(255, 255, 255, 0.02)",
                    border: isHighlighted
                      ? `1px solid ${theme.accentGreen}`
                      : `1px solid ${theme.border}`,
                    borderRadius: 8,
                    padding: "0.5rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    boxShadow: isHighlighted ? `0 0 10px rgba(52, 211, 153, 0.2)` : "none"
                  }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: theme.textSecondary }}>
                    Slot {idx}
                  </div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: theme.textPrimary }}>
                    Tag: {entry.tag}
                  </div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: theme.accentCyan }}>
                    → Frame {entry.frame}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Page Table Column */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          padding: "1rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: theme.accentBlue, textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
              Page Table (Main Memory)
            </div>
            <span style={{ fontSize: "0.62rem", color: theme.textDim, fontWeight: 600 }}>DRAM Lookup Table</span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 6
          }}>
            {pageTable.map((entry, idx) => {
              const isHighlighted = highlightPtRow === idx;
              const isCachedInTlb = tlb.some(e => e.tag === idx && e.valid);
              return (
                <div
                  key={idx}
                  style={{
                    background: isHighlighted
                      ? entry.valid ? "rgba(129, 140, 248, 0.08)" : "rgba(248, 113, 113, 0.08)"
                      : "rgba(255, 255, 255, 0.01)",
                    border: isHighlighted
                      ? entry.valid ? `1px solid ${theme.accentBlue}` : `1px solid ${theme.accentRed}`
                      : isCachedInTlb
                        ? `1px dashed ${theme.accentCyan}77`
                        : `1px solid ${theme.border}`,
                    borderRadius: 8,
                    padding: "0.45rem 0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: theme.textPrimary }}>P{idx}</span>
                    {isCachedInTlb && (
                      <span style={{ fontSize: "0.55rem", padding: "1px 4px", background: "rgba(34, 211, 238, 0.12)", color: theme.accentCyan, borderRadius: 3, fontWeight: 700 }}>
                        TLB
                      </span>
                    )}
                  </div>
                  
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: entry.valid ? theme.accentCyan : theme.accentRed }}>
                    {entry.valid ? `Frame ${entry.frame}` : "Disk"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulator Execution Log / Steps */}
      <div style={{
        background: "rgba(0, 0, 0, 0.2)",
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: "1.25rem",
      }}>
        {/* Header with outcome badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "1px" }}>
            2. System Diagnostics Output:
          </div>
          {outcome && (
            <span style={{
              fontSize: "0.68rem",
              fontWeight: 800,
              textTransform: "uppercase",
              padding: "0.2rem 0.75rem",
              borderRadius: 100,
              background: outcome === 'hit' ? "rgba(52, 211, 153, 0.15)" : outcome === 'miss' ? "rgba(245, 158, 11, 0.15)" : "rgba(248, 113, 113, 0.15)",
              color: outcome === 'hit' ? theme.accentGreen : outcome === 'miss' ? theme.accentAmber : theme.accentRed,
              border: `1px solid ${outcome === 'hit' ? theme.accentGreen : outcome === 'miss' ? theme.accentAmber : theme.accentRed}33`,
              boxShadow: `0 0 10px ${outcome === 'hit' ? theme.accentGreen : outcome === 'miss' ? theme.accentAmber : theme.accentRed}1a`
            }}>
              {outcome === 'hit' ? "TLB Hit" : outcome === 'miss' ? "TLB Miss" : "Page Fault"}
            </span>
          )}
        </div>

        {/* Live log message */}
        <div style={{
          minHeight: "44px",
          background: "rgba(255, 255, 255, 0.01)",
          border: `1px solid rgba(255, 255, 255, 0.05)`,
          borderRadius: 8,
          padding: "0.75rem 1rem",
          fontSize: "0.85rem",
          color: theme.textPrimary,
          lineHeight: 1.5,
          marginBottom: "1rem",
          borderLeft: `3px solid ${outcome === 'hit' ? theme.accentGreen : outcome === 'miss' ? theme.accentAmber : outcome === 'fault' ? theme.accentRed : theme.accentCyan}`
        }}>
          {statusText}
        </div>

        {/* Trace steps checkmark list */}
        {simSteps.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {simSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    opacity: isCompleted ? 1 : 0.25,
                    transition: "opacity 0.25s ease",
                    fontSize: "0.78rem"
                  }}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: isCompleted ? isCurrent ? theme.accentCyan : theme.accentGreen : "rgba(255,255,255,0.1)",
                    color: "#0a0e1a",
                    fontWeight: 700,
                    fontSize: "0.55rem",
                    marginTop: 2,
                    flexShrink: 0
                  }}>
                    {isCompleted && !isCurrent ? "✓" : idx + 1}
                  </span>
                  <span style={{
                    color: isCurrent ? theme.accentCyan : theme.textSecondary,
                    fontWeight: isCurrent ? 600 : 500
                  }}>
                    {step.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulator controls */}
      {selectedPage !== null && (
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            disabled={isSimulating}
            onClick={handleReset}
            style={{
              cursor: isSimulating ? "not-allowed" : "pointer",
              background: "transparent",
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
              padding: "0.5rem 1.25rem",
              borderRadius: 8,
              fontSize: "0.8rem",
              fontWeight: 600,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (!isSimulating) {
                e.currentTarget.style.color = theme.accentRed;
                e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.3)";
                e.currentTarget.style.background = "rgba(248, 113, 113, 0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSimulating) {
                e.currentTarget.style.color = theme.textSecondary;
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            Reset Simulator
          </button>
        </div>
      )}
    </div>
  );
}
