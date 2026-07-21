import React, { useState } from 'react';

const theme = {
  bgGlass: "rgba(255, 255, 255, 0.03)",
  border: "rgba(255, 255, 255, 0.1)",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  accentBlue: "#38bdf8",
  accentRed: "#f43f5e",
  accentGreen: "#34d399",
  accentYellow: "#facc15",
};

export default function PageTableEntryVisualizer() {
  const [step, setStep] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handlePlay = () => setHasPlayed(true);
  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  // Dummy rows for step 0
  const extraRows = [1, 2, 3, 4];

  return (
    <div style={{
      background: 'rgba(10, 6, 32, 0.7)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${theme.border}`,
      borderRadius: '20px',
      padding: '2rem 3rem',
      color: theme.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      marginBottom: '3rem',
      height: '680px',
      overflow: 'hidden'
    }}>
      {/* PLAY BUTTON LAYER (Step 0) */}
      {!hasPlayed && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, background: 'rgba(10, 6, 32, 0.5)' }}>
          <button onClick={handlePlay} className="btn-play">PLAY</button>
        </div>
      )}

      {/* HEADER */}
      <div style={{ zIndex: 10, opacity: hasPlayed ? 1 : 0.3, transition: 'opacity 0.5s' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase' }}>Anatomy of a Page Table Entry (PTE)</div>
        <h4 style={{ margin: '5px 0 0 0', fontSize: '1.4rem', color: '#fff', minHeight: '32px' }}>
          {step === 0 && "System Page Table"}
          {step === 1 && "Isolating an Entry"}
          {step === 2 && "Frame Number Payload"}
          {step === 3 && "Protection Bits"}
          {step === 4 && "Status Bits"}
        </h4>
      </div>

      {/* SIDE ARROWS */}
      <div style={{ position: 'absolute', left: '1rem', top: '45%', transform: 'translateY(-50%)', zIndex: 30, opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s' }}>
        <button onClick={handleBack} disabled={step <= 0} className={`side-btn ${step > 0 ? 'active' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </div>
      <div style={{ position: 'absolute', right: '1rem', top: '45%', transform: 'translateY(-50%)', zIndex: 30, opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s' }}>
        <button onClick={handleNext} disabled={step === 4} className={`side-btn ${step < 4 ? 'active next' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      {/* MAIN VISUALIZATION AREA */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3rem', opacity: hasPlayed ? 1 : 0.3, transition: 'opacity 0.5s' }}>
        
        {/* ROW 0 (The Hero Row) */}
        <div style={{
          display: 'flex', alignItems: 'center', 
          transform: 'scale(1)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
          zIndex: 20,
          position: 'relative'
        }}>
          {/* Page 0 Text */}
          <div style={{
            width: step >= 2 ? '0px' : '70px',
            marginRight: step >= 2 ? '0px' : '8px',
            opacity: step >= 2 ? 0 : 1,
            transform: step >= 2 ? 'translateX(-20px)' : 'translateX(0)',
            overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0,
            fontWeight: 'bold', color: theme.textSecondary,
            transition: 'all 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)'
          }}>Page 0</div>

          {/* Arrow */}
          <div style={{
            width: step >= 2 ? '0px' : '30px',
            marginRight: step >= 2 ? '0px' : '8px',
            opacity: step >= 2 ? 0 : 1,
            transform: step >= 2 ? 'translateX(-20px)' : 'translateX(0)',
            overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0,
            color: '#38bdf8', fontWeight: 'bold',
            transition: 'all 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)'
          }}>➔</div>

          {/* FRAME NUMBER BLOCK */}
          <div style={{
            width: '280px', height: '50px',
            marginRight: '8px', flexShrink: 0,
            background: step === 2 ? theme.accentBlue : 'rgba(56, 189, 248, 0.1)',
            border: `2px solid ${theme.accentBlue}`, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', letterSpacing: '1px',
            color: step === 2 ? '#fff' : 'rgba(56, 189, 248, 0.8)',
            boxShadow: step === 2 ? `0 0 30px ${theme.accentBlue}80` : 'none',
            transform: step === 2 ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)',
            position: 'relative', zIndex: step === 2 ? 30 : 10
          }}>
            FRAME NUMBER
          </div>

          {/* PROTECTION BLOCK */}
          <div style={{
            width: '140px', height: '50px',
            marginRight: '8px', flexShrink: 0,
            background: step === 3 ? theme.accentRed : 'rgba(244, 63, 94, 0.1)',
            border: `2px solid ${theme.accentRed}`, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', letterSpacing: '1px',
            color: step === 3 ? '#fff' : 'rgba(244, 63, 94, 0.8)',
            boxShadow: step === 3 ? `0 0 30px ${theme.accentRed}80` : 'none',
            transform: step === 3 ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)',
            position: 'relative', zIndex: step === 3 ? 30 : 10
          }}>
            PROTECTION
          </div>

          {/* STATUS BLOCK */}
          <div style={{
            width: '140px', height: '50px', flexShrink: 0,
            background: step === 4 ? theme.accentGreen : 'rgba(52, 211, 153, 0.1)',
            border: `2px solid ${theme.accentGreen}`, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', letterSpacing: '1px',
            color: step === 4 ? '#fff' : 'rgba(52, 211, 153, 0.8)',
            boxShadow: step === 4 ? `0 0 30px ${theme.accentGreen}80` : 'none',
            transform: step === 4 ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)',
            position: 'relative', zIndex: step === 4 ? 30 : 10
          }}>
            STATUS
          </div>
        </div>

        {/* DETAILS DROPDOWNS (Absolutely positioned so they don't break flex height!) */}
        <div style={{ position: 'absolute', top: '90px', width: '100%', height: '180px', zIndex: 30 }}>
          
          {/* STEP 2: FRAME POPOUT */}
          <div style={{
            position: 'absolute', top: '40px', left: '50%', transform: `translate(calc(-50% - 148px), ${step === 2 ? '0' : '-20px'})`,
            width: '320px', 
            background: 'rgba(56, 189, 248, 0.1)', border: `1px solid rgba(56, 189, 248, 0.4)`,
            borderRadius: '12px', padding: '1.5rem', textAlign: 'center',
            boxShadow: `0 10px 20px rgba(56, 189, 248, 0.1)`,
            opacity: step === 2 ? 1 : 0,
            visibility: step === 2 ? 'visible' : 'hidden',
            pointerEvents: step === 2 ? 'auto' : 'none',
            transition: 'all 0.5s'
          }}>
            <div style={{ width: '2px', height: '50px', background: theme.accentBlue, position: 'absolute', top: '-50px', left: '50%' }}></div>
            <h3 style={{ color: theme.accentBlue, margin: '0 0 0.5rem 0' }}>The Physical Address</h3>
            <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: 'normal' }}>
              This is the actual result of translating the virtual page number. The MMU takes this frame number and attaches the exact byte offset to find the physical memory location in RAM!
            </p>
          </div>

          {/* STEP 3: PROTECTION POPOUT */}
          <div style={{
            position: 'absolute', top: '40px', left: '50%', transform: `translate(-50%, ${step === 3 ? '0' : '-20px'})`,
            width: '500px', display: 'flex', gap: '10px',
            opacity: step === 3 ? 1 : 0,
            visibility: step === 3 ? 'visible' : 'hidden',
            pointerEvents: step === 3 ? 'auto' : 'none',
            transition: 'all 0.5s'
          }}>
            <div style={{ width: '2px', height: '50px', background: theme.accentRed, position: 'absolute', top: '-50px', left: '320px' }}></div>
            <div style={{ width: '340px', height: '2px', background: theme.accentRed, position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
            
            {[
              { title: 'Read Only', desc: 'Prevents writing to read-only memory.' },
              { title: 'User / Super', desc: 'Stops access to OS Kernel memory.' },
              { title: 'No Execute', desc: 'Blocks injected malware code.' }
            ].map((b, i) => (
              <div key={i} style={{
                flex: 1, background: 'rgba(244, 63, 94, 0.1)', border: `1px solid rgba(244, 63, 94, 0.4)`,
                borderRadius: '12px', padding: '1rem', textAlign: 'center',
                boxShadow: `0 10px 20px rgba(244, 63, 94, 0.1)`, position: 'relative', marginTop: '10px'
              }}>
                <div style={{ width: '2px', height: '10px', background: theme.accentRed, position: 'absolute', top: '-10px', left: '50%' }}></div>
                <div style={{ color: '#fff', fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>{b.title}</div>
                <div style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 'normal', lineHeight: '1.4' }}>{b.desc}</div>
              </div>
            ))}
          </div>

          {/* STEP 4: STATUS POPOUT */}
          <div style={{
            position: 'absolute', top: '40px', left: '50%', transform: `translate(-50%, ${step === 4 ? '0' : '-20px'})`,
            width: '640px', display: 'flex', gap: '8px',
            opacity: step === 4 ? 1 : 0,
            visibility: step === 4 ? 'visible' : 'hidden',
            pointerEvents: step === 4 ? 'auto' : 'none',
            transition: 'all 0.5s'
          }}>
            <div style={{ width: '2px', height: '50px', background: theme.accentGreen, position: 'absolute', top: '-50px', left: '538px' }}></div>
            <div style={{ width: '500px', height: '2px', background: theme.accentGreen, position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
            
            {[
              { title: 'Valid / Present', desc: 'Is this page actually in RAM?' },
              { title: 'Dirty / Modded', desc: 'Needs to be saved to disk?' },
              { title: 'Accessed', desc: 'Used recently? Helps LRU.' },
              { title: 'Global', desc: 'Shared OS Kernel page?' }
            ].map((b, i) => (
              <div key={i} style={{
                flex: 1, background: 'rgba(52, 211, 153, 0.1)', border: `1px solid rgba(52, 211, 153, 0.4)`,
                borderRadius: '12px', padding: '1rem 0.5rem', textAlign: 'center',
                boxShadow: `0 10px 20px rgba(52, 211, 153, 0.1)`, position: 'relative', marginTop: '10px'
              }}>
                <div style={{ width: '2px', height: '10px', background: theme.accentGreen, position: 'absolute', top: '-10px', left: '50%' }}></div>
                <div style={{ color: '#fff', fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '0.8rem' }}>{b.title}</div>
                <div style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 'normal', lineHeight: '1.4' }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EXTRA ROWS (Slide out and fade out on Step 1) */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem',
          opacity: step >= 1 ? 0 : 0.5,
          transform: step >= 1 ? 'translateX(-50px)' : 'translateX(0)',
          pointerEvents: 'none',
          transition: 'all 0.5s ease',
          zIndex: 10
        }}>
          {extraRows.map(id => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '70px', flexShrink: 0, fontWeight: 'bold', color: theme.textSecondary }}>Page {id}</div>
              <div style={{ width: '30px', flexShrink: 0, color: '#38bdf8', fontWeight: 'bold' }}>➔</div>
              <div style={{ width: '280px', flexShrink: 0, height: '40px', background: 'rgba(56, 189, 248, 0.05)', border: `1px dashed rgba(56, 189, 248, 0.3)`, borderRadius: '8px' }}></div>
              <div style={{ width: '140px', flexShrink: 0, height: '40px', background: 'rgba(244, 63, 94, 0.05)', border: `1px dashed rgba(244, 63, 94, 0.3)`, borderRadius: '8px' }}></div>
              <div style={{ width: '140px', flexShrink: 0, height: '40px', background: 'rgba(52, 211, 153, 0.05)', border: `1px dashed rgba(52, 211, 153, 0.3)`, borderRadius: '8px' }}></div>
            </div>
          ))}
          
          {/* Vertical dots row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <div style={{ width: '70px', flexShrink: 0, textAlign: 'center', fontWeight: 'bold', color: theme.textSecondary }}>⋮</div>
            <div style={{ width: '30px', flexShrink: 0, textAlign: 'center', color: '#38bdf8', fontWeight: 'bold' }}>⋮</div>
            <div style={{ width: '280px', flexShrink: 0, height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textSecondary, fontWeight: 'bold' }}>⋮</div>
            <div style={{ width: '140px', flexShrink: 0, height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textSecondary, fontWeight: 'bold' }}>⋮</div>
            <div style={{ width: '140px', flexShrink: 0, height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textSecondary, fontWeight: 'bold' }}>⋮</div>
          </div>

          {/* Page n row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <div style={{ width: '70px', flexShrink: 0, fontWeight: 'bold', color: theme.textSecondary }}>Page n</div>
            <div style={{ width: '30px', flexShrink: 0, color: '#38bdf8', fontWeight: 'bold' }}>➔</div>
            <div style={{ width: '280px', flexShrink: 0, height: '40px', background: 'rgba(56, 189, 248, 0.05)', border: `1px dashed rgba(56, 189, 248, 0.3)`, borderRadius: '8px' }}></div>
            <div style={{ width: '140px', flexShrink: 0, height: '40px', background: 'rgba(244, 63, 94, 0.05)', border: `1px dashed rgba(244, 63, 94, 0.3)`, borderRadius: '8px' }}></div>
            <div style={{ width: '140px', flexShrink: 0, height: '40px', background: 'rgba(52, 211, 153, 0.05)', border: `1px dashed rgba(52, 211, 153, 0.3)`, borderRadius: '8px' }}></div>
          </div>
        </div>

      </div>

      {/* FOOTER TEXT */}
      <div style={{ 
        marginTop: 'auto', padding: '1.5rem', borderRadius: '12px', minHeight: '80px', display: 'flex', alignItems: 'center', zIndex: 10, 
        background: step === 0 ? 'rgba(255,255,255,0.05)' : (step === 2 ? 'rgba(56, 189, 248, 0.1)' : (step === 3 ? 'rgba(244, 63, 94, 0.1)' : (step === 4 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.05)'))), 
        borderLeft: `4px solid ${step === 0 ? '#fff' : (step === 2 ? '#38bdf8' : (step === 3 ? '#f43f5e' : (step === 4 ? '#34d399' : '#fff')))}`, 
        opacity: hasPlayed ? 1 : 0, transition: 'all 0.5s' 
      }}>
        <p style={{ margin: 0, fontSize: '1.05rem', color: '#e2e8f0', lineHeight: '1.6' }}>
          {step === 0 && "This entire structure is a Page Table. It contains multiple entries (rows), one for every virtual page your program might use."}
          {step === 1 && "Let's isolate a single Page Table Entry (PTE). Each entry is packed with specific fields that the hardware MMU reads on every memory access."}
          {step === 2 && "The Frame Number is the core payload. It tells the hardware exactly which block of physical RAM holds the data."}
          {step === 3 && "Protection Bits enforce memory security. If a user program tries to write to a 'Read Only' page, the MMU physically blocks it and throws an error!"}
          {step === 4 && "Status Bits help the Operating System manage memory. They track if a page is actually in RAM, if it's been edited, and if it's safe to evict."}
        </p>
      </div>

      <style>{`
        .btn-play {
          background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
          border: none; border-radius: 50%; width: 100px; height: 100px;
          color: #fff; fontSize: 1.2rem; fontWeight: bold; cursor: pointer; 
          box-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
          transition: transform 0.3s;
        }
        .btn-play:hover { transform: scale(1.05); }

        .side-btn {
          background: rgba(255,255,255,0.02); color: #475569;
          border: 1px solid transparent; border-radius: 50%; width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; cursor: not-allowed;
        }
        .side-btn.active {
          background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
        }
        .side-btn.active.next {
          background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8;
        }
        .side-btn.active.next:hover {
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
        }
      `}</style>
    </div>
  );
}
