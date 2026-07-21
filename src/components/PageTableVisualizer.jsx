import React, { useState, useEffect } from 'react';

const theme = {
  accentCyan: "#22d3ee",
  accentPurple: "#a855f7",
  accentYellow: "#facc15",
  accentGreen: "#34d399",
  accentRed: "#f87171",
  bgGlass: "rgba(255, 255, 255, 0.03)",
  border: "rgba(196, 164, 255, 0.1)",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
};

const PROCESS_DATA = [
  {
    id: 0,
    name: "Discord",
    color: theme.accentPurple,
    ramOffset: 20, // percentage from top in RAM visualization
    table: [
      { vp: 0, frame: "0x12", valid: 1, dirty: 0, prot: "R/W", accessed: 1 },
      { vp: 1, frame: "0x05", valid: 1, dirty: 1, prot: "R/W", accessed: 1 },
      { vp: 2, frame: "Disk", valid: 0, dirty: 0, prot: "R/O", accessed: 0 },
      { vp: 3, frame: "0x18", valid: 1, dirty: 0, prot: "R/O", accessed: 1 },
    ]
  },
  {
    id: 1,
    name: "Chrome",
    color: theme.accentYellow,
    ramOffset: 60,
    table: [
      { vp: 0, frame: "0x08", valid: 1, dirty: 0, prot: "R/W", accessed: 1 },
      { vp: 1, frame: "Disk", valid: 0, dirty: 0, prot: "R/W", accessed: 0 },
      { vp: 2, frame: "0x02", valid: 1, dirty: 1, prot: "R/X", accessed: 1 },
      { vp: 3, frame: "0x09", valid: 1, dirty: 0, prot: "R/X", accessed: 1 },
    ]
  }
];

export default function PageTableVisualizer() {
  const [activeProcess, setActiveProcess] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);
  
  // Simulation State
  const [simStep, setSimStep] = useState(0); 
  const [simTargetVp, setSimTargetVp] = useState(null);

  const process = PROCESS_DATA[activeProcess];

  useEffect(() => {
    if (simStep === 1) {
      const t1 = setTimeout(() => setSimStep(2), 1500); // Reached PT in RAM
      const t2 = setTimeout(() => setSimStep(3), 3000); // Back to CPU with Frame
      const t3 = setTimeout(() => setSimStep(4), 4500); // Signal to actual Frame in RAM
      const t4 = setTimeout(() => {
        setSimStep(0);
        setSimTargetVp(null);
      }, 7000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [simStep]);

  const triggerContextSwitch = () => {
    if (simStep > 0) return; // Block during simulation
    setActiveProcess(prev => prev === 0 ? 1 : 0);
    setHoveredRow(null);
  };

  const startMemoryAccess = (vpIndex) => {
    if (simStep > 0) return;
    setSimTargetVp(vpIndex);
    setSimStep(1);
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: `1px solid ${theme.border}`,
      borderRadius: '16px',
      padding: '2rem',
      color: theme.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      position: 'relative',
      marginBottom: '3rem'
    }}>
      {/* HEADER CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: '1.25rem' }}>Page Table Architecture</h3>
          <p style={{ margin: '0.25rem 0 0', color: theme.textSecondary, fontSize: '0.9rem' }}>
            Observe how the PTBR points to the active process's page table in RAM.
          </p>
        </div>
        <button 
          onClick={triggerContextSwitch}
          disabled={simStep > 0}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: `1px solid rgba(255,255,255,0.2)`,
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: simStep > 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s',
            opacity: simStep > 0 ? 0.5 : 1
          }}
          onMouseOver={e => !simStep && (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          onMouseOut={e => !simStep && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        >
          Trigger Context Switch
        </button>
      </div>

      {/* MAIN VISUALIZATION AREA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '1.5rem', position: 'relative' }}>
        
        {/* SVG ARROWS & ANIMATIONS */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <marker id="arrowCpu" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill={theme.accentCyan} />
            </marker>
            <marker id="arrowCpuRed" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill={theme.accentRed} />
            </marker>
            <marker id="arrowReturn" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill={theme.accentGreen} />
            </marker>
          </defs>

          {/* PTBR Arrow */}
          <path 
            d={`M 35% 35% L 40% ${process.ramOffset + 5}%`} 
            fill="none" 
            stroke={process.color} 
            strokeWidth="3" 
            strokeDasharray="6,4"
            markerEnd="url(#arrowCpu)"
            style={{ transition: 'all 0.5s ease-in-out' }}
          />

          {/* Simulation Signals */}
          {simStep >= 1 && (
            <path 
              d={`M 15% 70% L 40% ${process.ramOffset + 15}%`}
              fill="none" stroke={theme.accentCyan} strokeWidth="3"
              strokeDasharray="150" strokeDashoffset={simStep >= 1 ? 0 : 150}
              style={{ transition: 'stroke-dashoffset 1s linear', opacity: simStep >= 1 && simStep < 3 ? 1 : 0 }}
              markerEnd="url(#arrowCpu)"
            />
          )}
          {simStep >= 2 && (
            <path 
              d={`M 40% ${process.ramOffset + 15}% L 15% 70%`}
              fill="none" stroke={theme.accentGreen} strokeWidth="3"
              strokeDasharray="150" strokeDashoffset={simStep >= 2 ? 0 : 150}
              style={{ transition: 'stroke-dashoffset 1s linear', opacity: simStep >= 2 && simStep < 4 ? 1 : 0 }}
              markerEnd="url(#arrowReturn)"
            />
          )}
          {simStep >= 4 && (
            <path 
              d={`M 15% 70% L 55% 85%`}
              fill="none" stroke={theme.accentRed} strokeWidth="3"
              strokeDasharray="200" strokeDashoffset={simStep >= 4 ? 0 : 200}
              style={{ transition: 'stroke-dashoffset 1s linear', opacity: simStep >= 4 ? 1 : 0 }}
              markerEnd="url(#arrowCpuRed)"
            />
          )}
        </svg>

        {/* COLUMN 1: CPU & PTBR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 1rem', color: theme.accentCyan }}>Hardware / CPU</h4>
            
            <div style={{
              background: 'rgba(34, 211, 238, 0.1)',
              border: `1px solid rgba(34, 211, 238, 0.3)`,
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              boxShadow: `0 0 15px rgba(34, 211, 238, 0.2)`
            }}>
              <div style={{ fontSize: '0.8rem', color: theme.accentCyan, fontWeight: 'bold' }}>PTBR</div>
              <div style={{ fontSize: '0.7rem', color: theme.textSecondary }}>Page Table Base Register</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: process.color, transition: 'color 0.3s' }}>
                Points to {process.name}
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${theme.border}`,
              padding: '1rem',
              borderRadius: '8px',
              marginTop: 'auto'
            }}>
              <div style={{ fontSize: '0.8rem', color: theme.textSecondary }}>MMU Memory Request</div>
              <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: '0.5rem' }}>
                {simStep === 0 && "Waiting..."}
                {simStep === 1 && <span style={{ color: theme.accentCyan }}>Accessing RAM (Page Table)</span>}
                {simStep === 2 && <span style={{ color: theme.accentGreen }}>Retrieved Frame Number</span>}
                {simStep >= 3 && <span style={{ color: theme.accentRed }}>Accessing RAM (Actual Data)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: PHYSICAL RAM */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '1.5rem',
          position: 'relative',
          minHeight: '350px'
        }}>
          <h4 style={{ margin: '0 0 1rem', color: theme.textSecondary, textAlign: 'center' }}>Physical RAM</h4>
          
          {PROCESS_DATA.map((p, idx) => (
            <div key={p.id} style={{
              position: 'absolute',
              top: `${p.ramOffset}%`,
              left: '10%',
              right: '10%',
              background: activeProcess === idx ? `rgba(${idx===0?'168,85,247':'250,204,21'}, 0.2)` : 'rgba(255,255,255,0.05)',
              border: `2px solid ${activeProcess === idx ? p.color : theme.border}`,
              borderRadius: '8px',
              padding: '0.8rem',
              textAlign: 'center',
              transition: 'all 0.5s',
              boxShadow: activeProcess === idx ? `0 0 15px ${p.color}40` : 'none',
              transform: activeProcess === idx ? 'scale(1.05)' : 'scale(1)'
            }}>
              <div style={{ color: activeProcess === idx ? '#fff' : theme.textSecondary, fontWeight: 'bold' }}>
                {p.name} Page Table
              </div>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginTop: '0.2rem' }}>
                Stored in fixed frames
              </div>
            </div>
          ))}

          <div style={{
            position: 'absolute',
            bottom: '5%',
            left: '10%',
            right: '10%',
            background: simStep >= 4 ? 'rgba(248, 113, 113, 0.2)' : 'rgba(255,255,255,0.02)',
            border: `2px dashed ${simStep >= 4 ? theme.accentRed : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ color: simStep >= 4 ? '#fff' : theme.textDim, fontWeight: 'bold' }}>Target Data Block</div>
            <div style={{ fontSize: '0.7rem', color: theme.textDim }}>Frame {simTargetVp !== null ? process.table[simTargetVp].frame : '???'}</div>
          </div>
        </div>

        {/* COLUMN 3: MAGNIFIED PAGE TABLE */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${process.color}`,
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: `0 0 20px ${process.color}20`,
          transition: 'all 0.5s',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <h4 style={{ margin: '0 0 0.5rem', color: process.color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: process.color }}></span>
            {process.name} Page Table (Magnified)
          </h4>
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: theme.textSecondary }}>
            Hover a row to inspect bits. Click to simulate a memory request.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', color: theme.textSecondary, fontSize: '0.8rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
              <div>Virtual Page</div>
              <div>Frame</div>
            </div>

            {process.table.map((row, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => startMemoryAccess(idx)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  padding: '0.75rem',
                  background: hoveredRow === idx || simTargetVp === idx ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                  borderRadius: '6px',
                  cursor: simStep > 0 ? 'not-allowed' : 'pointer',
                  border: `1px solid ${simTargetVp === idx ? theme.accentCyan : 'transparent'}`,
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>Page {row.vp}</div>
                <div style={{ color: row.valid ? theme.accentGreen : theme.accentRed }}>{row.frame}</div>
                
                {/* TOOLTIP FOR BITS */}
                {hoveredRow === idx && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '105%',
                    transform: 'translateY(-50%)',
                    background: '#1e293b',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    width: '180px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 20
                  }}>
                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Status Bits</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{ background: row.valid ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '4px', textAlign: 'center', border: `1px solid ${row.valid ? theme.accentGreen : theme.border}` }}>
                        <div style={{ fontSize: '0.6rem', color: theme.textSecondary }}>Valid</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: row.valid ? theme.accentGreen : theme.textDim }}>{row.valid}</div>
                      </div>
                      <div style={{ background: row.dirty ? 'rgba(250, 204, 21, 0.2)' : 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '4px', textAlign: 'center', border: `1px solid ${row.dirty ? theme.accentYellow : theme.border}` }}>
                        <div style={{ fontSize: '0.6rem', color: theme.textSecondary }}>Dirty</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: row.dirty ? theme.accentYellow : theme.textDim }}>{row.dirty}</div>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Protection Bits</div>
                    <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: `1px solid rgba(168, 85, 247, 0.3)`, padding: '0.4rem', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>{row.prot}</div>
                      <div style={{ fontSize: '0.6rem', color: theme.textSecondary }}>{row.prot === 'R/W' ? 'Read / Write' : row.prot === 'R/O' ? 'Read Only' : 'Read / Execute'}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: `1px solid ${theme.border}`, fontSize: '0.8rem', color: theme.textSecondary }}>
            {simStep === 0 && "Select a Virtual Page to request memory."}
            {simStep === 1 && <span style={{ color: theme.accentCyan }}>MMU is reading the Page Table in RAM...</span>}
            {simStep === 2 && <span style={{ color: theme.accentGreen }}>Frame found! Waiting for CPU...</span>}
            {simStep >= 3 && <span style={{ color: theme.accentRed }}>CPU now accessing actual Data Frame in RAM!</span>}
          </div>
        </div>
      </div>
      
      {/* TWO ACCESS PROBLEM EXPLANATION */}
      {simStep > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(34, 211, 238, 0.1)',
          border: `1px solid ${theme.accentCyan}`,
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          color: theme.accentCyan,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          animation: 'pulse 2s infinite'
        }}>
          Notice: The CPU had to access RAM <u>TWICE</u> for a single request!
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
        }
      `}</style>
    </div>
  );
}
