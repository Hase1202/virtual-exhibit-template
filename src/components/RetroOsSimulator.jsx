import React, { useState, useEffect, useRef } from 'react';

// Icons
const AppIcon = ({ name, color, size, onClick, active, x, y, iconRef }) => (
  <div 
    ref={iconRef}
    onClick={onClick}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: '80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      opacity: active ? 0.5 : 1,
      transition: 'transform 0.1s',
      transform: active ? 'scale(0.95)' : 'scale(1)',
      zIndex: 10
    }}>
    <div style={{
      width: '40px', height: '40px', 
      backgroundColor: color,
      border: '2px outset #fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '2px 2px 0px #000'
    }}>
      <strong style={{ color: '#fff', fontSize: '1rem', textShadow: '1px 1px #000' }}>{name[0]}</strong>
    </div>
    <span style={{ 
      marginTop: '4px', fontSize: '0.7rem', fontWeight: 600, color: '#fff', 
      textAlign: 'center', textShadow: '1px 1px 0 #000', fontFamily: '"Courier New", Courier, monospace' 
    }}>
      {name}<br/>{size}GB
    </span>
  </div>
);

export default function RetroOsSimulator() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'crashed'
  const [ram, setRam] = useState(Array(8).fill({ app: null, state: 'idle' })); // state: idle, starting, running, stopping
  const [activeApps, setActiveApps] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [lines, setLines] = useState([]); // Array of { id, path, color }
  const [lastActionTime, setLastActionTime] = useState(Date.now());

  const containerRef = useRef(null);
  const iconRefs = {
    'Browser': useRef(null),
    'Discord': useRef(null),
    'Game': useRef(null),
    'Editor': useRef(null)
  };
  const ramRefs = useRef(Array(8).fill(null).map(() => React.createRef()));

  const APPS = {
    'Browser': { size: 2, color: '#0000aa', x: 20, y: 20 },
    'Discord': { size: 1, color: '#aa00aa', x: 20, y: 90 },
    'Game':    { size: 3, color: '#aa0000', x: 20, y: 160 },
    'Editor':  { size: 4, color: '#00aa00', x: 20, y: 230 }
  };

  const drawLine = (appName, startIdx, size) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const iconRect = iconRefs[appName].current.getBoundingClientRect();
    const ramRect = ramRefs.current[startIdx].current.getBoundingClientRect();

    // Calculate relative coordinates
    const startX = (iconRect.left - containerRect.left) + iconRect.width / 2;
    const startY = (iconRect.top - containerRect.top) + iconRect.height / 2;
    const endX = (ramRect.left - containerRect.left) + (ramRect.width * size) / 2;
    const endY = (ramRect.top - containerRect.top) + ramRect.height / 2;

    // Manhattan path: Horizontal then Vertical
    // Since icons are on left and RAM on right/bottom, we'll go Right then Down
    const midX = endX;
    const path = `M ${startX} ${startY} L ${midX} ${startY} L ${endX} ${endY}`;

    const newLine = { id: Date.now(), path, color: APPS[appName].color };
    setLines(prev => [...prev, newLine]);
    
    // Remove line after a short delay
    setTimeout(() => {
      setLines(prev => prev.filter(l => l.id !== newLine.id));
    }, 1500);
  };

  const startGame = () => {
    setGameState('playing');
    setRam(Array(8).fill({ app: null, state: 'idle' }));
    setActiveApps([]);
    setErrorMsg('');
    setLines([]);
  };

  const openApp = (appName) => {
    if (activeApps.includes(appName)) return;

    // Spam click check for crash (if user clicks really fast)
    const now = Date.now();
    if (activeApps.length > 0 && now - lastActionTime < 300) {
      if (Math.random() < 0.7) {
         setGameState('crashed');
         return;
      }
    }
    setLastActionTime(now);

    const app = APPS[appName];
    
    // Fragmentation check: Find contiguous space
    let startIdx = -1;
    let currentStreak = 0;
    
    for (let i = 0; i < 8; i++) {
      if (ram[i].app === null || ram[i].state === 'stopping') {
        if (currentStreak === 0) startIdx = i;
        currentStreak++;
        if (currentStreak === app.size) break;
      } else {
        currentStreak = 0;
      }
    }

    if (currentStreak < app.size) {
      setErrorMsg(`External Fragmentation! Cannot fit ${app.size}GB contiguous block.`);
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    // Allocate Memory (Starting)
    const newRam = [...ram];
    for (let i = startIdx; i < startIdx + app.size; i++) {
      newRam[i] = { app: appName, state: 'starting' };
    }
    setRam(newRam);
    setActiveApps([...activeApps, appName]);
    
    drawLine(appName, startIdx, app.size);

    // After 0.5s, switch to running
    setTimeout(() => {
      setRam(currentRam => {
        const r = [...currentRam];
        for (let i = startIdx; i < startIdx + app.size; i++) {
          if (r[i].app === appName && r[i].state === 'starting') {
            r[i] = { ...r[i], state: 'running' };
          }
        }
        return r;
      });
    }, 500);
  };

  const closeApp = (appName) => {
    setLastActionTime(Date.now());
    
    // Switch to stopping
    setRam(currentRam => currentRam.map(slot => 
      slot.app === appName ? { ...slot, state: 'stopping' } : slot
    ));

    // After 1s, clear it
    setTimeout(() => {
      setRam(currentRam => currentRam.map(slot => 
        (slot.app === appName && slot.state === 'stopping') ? { app: null, state: 'idle' } : slot
      ));
      setActiveApps(prev => prev.filter(app => app !== appName));
    }, 1000);
  };

  const handleAppClick = (appName) => {
    if (gameState !== 'playing') return;
    if (activeApps.includes(appName)) {
      closeApp(appName);
    } else {
      openApp(appName);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', margin: '3rem 0'
    }}>
      {/* The Monitor / Old Computer Box */}
      <div style={{
        background: '#d4d0c8', // Old Windows gray
        border: '4px solid #fff',
        borderRightColor: '#808080',
        borderBottomColor: '#808080',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '10px 10px 0px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '800px'
      }}>
        
        {/* The Screen */}
        <div 
          ref={containerRef}
          style={{
            background: '#008080', // Classic Windows 95 teal desktop
            border: '4px solid #404040',
            borderRightColor: '#fff',
            borderBottomColor: '#fff',
            height: '450px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '"Courier New", Courier, monospace'
          }}
        >
          {/* Overlay for Start */}
          {gameState === 'start' && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.7)', zIndex: 100,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                background: '#c0c0c0', padding: '2rem', border: '2px outset #fff', textAlign: 'center'
              }}>
                <h2 style={{ margin: '0 0 1rem 0', color: '#000', fontSize: '1.5rem', fontWeight: 'bold' }}>Ready for chaos?</h2>
                <button onClick={startGame} style={{
                  padding: '10px 30px', fontSize: '1.2rem', fontWeight: 'bold',
                  background: '#c0c0c0', border: '3px outset #fff', cursor: 'pointer'
                }}>
                  ▶ PLAY
                </button>
              </div>
            </div>
          )}

          {/* BSOD Crash Screen */}
          {gameState === 'crashed' && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: '#0000aa', color: '#fff', zIndex: 100,
              padding: '2rem', fontFamily: 'monospace', fontSize: '1.2rem'
            }}>
              <div style={{ background: '#fff', color: '#0000aa', display: 'inline-block', padding: '0 8px', fontWeight: 'bold', marginBottom: '1rem' }}>
                Windows
              </div>
              <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01).</p>
              <p>The current application will be terminated.</p>
              <br/>
              <p>* You spammed applications without memory protection!</p>
              <p>* Two apps tried to access the exact same memory address.</p>
              <p>* The OS crashed entirely. (This is why Virtual Memory was invented!)</p>
              <br/>
              <p>Press the button below to restart.</p>
              <button onClick={startGame} style={{
                marginTop: '1rem', padding: '5px 15px', background: '#c0c0c0', color: '#000', border: '2px outset #fff', cursor: 'pointer', fontFamily: 'monospace'
              }}>Restart</button>
            </div>
          )}

          {/* Desktop Elements (Only show if playing) */}
          {(gameState === 'playing' || gameState === 'crashed') && (
            <>
              {/* HUD */}
              <div style={{
                position: 'absolute', top: '10px', right: '10px',
                background: '#ffff00', color: '#000', padding: '10px',
                border: '2px solid #000', fontWeight: 'bold', fontSize: '0.85rem',
                maxWidth: '220px', zIndex: 20, boxShadow: '2px 2px 0px #000'
              }}>
                <span style={{ color: '#aa0000', display: 'block', marginBottom: '4px' }}>OBJECTIVE:</span>
                CRASH THE PC!<br/>Spam open and close apps fast to see what happens.
              </div>

              {/* Error Popup */}
              {errorMsg && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  background: '#c0c0c0', color: '#000', padding: '1.5rem',
                  border: '3px outset #fff', zIndex: 50, fontWeight: 'bold',
                  boxShadow: '4px 4px 10px rgba(0,0,0,0.5)', textAlign: 'center'
                }}>
                  <div style={{ background: '#0000aa', color: '#fff', padding: '2px 4px', marginBottom: '10px', textAlign: 'left' }}>Error</div>
                  {errorMsg}
                </div>
              )}

              {/* Apps */}
              {Object.keys(APPS).map(appName => (
                <AppIcon 
                  key={appName} 
                  iconRef={iconRefs[appName]}
                  name={appName} 
                  size={APPS[appName].size} 
                  color={APPS[appName].color}
                  x={APPS[appName].x}
                  y={APPS[appName].y}
                  active={activeApps.includes(appName)}
                  onClick={() => handleAppClick(appName)}
                />
              ))}

              {/* Physical RAM Display */}
              <div style={{
                position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                background: '#c0c0c0', border: '2px inset #fff', padding: '10px',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ color: '#000', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>
                  Physical RAM (8GB)
                </div>
                <div style={{ display: 'flex', gap: '2px', height: '50px' }}>
                  {ram.map((slot, i) => (
                    <div key={i} ref={ramRefs.current[i]} style={{
                      flex: 1,
                      background: slot.app ? APPS[slot.app].color : '#000',
                      border: '1px solid #808080',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.65rem', fontWeight: 'bold',
                      textShadow: '1px 1px 0 #000',
                      position: 'relative', overflow: 'hidden'
                    }}>
                      {/* Scanline effect for running */}
                      {slot.state === 'running' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}></div>
                      )}

                      {slot.app && <span>{slot.app[0]}</span>}
                      {slot.state !== 'idle' && (
                        <span style={{ fontSize: '0.55rem', color: slot.state === 'running' ? '#00ff00' : (slot.state === 'stopping' ? '#ffaa00' : '#ffff00') }}>
                          {slot.state}...
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Animated Lines SVG Overlay */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
                {lines.map(line => (
                  <path 
                    key={line.id} 
                    d={line.path} 
                    fill="none" 
                    stroke={line.color} 
                    strokeWidth="4"
                    strokeDasharray="10,5"
                    style={{
                      filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'
                    }}
                  >
                    <animate attributeName="stroke-dashoffset" from="15" to="0" dur="0.2s" repeatCount="indefinite" />
                  </path>
                ))}
              </svg>

            </>
          )}

        </div>
      </div>
    </div>
  );
}
