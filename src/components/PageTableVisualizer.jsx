import React, { useState, useEffect } from 'react';

const theme = {
  accentCyan: "#22d3ee",
  accentPurple: "#a855f7",
  accentYellow: "#facc15",
  accentGreen: "#34d399",
  accentRed: "#f87171",
  bgGlass: "rgba(196, 164, 255, 0.04)",
  bgCard: "rgba(15, 10, 36, 0.65)",
  border: "rgba(196, 164, 255, 0.12)",
  borderGlow: "rgba(192, 132, 252, 0.35)",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textDim: "#64748b",
};

const PROCESS_DATA = [
  {
    id: 0,
    name: "Discord",
    color: theme.accentPurple,
    ptbrAddr: "0x00FF4000",
    table: [
      { vp: 0, frame: "0x12", valid: 1, dirty: 0, prot: "R/W", accessed: 1, desc: "Main UI Thread Heap" },
      { vp: 1, frame: "0x05", valid: 1, dirty: 1, prot: "R/W", accessed: 1, desc: "Audio Buffer Stream" },
      { vp: 2, frame: "Disk", valid: 0, dirty: 0, prot: "R/O", accessed: 0, desc: "Cached Image Assets" },
      { vp: 3, frame: "0x18", valid: 1, dirty: 0, prot: "R/O", accessed: 1, desc: "Shared Electron Lib" },
    ]
  },
  {
    id: 1,
    name: "Chrome",
    color: theme.accentYellow,
    ptbrAddr: "0x00FF8000",
    table: [
      { vp: 0, frame: "0x08", valid: 1, dirty: 0, prot: "R/W", accessed: 1, desc: "V8 JS Engine Heap" },
      { vp: 1, frame: "Disk", valid: 0, dirty: 0, prot: "R/W", accessed: 0, desc: "Background Tab State" },
      { vp: 2, frame: "0x02", valid: 1, dirty: 1, prot: "R/X", accessed: 1, desc: "Blink Renderer Code" },
      { vp: 3, frame: "0x09", valid: 1, dirty: 0, prot: "R/X", accessed: 1, desc: "Shared GPU Context" },
    ]
  }
];

export default function PageTableVisualizer() {
  const [activeProcess, setActiveProcess] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(0);
  
  // Simulation State
  const [simStep, setSimStep] = useState(0); 
  const [simTargetVp, setSimTargetVp] = useState(null);

  const process = PROCESS_DATA[activeProcess];
  const activeInspectRow = process.table[hoveredRow !== null ? hoveredRow : 0];

  useEffect(() => {
    if (simStep === 1) {
      const t1 = setTimeout(() => setSimStep(2), 1200);
      const t2 = setTimeout(() => setSimStep(3), 2400);
      const t3 = setTimeout(() => setSimStep(4), 3600);
      const t4 = setTimeout(() => {
        setSimStep(0);
        setSimTargetVp(null);
      }, 5500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [simStep]);

  const triggerContextSwitch = () => {
    if (simStep > 0) return;
    setActiveProcess(prev => prev === 0 ? 1 : 0);
    setHoveredRow(0);
  };

  const startMemoryAccess = (vpIndex) => {
    if (simStep > 0) return;
    setSimTargetVp(vpIndex);
    setHoveredRow(vpIndex);
    setSimStep(1);
  };

  return (
    <div style={{
      width: '100%',
      background: theme.bgCard,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid ${theme.border}`,
      borderRadius: '20px',
      padding: '1.5rem',
      color: theme.textPrimary,
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      marginBottom: '3rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow background accent */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${process.color}22 0%, transparent 70%)`,
        filter: 'blur(50px)',
        pointerEvents: 'none',
        transition: 'background 0.5s ease'
      }} />

      {/* HEADER & CONTROLS */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        borderBottom: `1px solid ${theme.border}`,
        paddingBottom: '1rem'
      }}>
        <div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: theme.accentCyan,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '2px'
          }}>
            HARDWARE ARCHITECTURE // PROCESS ISOLATION
          </div>
          <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: '1.35rem', fontWeight: 800 }}>
            Page Table Architecture
          </h3>
          <p style={{ margin: '0.25rem 0 0', color: theme.textSecondary, fontSize: '0.82rem' }}>
            Observe how the <strong style={{ color: process.color }}>PTBR</strong> points to the active process's page table in RAM.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(0,0,0,0.3)',
            padding: '0.3rem 0.65rem',
            borderRadius: '999px',
            border: `1px solid ${theme.border}`,
            fontSize: '0.75rem',
            color: theme.textSecondary
          }}>
            <span>Active Process:</span>
            <strong style={{ color: process.color }}>{process.name}</strong>
          </div>

          <button 
            onClick={triggerContextSwitch}
            disabled={simStep > 0}
            style={{
              background: `linear-gradient(135deg, ${process.color}22 0%, rgba(255,255,255,0.05) 100%)`,
              border: `1px solid ${process.color}88`,
              color: '#fff',
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              cursor: simStep > 0 ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem',
              transition: 'all 0.25s ease',
              opacity: simStep > 0 ? 0.5 : 1,
              boxShadow: `0 4px 12px ${process.color}33`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 16h5v5"/>
            </svg>
            Trigger Context Switch
          </button>
        </div>
      </div>

      {/* INTERACTIVE HOW-TO GUIDE BANNER */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        padding: '0.65rem 0.85rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: theme.accentCyan, textTransform: 'uppercase', letterSpacing: '1px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-1px' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          HOW TO INTERACT:
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: theme.textSecondary, fontSize: '0.75rem' }}>
          <span><strong>1. Switch Context:</strong> Click button above to swap PTBR between Discord & Chrome</span>
          <span><strong>2. Inspect Bits:</strong> Hover rows in Magnified Table to inspect Valid/Dirty/Permissions</span>
          <span><strong>3. Simulate:</strong> Click any Virtual Page row to run MMU memory request</span>
        </div>
      </div>

      {/* STEP SIMULATION STATUS BAR */}
      <div className="ptv-steps" style={{ gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { stepNum: 1, title: "1. PTBR Pointer", desc: "Read base address from CPU register" },
          { stepNum: 2, title: "2. Page Table Walk", desc: "Lookup Page in RAM table" },
          { stepNum: 3, title: "3. Frame Translation", desc: "Retrieve Frame # & Valid bit" },
          { stepNum: 4, title: "4. Physical Access", desc: "Access target data byte in RAM" }
        ].map((s) => {
          const isActive = simStep === s.stepNum;
          const isDone = simStep > s.stepNum;
          return (
            <div key={s.stepNum} style={{
              background: isActive ? 'rgba(34, 211, 238, 0.12)' : (isDone ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255,255,255,0.02)'),
              border: `1px solid ${isActive ? theme.accentCyan : (isDone ? theme.accentGreen : theme.border)}`,
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isActive ? theme.accentCyan : (isDone ? theme.accentGreen : theme.textDim)
              }}>
                {s.title}
              </div>
              <div style={{ fontSize: '0.68rem', color: theme.textSecondary, marginTop: '1px' }}>
                {s.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN VISUALIZATION GRID (3 COLUMNS SIDE-BY-SIDE) */}
      <div className="ptv-grid" style={{ gap: '0.85rem', alignItems: 'stretch' }}>

        {/* COLUMN 1: CPU / HARDWARE REGISTERS */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: theme.accentCyan }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: theme.accentCyan, fontWeight: 700 }}>
              Hardware / CPU
            </h4>
          </div>

          {/* PTBR Register Card */}
          <div style={{
            background: `rgba(${activeProcess === 0 ? '168, 85, 247' : '250, 204, 21'}, 0.1)`,
            border: `1.5px solid ${process.color}`,
            borderRadius: '10px',
            padding: '1rem',
            boxShadow: `0 0 15px ${process.color}22`,
            transition: 'all 0.4s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: process.color }}>PTBR</div>
              <span style={{
                fontSize: '0.62rem',
                padding: '2px 6px',
                borderRadius: '999px',
                background: 'rgba(0,0,0,0.4)',
                color: theme.textSecondary,
                fontFamily: 'monospace'
              }}>
                {process.ptbrAddr}
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: theme.textSecondary, marginTop: '2px' }}>
              Page Table Base Register
            </div>

            <div style={{
              marginTop: '0.75rem',
              paddingTop: '0.5rem',
              borderTop: `1px solid ${theme.border}`,
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', color: theme.textSecondary }}>Points to:</span>
              <strong style={{ color: process.color, fontSize: '0.85rem' }}>{process.name} Table</strong>
            </div>
          </div>

          {/* MMU Bus Status */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${theme.border}`,
            borderRadius: '10px',
            padding: '0.85rem',
            marginTop: 'auto'
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: theme.textDim, textTransform: 'uppercase', letterSpacing: '1px' }}>
              MMU Bus Activity
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginTop: '0.35rem' }}>
              {simStep === 0 && <span style={{ color: theme.textDim }}>Waiting for request...</span>}
              {simStep === 1 && <span style={{ color: theme.accentCyan }}>Reading PTBR ({process.ptbrAddr})...</span>}
              {simStep === 2 && <span style={{ color: theme.accentCyan }}>Reading Virtual Page #{simTargetVp}...</span>}
              {simStep === 3 && <span style={{ color: theme.accentGreen }}>Retrieved Frame {process.table[simTargetVp].frame}</span>}
              {simStep === 4 && <span style={{ color: theme.accentRed }}>Fetching Frame {process.table[simTargetVp].frame} Data</span>}
            </div>
          </div>
        </div>

        {/* COLUMN 2: PHYSICAL RAM ARCHITECTURE */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: theme.accentPurple }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: theme.textPrimary, fontWeight: 700 }}>
                Physical RAM
              </h4>
            </div>
            <span style={{ fontSize: '0.68rem', color: theme.textDim }}>Fixed Frames</span>
          </div>

          {/* Process Page Tables in RAM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {PROCESS_DATA.map((p, idx) => {
              const isCurrent = activeProcess === idx;
              return (
                <div key={p.id} style={{
                  background: isCurrent ? `${p.color}18` : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${isCurrent ? p.color : theme.border}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  transition: 'all 0.3s ease',
                  boxShadow: isCurrent ? `0 0 12px ${p.color}25` : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, color: isCurrent ? '#fff' : theme.textSecondary, fontSize: '0.82rem' }}>
                      {p.name} Page Table
                    </div>
                    {isCurrent && (
                      <span style={{
                        fontSize: '0.6rem',
                        background: p.color,
                        color: '#000',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        fontWeight: 800
                      }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: theme.textDim, marginTop: '2px' }}>
                    Address: {p.ptbrAddr}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Payload Target */}
          <div style={{
            marginTop: 'auto',
            background: simStep >= 4 ? 'rgba(248, 113, 113, 0.15)' : 'rgba(255,255,255,0.02)',
            border: `1.5px dashed ${simStep >= 4 ? theme.accentRed : theme.border}`,
            borderRadius: '8px',
            padding: '0.75rem',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '0.68rem', color: theme.textDim, fontWeight: 700, uppercase: 'true' }}>
              Target Data Payload
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: simStep >= 4 ? theme.accentRed : '#fff', marginTop: '2px' }}>
              {simTargetVp !== null ? `Frame ${process.table[simTargetVp].frame}` : 'Frame ???'}
            </div>
            <div style={{ fontSize: '0.68rem', color: theme.textSecondary, marginTop: '2px' }}>
              {simTargetVp !== null ? process.table[simTargetVp].desc : 'Click Virtual Page row to access'}
            </div>
          </div>
        </div>

        {/* COLUMN 3: MAGNIFIED PAGE TABLE & BIT INSPECTOR */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: `1px solid ${process.color}88`,
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: `0 0 20px ${process.color}15`
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: process.color }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: process.color, fontWeight: 700 }}>
                {process.name} Page Table (Magnified)
              </h4>
            </div>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.7rem', color: theme.textSecondary }}>
              Hover to inspect bits. Click row to simulate memory request.
            </p>
          </div>

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr',
            color: theme.textDim,
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            paddingBottom: '0.35rem',
            borderBottom: `1px solid ${theme.border}`
          }}>
            <div>Virtual Page</div>
            <div>Frame</div>
            <div>Status</div>
          </div>

          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {process.table.map((row, idx) => {
              const isSelected = simTargetVp === idx;
              const isHovered = hoveredRow === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onClick={() => startMemoryAccess(idx)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr',
                    alignItems: 'center',
                    padding: '0.5rem 0.65rem',
                    background: isSelected ? 'rgba(34, 211, 238, 0.15)' : (isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'),
                    borderRadius: '6px',
                    cursor: simStep > 0 ? 'not-allowed' : 'pointer',
                    border: `1px solid ${isSelected ? theme.accentCyan : (isHovered ? 'rgba(255,255,255,0.2)' : 'transparent')}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#fff' }}>
                    Page {row.vp}
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    color: row.valid ? theme.accentGreen : theme.accentRed
                  }}>
                    {row.frame}
                  </div>
                  <div>
                    <span style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: row.valid ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                      color: row.valid ? theme.accentGreen : theme.accentRed,
                      border: `1px solid ${row.valid ? theme.accentGreen : theme.accentRed}44`
                    }}>
                      {row.valid ? 'VALID' : 'SWAPPED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DOCKED BIT INSPECTOR */}
          <div style={{
            marginTop: 'auto',
            background: 'rgba(0, 0, 0, 0.4)',
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '0.65rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>
                BIT INSPECTOR // PAGE #{activeInspectRow.vp}
              </span>
              <span style={{ fontSize: '0.65rem', color: theme.accentCyan, fontWeight: 600 }}>
                {activeInspectRow.desc}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginTop: '0.15rem' }}>
              <div style={{
                background: activeInspectRow.valid ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeInspectRow.valid ? theme.accentGreen : theme.border}`,
                padding: '0.3rem',
                borderRadius: '5px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.58rem', color: theme.textDim }}>Valid Bit</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: activeInspectRow.valid ? theme.accentGreen : theme.textDim }}>
                  {activeInspectRow.valid}
                </div>
              </div>

              <div style={{
                background: activeInspectRow.dirty ? 'rgba(250, 204, 21, 0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeInspectRow.dirty ? theme.accentYellow : theme.border}`,
                padding: '0.3rem',
                borderRadius: '5px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.58rem', color: theme.textDim }}>Dirty Bit</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: activeInspectRow.dirty ? theme.accentYellow : theme.textDim }}>
                  {activeInspectRow.dirty}
                </div>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: `1px solid rgba(168, 85, 247, 0.3)`,
                padding: '0.3rem',
                borderRadius: '5px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.58rem', color: theme.textDim }}>Permissions</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff' }}>
                  {activeInspectRow.prot}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* TWO ACCESS PENALTY NOTICE */}
      {simStep > 0 && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(34, 211, 238, 0.12)',
          border: `1px solid ${theme.accentCyan}`,
          padding: '0.65rem 1rem',
          borderRadius: '10px',
          color: theme.accentCyan,
          fontWeight: 700,
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)'
        }}>
          <div>
            <strong>The Two-Access Penalty:</strong> Notice how accessing a single virtual byte required <u>2 separate RAM lookups</u> (1st for the Page Table entry in RAM, 2nd for actual Data Payload in RAM). This is why hardware requires a <strong>TLB cache</strong>!
          </div>
        </div>
      )}

      <style>{`
        .ptv-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .ptv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.15fr;
        }
        @media (max-width: 900px) {
          .ptv-steps {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .ptv-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
