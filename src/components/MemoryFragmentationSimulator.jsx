import React, { useState, useEffect } from 'react';
import s from './MemoryFragmentationSimulator.module.css';

// ── Icons ─────────
const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
const SuccessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

export default function MemoryFragmentationSimulator() {
  const [vmEnabled, setVmEnabled] = useState(false);
  const [pagesPlaced, setPagesPlaced] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null); // 'program' or 'page-0', 'page-1', etc.
  const [dragError, setDragError] = useState(false);

  // RAM configuration: 8 blocks of 1GB each
  // Indices 0-7
  // Initial state:
  // 0, 1: Free (2GB)
  // 2: Discord (1GB)
  // 3, 4, 5: Free (3GB)
  // 6: Spotify (1GB)
  // 7: Free (1GB)
  const [ram, setRam] = useState([
    { id: 0, type: 'free' },
    { id: 1, type: 'free' },
    { id: 2, type: 'discord', label: 'Discord' },
    { id: 3, type: 'free' },
    { id: 4, type: 'free' },
    { id: 5, type: 'free' },
    { id: 6, type: 'spotify', label: 'Spotify' },
    { id: 7, type: 'free' },
  ]);

  const totalPagesToPlace = 4;
  const isComplete = pagesPlaced === totalPagesToPlace;

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem === 'program') {
      // Trying to drop the whole 4GB program
      // We need 4 consecutive free blocks starting from targetIndex
      let canFit = true;
      for (let i = 0; i < 4; i++) {
        if (targetIndex + i >= ram.length || ram[targetIndex + i].type !== 'free') {
          canFit = false;
          break;
        }
      }

      if (!canFit) {
        setDragError(true);
        setTimeout(() => setDragError(false), 2000);
      }
    } else if (draggedItem.startsWith('page-')) {
      // Dropping a single 1GB page
      if (ram[targetIndex].type === 'free') {
        const newRam = [...ram];
        newRam[targetIndex] = { ...newRam[targetIndex], type: 'editor', label: 'VE Page' };
        setRam(newRam);
        setPagesPlaced(p => p + 1);
      }
    }

    setDraggedItem(null);
  };

  const resetGame = () => {
    setVmEnabled(false);
    setPagesPlaced(0);
    setDragError(false);
    setRam([
      { id: 0, type: 'free' },
      { id: 1, type: 'free' },
      { id: 2, type: 'discord', label: 'Discord' },
      { id: 3, type: 'free' },
      { id: 4, type: 'free' },
      { id: 5, type: 'free' },
      { id: 6, type: 'spotify', label: 'Spotify' },
      { id: 7, type: 'free' },
    ]);
  };

  return (
    <div className="animate-fade-up in-view" style={{
      background: "rgba(255, 255, 255, 0.02)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(196, 164, 255, 0.1)",
      borderRadius: "20px",
      padding: "2rem",
      fontFamily: "'Inter', sans-serif",
      color: "#ece8ff",
      margin: "2rem 0",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.45)"
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#faf8ff' }}>The Fragmentation Puzzle</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', minHeight: '3em' }}>
          {isComplete 
            ? "Awesome! Virtual Memory allowed you to fit the program into scattered gaps!"
            : vmEnabled
              ? "Virtual Memory Enabled! The program is now split into 1GB pages. Drag each page into a free slot."
              : "Try to drag the 4GB Video Editor into Physical RAM. It won't fit because the memory is fragmented!"}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center' }}>
        
        {/* Left Side: The Program */}
        <div style={{
          background: "rgba(0,0,0,0.2)",
          borderRadius: 12,
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,0.05)',
          minHeight: 250,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#f59e0b', marginBottom: '1rem' }}>
            Video Editor (4 GB)
          </div>

          {!vmEnabled ? (
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'program')}
              style={{
                width: '100%',
                height: 120,
                background: "rgba(245, 158, 11, 0.15)",
                border: "2px solid #f59e0b",
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                color: '#f59e0b',
                fontWeight: 700,
                boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Drag Me
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
              {[0,1,2,3].map(i => {
                const placed = i < pagesPlaced;
                return (
                  <div
                    key={i}
                    draggable={!placed}
                    onDragStart={(e) => handleDragStart(e, `page-${i}`)}
                    style={{
                      height: 55,
                      background: placed ? "transparent" : "rgba(245, 158, 11, 0.15)",
                      border: placed ? "2px dashed rgba(255,255,255,0.1)" : "2px solid #f59e0b",
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: placed ? 'default' : 'grab',
                      color: placed ? 'transparent' : '#f59e0b',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    {placed ? "" : "Page " + (i+1)}
                  </div>
                );
              })}
            </div>
          )}

          {!vmEnabled && (
            <button 
              onClick={() => setVmEnabled(true)}
              style={{
                marginTop: '1.5rem',
                background: "#22d3ee",
                color: "#0a0620",
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '999px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: "0 4px 15px rgba(34, 211, 238, 0.4)",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Enable Paging
            </button>
          )}

          {isComplete && (
            <button 
              onClick={resetGame}
              style={{
                marginTop: '1.5rem',
                background: "transparent",
                color: "#94a3b8",
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset Game
            </button>
          )}
        </div>

        {/* Right Side: RAM */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Physical RAM (8 GB)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Max Contiguous Free: <strong>3 GB</strong>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 4,
            background: "rgba(0,0,0,0.3)",
            padding: 8,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            {ram.map((slot, index) => {
              const isFree = slot.type === 'free';
              return (
                <div 
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{
                    height: 100,
                    borderRadius: 6,
                    border: isFree ? "2px dashed rgba(255,255,255,0.15)" : `1px solid ${slot.type === 'editor' ? '#f59e0b' : 'transparent'}`,
                    background: isFree ? "rgba(255,255,255,0.02)" : (slot.type === 'editor' ? "rgba(245, 158, 11, 0.2)" : "rgba(139, 92, 246, 0.2)"),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: "all 0.2s",
                    position: 'relative'
                  }}
                >
                  {!isFree && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: slot.type === 'editor' ? '#f59e0b' : '#a78bfa', textAlign: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      {slot.label}
                    </span>
                  )}
                  {isFree && (
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>1GB</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Feedback messages */}
          <div style={{ marginTop: '1.5rem', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {dragError && (
              <div className="animate-fade-in in-view" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', padding: '0.5rem 1rem', borderRadius: 8 }}>
                <AlertIcon />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>External Fragmentation! The program needs 4GB contiguous.</span>
              </div>
            )}
            {isComplete && (
              <div className="animate-fade-in in-view" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '0.5rem 1rem', borderRadius: 8 }}>
                <SuccessIcon />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Success! Virtual Memory mapped 4 separate frames into 1 virtual program.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
