import React, { useState, useEffect, useRef } from 'react';

const theme = {
  bgGlass: "rgba(255, 255, 255, 0.03)",
  border: "rgba(255, 255, 255, 0.1)",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
};

const processes = [
  { id: 0, pid: 1024, name: 'Discord', color: '#a855f7' },
  { id: 1, pid: 2048, name: 'Chrome', color: '#facc15' },
  { id: 2, pid: 3072, name: 'Spotify', color: '#34d399' },
  { id: 3, pid: 4096, name: 'Valorant', color: '#f43f5e' },
  { id: 4, pid: 5120, name: 'VS Code', color: '#3b82f6' },
  { id: 5, pid: 6144, name: 'Steam', color: '#0ea5e9' },
  { id: 6, pid: 7168, name: 'OBS', color: '#f97316' },
  { id: 7, pid: 8192, name: 'Terminal', color: '#a8a29e' },
];

export default function ContextSwitchVisualizer() {
  const [activeTable, setActiveTable] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [prevTable, setPrevTable] = useState(null);
  const [hoveredTable, setHoveredTable] = useState(null);

  const handlePlay = () => {
    setHasPlayed(true);
  };

  const handleTableClick = (id) => {
    if (!hasPlayed) return;
    if (activeTable === id) {
      setPrevTable(activeTable);
      setActiveTable(null); // deselect
    } else {
      setPrevTable(activeTable !== null ? activeTable : null);
      setActiveTable(id);
    }
  };

  // Base coordinates for SVG lines
  const ptbrX = 50;
  const ptbrY = 65; 
  
  const getTableCenterX = (i) => {
    const tableWidth = 10;
    const gap = 1.428;
    return 5 + i * (tableWidth + gap) + (tableWidth / 2);
  };

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
      gap: '1.5rem',
      position: 'relative',
      marginBottom: '3rem',
      userSelect: 'none',
      minHeight: '650px',
      overflow: 'hidden'
    }}>
      {/* PLAY BUTTON LAYER */}
      {!hasPlayed && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, background: 'rgba(10, 6, 32, 0.5)' }}>
          <button onClick={handlePlay} style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', border: 'none', borderRadius: '50%', width: '100px', height: '100px',
              color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 30px rgba(56, 189, 248, 0.5)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >PLAY</button>
        </div>
      )}

      {/* TITLES */}
      <div style={{ zIndex: 10, opacity: hasPlayed ? 1 : 0.3, transition: 'opacity 0.5s' }}>
        <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', letterSpacing: '1px', margin: 0 }}>
          Interactive Context Switch and PTBR
        </h2>
        <p style={{ margin: '0.5rem 0 0', color: theme.textSecondary, fontSize: '1rem' }}>
          Select a Page Table to load its mapped process into the CPU. Notice how the PTBR dynamically updates to point to the active page table!
        </p>
      </div>

      {/* TRANSPARENT VISUALIZATION CONTAINER */}
      <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '520px', opacity: hasPlayed ? 1 : 0.3, transition: 'opacity 0.5s' }}>
        
        {/* ORTHOGONAL LINE LAYER (Replaces broken SVG paths) */}
        {activeTable !== null && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
            {/* Segment 1: Vertical drop from PTBR */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '73%',
              width: '2px',
              height: '5%',
              background: '#fff',
              transformOrigin: 'top center',
              animation: 'drawVertical 0.15s ease-out forwards'
            }}></div>
            
            {/* Segment 2: Horizontal travel */}
            <div style={{
              position: 'absolute',
              top: '78%',
              left: `${Math.min(50, getTableCenterX(activeTable))}%`,
              width: `${Math.abs(50 - getTableCenterX(activeTable))}%`,
              height: '2px',
              background: '#fff',
              transformOrigin: getTableCenterX(activeTable) < 50 ? 'right center' : 'left center',
              opacity: 0,
              animation: 'drawHorizontal 0.15s ease-out 0.15s forwards'
            }}></div>
            
            {/* Segment 3: Vertical drop to PT */}
            <div style={{
              position: 'absolute',
              left: `${getTableCenterX(activeTable)}%`,
              top: '78%',
              width: '2px',
              height: '7%',
              background: '#fff',
              transformOrigin: 'top center',
              opacity: 0,
              animation: 'drawVertical 0.1s ease-out 0.3s forwards'
            }}>
              {/* Arrowhead */}
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: '-4px',
                width: '0',
                height: '0',
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '8px solid #fff'
              }}></div>
            </div>
          </div>
        )}

        {/* CPU AREA */}
        <div style={{
          position: 'absolute',
          top: '0%',
          left: '5%',
          width: '30%',
          height: '70%',
          border: `2px solid rgba(167, 139, 250, 0.4)`,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(30,30,40,0.9) 0%, rgba(10,10,20,0.9) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1.5rem 1rem',
          zIndex: 1,
          boxShadow: 'inset 0 0 20px rgba(167, 139, 250, 0.1), 0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {/* CPU Pins */}
          <div style={{ position: 'absolute', left: '-5px', top: '20px', bottom: '20px', width: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
             {[...Array(8)].map((_, i) => <div key={i} style={{ height: '4px', background: '#fbbf24', width: '5px' }}></div>)}
          </div>
          <div style={{ position: 'absolute', right: '-5px', top: '20px', bottom: '20px', width: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
             {[...Array(8)].map((_, i) => <div key={i} style={{ height: '4px', background: '#fbbf24', width: '5px' }}></div>)}
          </div>
          <div style={{ position: 'absolute', top: '-5px', left: '20px', right: '20px', height: '5px', display: 'flex', justifyContent: 'space-between' }}>
             {[...Array(12)].map((_, i) => <div key={i} style={{ width: '4px', background: '#fbbf24', height: '5px' }}></div>)}
          </div>

          <div style={{ fontWeight: '900', letterSpacing: '4px', color: '#a78bfa', fontSize: '1.2rem', marginBottom: '5px' }}>PROCESSOR</div>
          <div style={{ fontSize: '0.65rem', color: theme.textSecondary, letterSpacing: '1px' }}>CORE i9 64-BIT</div>
          
          {/* Execution Thread slot (Visual placeholder) */}
          <div style={{ 
            position: 'absolute',
            bottom: '20px',
            left: '5%',
            right: '5%',
            height: '100px', 
            background: 'rgba(0,0,0,0.5)', 
            border: '2px dashed rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', fontWeight: 'bold' }}>EXECUTION THREAD</span>
          </div>
        </div>

        {/* PTBR */}
        <div style={{
          position: 'absolute',
          top: `${ptbrY}%`,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140px',
          padding: '0.85rem',
          background: 'linear-gradient(135deg, rgba(10,15,30,1) 0%, rgba(15,23,42,1) 100%)',
          border: `2px solid #22d3ee`,
          borderRadius: '8px',
          textAlign: 'center',
          zIndex: 10,
          boxShadow: activeTable !== null ? `0 0 25px #22d3ee50` : '0 0 10px rgba(34,211,238,0.2)',
          transition: 'box-shadow 0.3s'
        }}>
          <div style={{ fontWeight: '900', color: '#22d3ee', letterSpacing: '1px' }}>PTBR</div>
          <div style={{ fontSize: '0.65rem', color: theme.textSecondary, marginTop: '4px', fontWeight: 'bold' }}>PAGE TABLE<br/>BASE REGISTER</div>
        </div>

        {/* PROCESSES BOX (RIGHT SIDE) */}
        <div style={{
          position: 'absolute',
          top: '0%',
          right: '5%',
          width: '30%',
          height: '75%', 
          background: 'transparent',
          border: `2px solid ${theme.border}`,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)'
        }}>
          <div style={{ textAlign: 'center', fontWeight: 'bold', color: theme.textPrimary, letterSpacing: '2px', margin: '1.5rem 0 1rem 0' }}>PROCESSES</div>
        </div>

        {/* GHOST PLACEHOLDERS (Ensures alignment perfectly matches absolute elements) */}
        {processes.map((p, i) => {
          const isActive = activeTable === p.id;
          const topPercentHome = 12 + i * 7.5; 
          const leftPercentHome = 67; 
          
          return (
            <div key={`ghost-${p.id}`} style={{
              position: 'absolute',
              top: `${topPercentHome}%`,
              left: `${leftPercentHome}%`,
              width: '26%',
              height: '35px',
              background: 'rgba(0,0,0,0.3)',
              border: `1px dashed ${theme.border}`,
              borderRadius: '8px',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.3s',
              zIndex: 1
            }}></div>
          );
        })}

        {/* ANIMATED PROCESSES */}
        {processes.map((p, i) => {
          const isActive = activeTable === p.id;
          
          // Home position matches ghost exactly
          const topPercentHome = 12 + i * 7.5; 
          const leftPercentHome = 67; 
          
          // CPU position perfectly covers the execution thread box
          // Execution Thread is at CPU left: 5%, right: 5% (so width is 90% of CPU's 30% = 27% of container)
          // It's at CPU bottom: 20px, height: 100px.
          // CPU is at top: 0, height: 70%.
          // Let's use calc() for precision:
          const topCpuCalc = `calc(70% - 120px)`; 
          const leftCpuCalc = `calc(5% + (30% * 0.05))`; 
          const widthCpuCalc = `calc(30% * 0.90)`;
          
          return (
            <div key={`proc-${p.id}`} style={{
              position: 'absolute',
              top: isActive ? topCpuCalc : `${topPercentHome}%`,
              left: isActive ? leftCpuCalc : `${leftPercentHome}%`,
              width: isActive ? widthCpuCalc : '26%',
              height: isActive ? '100px' : '35px',
              background: isActive ? p.color : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isActive ? p.color : theme.border}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isActive ? 'center' : 'flex-start',
              padding: '0 1rem',
              fontSize: isActive ? '1.5rem' : '0.85rem',
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: 'none', 
              transition: 'all 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
              zIndex: isActive ? 20 : 10,
              pointerEvents: 'none'
            }}>
              <span style={{ color: p.color, marginRight: '10px', display: isActive ? 'none' : 'inline' }}>●</span>
              {isActive && <div style={{ position: 'absolute', top: '15px', left: '15px', width: '12px', height: '12px', borderRadius: '50%', background: p.color }}></div>}
              {p.name}
              {!isActive && <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontWeight: 'normal', fontSize: '0.75rem' }}>{p.pid}</span>}
            </div>
          );
        })}

        {/* PAGE TABLES (BOTTOM ROW) */}
        <div style={{
          position: 'absolute',
          bottom: '0%',
          left: '5%',
          width: '90%',
          height: '15%',
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          {processes.map((p, i) => {
            const isActive = activeTable === p.id;
            const isHovered = hoveredTable === p.id;
            
            // Calculate dynamic styles
            const bg = isActive ? p.color : (isHovered && hasPlayed ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)');
            const shadow = (isHovered && hasPlayed && !isActive) ? `0 10px 20px ${p.color}60` : 'none';
            const transform = isActive ? 'translateY(-10px)' : ((isHovered && hasPlayed) ? 'translateY(-5px)' : 'none');

            return (
              <div 
                key={`pt-${p.id}`}
                onClick={() => handleTableClick(p.id)}
                onMouseEnter={() => setHoveredTable(p.id)}
                onMouseLeave={() => setHoveredTable(null)}
                style={{
                  width: '10%',
                  height: '100%',
                  background: bg,
                  border: `2px solid ${p.color}`,
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: hasPlayed ? 'pointer' : 'default',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: shadow,
                  transform: transform,
                  color: isActive ? '#fff' : theme.textSecondary,
                  textShadow: isActive ? '0 0 5px rgba(0,0,0,0.8)' : 'none'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>PT {p.id}</div>
                <div style={{ fontSize: '0.65rem', color: isActive ? '#fff' : p.color, marginTop: '4px', fontWeight: 'bold' }}>{p.pid}</div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes drawVertical {
          from { transform: scaleY(0); opacity: 1; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes drawHorizontal {
          from { transform: scaleX(0); opacity: 1; }
          to { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
