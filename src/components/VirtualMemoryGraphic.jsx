import React, { useState, useEffect } from 'react';

export default function VirtualMemoryGraphic() {
  const [virtualAddrHex, setVirtualAddrHex] = useState('0x1A4C');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeStage, setActiveStage] = useState(0); // 0: CPU Gen, 1: Bit Split, 2: Page Table Lookup, 3: RAM Frame Target
  const [tlbHit, setTlbHit] = useState(true);

  // Mappings: Virtual Page -> Physical Frame
  const PAGE_TABLE = [
    { vPage: 0, frame: 12, valid: true, process: 'Web Browser (Code)' },
    { vPage: 1, frame: 3,  valid: true, process: 'Web Browser (Heap)' },
    { vPage: 2, frame: 18, valid: true, process: 'VS Code Editor' },
    { vPage: 3, frame: 7,  valid: true, process: 'Discord Messenger' },
    { vPage: 4, frame: 14, valid: true, process: 'System Kernel Library' },
    { vPage: 5, frame: -1, valid: false, process: 'Page Fault (On Disk)' },
    { vPage: 6, frame: 9,  valid: true, process: 'GPU Frame Buffer' },
  ];

  const PRESETS = [
    { label: 'Browser Heap (Page 1)', hex: '0x1C4A', pageIdx: 1 },
    { label: 'Code Editor (Page 2)', hex: '0x21F0', pageIdx: 2 },
    { label: 'Shared Kernel (Page 4)', hex: '0x4080', pageIdx: 4 },
    { label: 'Unmapped Page (Page Fault)', hex: '0x53A0', pageIdx: 5 },
  ];

  const currentMapping = PAGE_TABLE[PRESETS[selectedPreset].pageIdx];

  const triggerTranslation = () => {
    if (isTranslating) return;
    setIsTranslating(true);
    setActiveStage(0);

    setTimeout(() => setActiveStage(1), 500);
    setTimeout(() => setActiveStage(2), 1100);
    setTimeout(() => {
      setActiveStage(3);
      setIsTranslating(false);
    }, 1800);
  };

  const handleSelectPreset = (idx) => {
    setSelectedPreset(idx);
    setVirtualAddrHex(PRESETS[idx].hex);
    setTlbHit(PRESETS[idx].pageIdx !== 5);
    triggerTranslation();
  };

  useEffect(() => {
    triggerTranslation();
  }, []);

  return (
    <div style={{
      background: 'rgba(13, 17, 32, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '20px',
      padding: '1.75rem',
      color: '#ece8ff',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.08)',
      margin: '2rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top HUD Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isTranslating ? '#f59e0b' : '#10b981',
            boxShadow: isTranslating ? '0 0 10px #f59e0b' : '0 0 10px #10b981'
          }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#38bdf8' }}>
            HARDWARE MMU PIPELINE // VIRTUAL TO PHYSICAL MAPPER
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              style={{
                background: selectedPreset === idx ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${selectedPreset === idx ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                color: selectedPreset === idx ? '#38bdf8' : '#94a3b8',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Circuit Flow Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginTop: '1.5rem',
        position: 'relative'
      }}>

        {/* Stage 1: CPU Virtual Address */}
        <div style={{
          background: activeStage >= 0 ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${activeStage >= 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: '14px',
          padding: '1.25rem',
          transition: 'all 0.4s ease',
          boxShadow: activeStage === 0 ? '0 0 20px rgba(56, 189, 248, 0.25)' : 'none'
        }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>
            1. CPU Virtual Address
          </div>
          <div style={{ fontSize: '1.4rem', fontFamily: 'monospace', fontWeight: 800, color: '#faf8ff' }}>
            {virtualAddrHex}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            Target: <span style={{ color: '#ece8ff', fontWeight: 600 }}>{PRESETS[selectedPreset].label}</span>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '0.5rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Page #{PRESETS[selectedPreset].pageIdx}</span>
            <span>Offset 0x24C</span>
          </div>
        </div>

        {/* Stage 2: MMU & TLB Cache */}
        <div style={{
          background: activeStage >= 1 ? 'rgba(167, 139, 250, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${activeStage >= 1 ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: '14px',
          padding: '1.25rem',
          transition: 'all 0.4s ease',
          boxShadow: activeStage === 1 ? '0 0 20px rgba(167, 139, 250, 0.25)' : 'none'
        }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#a78bfa', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>
            2. MMU / TLB Cache
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: '100px',
              backgroundColor: tlbHit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: tlbHit ? '#10b981' : '#ef4444',
              border: `1px solid ${tlbHit ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
            }}>
              {tlbHit ? 'TLB FAST HIT' : 'TLB MISS (PAGE TABLE WALK)'}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0' }}>
            {tlbHit ? 'Instant hardware translation cache match!' : 'Must walk full page table hierarchy.'}
          </p>
        </div>

        {/* Stage 3: Page Table Directory */}
        <div style={{
          background: activeStage >= 2 ? 'rgba(129, 140, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${activeStage >= 2 ? 'rgba(129, 140, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: '14px',
          padding: '1.25rem',
          transition: 'all 0.4s ease',
          boxShadow: activeStage === 2 ? '0 0 20px rgba(129, 140, 248, 0.25)' : 'none'
        }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>
            3. Page Table Lookup
          </div>
          {currentMapping.valid ? (
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>
                Page #{currentMapping.vPage} → Frame #{currentMapping.frame}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Status: <span style={{ color: '#38bdf8' }}>VALID IN RAM</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ef4444' }}>
                PAGE FAULT DETECTED!
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                Page is swapped out on Disk Storage. OS pausing process to load...
              </div>
            </div>
          )}
        </div>

        {/* Stage 4: Physical RAM Target */}
        <div style={{
          background: activeStage >= 3 ? (currentMapping.valid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)') : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${activeStage >= 3 ? (currentMapping.valid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: '14px',
          padding: '1.25rem',
          transition: 'all 0.4s ease',
          boxShadow: activeStage === 3 ? (currentMapping.valid ? '0 0 20px rgba(16, 185, 129, 0.25)' : '0 0 20px rgba(239, 68, 68, 0.25)') : 'none'
        }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: currentMapping.valid ? '#10b981' : '#ef4444', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>
            4. Physical RAM Location
          </div>
          {currentMapping.valid ? (
            <div>
              <div style={{ fontSize: '1.3rem', fontFamily: 'monospace', fontWeight: 800, color: '#10b981' }}>
                Frame #{currentMapping.frame}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Phys Address: <span style={{ color: '#faf8ff', fontFamily: 'monospace' }}>0x{(currentMapping.frame * 0x1000 + 0x24C).toString(16).toUpperCase()}</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>
                DISK SWAP SECTOR #84
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Fetching from NVMe Storage...
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Action Control Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          * Virtual Memory isolates processes by giving each app its own virtual translation map.
        </span>
        <button
          onClick={triggerTranslation}
          disabled={isTranslating}
          style={{
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            color: '#070913',
            border: 'none',
            padding: '0.6rem 1.4rem',
            borderRadius: '100px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: isTranslating ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)',
            transition: 'all 0.2s ease',
            opacity: isTranslating ? 0.6 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          {isTranslating ? 'Translating Bus Signal...' : 'Re-run Address Signal'}
        </button>
      </div>

    </div>
  );
}
