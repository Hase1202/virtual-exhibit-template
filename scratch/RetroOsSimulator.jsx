import React, { useState, useEffect, useRef } from 'react';
import win95bg from '../assets/windows_95_background.png';

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
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'crashing', 'crashed'
  const [crashData, setCrashData] = useState(null);
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
    'Discord': { size: 1, color: '#aa00aa', x: 110, y: 20 },
    'Game':    { size: 3, color: '#aa0000', x: 200, y: 20 },
    'Editor':  { size: 4, color: '#00aa00', x: 290, y: 20 }
  };

  const drawLine = (appName, startIdx, size, isClosing = false, isCrash = false) => {
    if (!containerRef.current || startIdx === -1) return;
    const slotRef = ramRefs.current[startIdx];
    if (!slotRef || !slotRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const iconRect = iconRefs[appName].current.getBoundingClientRect();
    
    // Calculate relative coordinates
    const startX = (iconRect.left - containerRect.left) + iconRect.width / 2;
    const startY = (iconRect.top - containerRect.top) + iconRect.height / 2;
    
    const newLines = [];
    const targetY = (slotRef.current.getBoundingClientRect().top - containerRect.top) + slotRef.current.getBoundingClientRect().height / 2;
    const splitRatio = 0.25 + Math.random() * 0.55; 
    const midY = startY + (targetY - startY) * splitRatio; 

    for (let i = 0; i < size; i++) {
      const ramRect = ramRefs.current[startIdx + i].current.getBoundingClientRect();
      const endX = (ramRect.left - containerRect.left) + ramRect.width / 2;
      const endY = (ramRect.top - containerRect.top) + ramRect.height / 2;
      
      const path = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
      newLines.push({ id: `line-${Date.now()}-${Math.random()}-${appName}-${i}`, path, color: APPS[appName].color, isClosing, isCrash });
    }

    setLines(prev => [...prev, ...newLines]);
    
    if (!isCrash) {
      // Remove line after animation
      setTimeout(() => {
        setLines(prev => prev.filter(l => !newLines.find(nl => nl.id === l.id)));
      }, 1200);
    }
  };

  const triggerCrash = (sourceAppName) => {
    setGameState('crashing');
    
    // Find a slot occupied by another app
    const occupiedIdx = ram.findIndex(s => s.app !== null && s.app !== sourceAppName);
    const targetIdx = occupiedIdx >= 0 ? occupiedIdx : 0; 
    
    setCrashData({ targetSlot: targetIdx, hit: false });
    
    // Draw ONE line
    drawLine(sourceAppName, targetIdx, 1, false, true); 
    
    // After 1000ms (arrow hits)
    setTimeout(() => {
      setCrashData({ targetSlot: targetIdx, hit: true });
      setLines(prev => prev.filter(l => l.isCrash)); // Clear all other lines exactly on impact
      
      // After 1500ms, show BSOD
      setTimeout(() => {
        setGameState('crashed');
        setCrashData(null);
      }, 1500);
    }, 1000);
  };

  const startGame = () => {
    setGameState('playing');
    setRam(Array(8).fill({ app: null, state: 'idle' }));
    setActiveApps([]);
    setErrorMsg('');
    setLines([]);
    setCrashData(null);
  };

  const openApp = (appName) => {
    if (activeApps.includes(appName)) return;

    // Spam click check for crash (if user clicks really fast)
    const now = Date.now();
    if (activeApps.length > 0 && now - lastActionTime < 300) {
      if (Math.random() < 0.7) {
         triggerCrash(appName);
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
      newRam[i] = { app: appName, state: 'allocating' };
    }
    setRam(newRam);
    setActiveApps([...activeApps, appName]);
    
    drawLine(appName, startIdx, app.size);

    // After 1s, arrow arrives, set to starting
    setTimeout(() => {
      setRam(currentRam => currentRam.map((s, i) => 
        (i >= startIdx && i < startIdx + app.size && s.app === appName && s.state === 'allocating') ? { ...s, state: 'starting' } : s
      ));
      
      // After 0.5s, switch to running
      setTimeout(() => {
        setRam(currentRam => currentRam.map((s, i) => 
          (i >= startIdx && i < startIdx + app.size && s.app === appName && s.state === 'starting') ? { ...s, state: 'running' } : s
        ));
      }, 500);
    }, 1000);
  };

  const closeApp = (appName) => {
    setLastActionTime(Date.now());
    
    const startIdx = ram.findIndex(s => s.app === appName);
    if (startIdx === -1) return; // Prevent crash if app not found in RAM
    if (ram[startIdx].state === 'stopping') return; // Prevent double close
    
    const size = APPS[appName].size;
    
    drawLine(appName, startIdx, size, true);
    
    // Switch to stopping
    setRam(currentRam => currentRam.map(slot => 
      slot.app === appName ? { ...slot, state: 'stopping' } : slot
    ));
    
    // Remove from active apps immediately so user can reopen it
    setActiveApps(prev => prev.filter(app => app !== appName));

    // After 1s, clear it
    setTimeout(() => {
      setRam(currentRam => currentRam.map(slot => 
        (slot.app === appName && slot.state === 'stopping') ? { app: null, state: 'idle' } : slot
      ));
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
      display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '3rem 0'
    }}>
      {/* The Monitor Unit */}
      <div style={{
        background: '#e3dfcd', 
        borderRadius: '24px 24px 16px 16px',
        paddingTop: '40px',
        paddingBottom: '50px',
        paddingLeft: '40px',
        paddingRight: '40px',
        boxShadow: 'inset 0px 5px 10px rgba(255,255,255,0.8), inset -5px -5px 15px rgba(0,0,0,0.2), 15px 20px 25px rgba(0,0,0,0.4)',
        position: 'relative',
        width: '100%',
        maxWidth: '850px',
        zIndex: 10
      }}>
        {/* Vents or Details on plastic */}
        <div style={{ position: 'absolute', bottom: '15px', left: '50px', display: 'flex', gap: '5px' }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ width: '8px', height: '3px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px' }}/>)}
        </div>
        <div style={{ position: 'absolute', bottom: '15px', right: '50px', display: 'flex', gap: '5px' }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ width: '8px', height: '3px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px' }}/>)}
        </div>
        {/* Power Button */}
        <div style={{ position: 'absolute', bottom: '10px', right: '20px', width: '20px', height: '20px', borderRadius: '50%', background: '#ffaa00', border: '2px solid #b3a991', boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.5)' }} />

        {/* Inner Bezel (Concave effect) */}
        <div style={{
          borderStyle: 'solid',
          borderTopWidth: '10px',
          borderBottomWidth: '15px',
          borderLeftWidth: '40px',
          borderRightWidth: '40px',
          borderTopColor: '#d1ccb8',
          borderLeftColor: '#c4bfa9',
          borderRightColor: '#f0ebd8', // lighter to catch light
          borderBottomColor: '#b8b4a2',
          borderRadius: '16px',
          background: '#111',
          position: 'relative',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,1)'
        }}>

          {/* Desktop Elements (Only show if playing) */}
          {(gameState === 'playing' || gameState === 'crashed' || gameState === 'crashing') && (
            <>
              {/* HUD / Sticky Note */}
              <div style={{
                position: 'absolute', top: '25px', right: '-85px', // On the right bezel
                background: '#fffa9e', color: '#333', padding: '15px',
                border: '1px solid #d4d0c8', fontWeight: 'bold', fontSize: '0.85rem',
                width: '180px', zIndex: 200, 
                boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                transform: 'rotate(4deg)',
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                borderBottomRightRadius: '10px'
              }}>
                <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.05)', position: 'absolute', top: 0, left: 0 }}></div>
                <span style={{ color: '#aa0000', display: 'block', marginBottom: '8px', fontSize: '1rem', textDecoration: 'underline' }}>OBJECTIVE:</span>
                CRASH THE PC!<br/><br/>Spam opening and closing apps as fast as you can. See what happens when there's no memory protection!
              </div>
            </>
          )}

          {/* The Screen */}
          <div 
            ref={containerRef}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 128, 128, 0.7), rgba(0, 128, 128, 0.7)), url("${typeof win95bg === 'string' ? win95bg : win95bg?.src}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#008080', // Fallback
              border: '2px solid #000',
              height: '450px',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: '"Courier New", Courier, monospace',
              borderRadius: '4px'
            }}
          >
          <style>{`
            @keyframes drawHydra {
              to { stroke-dashoffset: 0; }
            }
            @keyframes shake {
              0% { transform: translateX(-50%) translate(1px, 1px) rotate(0deg); }
              10% { transform: translateX(-50%) translate(-1px, -2px) rotate(-1deg); }
              20% { transform: translateX(-50%) translate(-3px, 0px) rotate(1deg); }
              30% { transform: translateX(-50%) translate(3px, 2px) rotate(0deg); }
              40% { transform: translateX(-50%) translate(1px, -1px) rotate(1deg); }
              50% { transform: translateX(-50%) translate(-1px, 2px) rotate(-1deg); }
              60% { transform: translateX(-50%) translate(-3px, 1px) rotate(0deg); }
              70% { transform: translateX(-50%) translate(3px, 1px) rotate(-1deg); }
              80% { transform: translateX(-50%) translate(-1px, -1px) rotate(1deg); }
              90% { transform: translateX(-50%) translate(1px, 2px) rotate(0deg); }
              100% { transform: translateX(-50%) translate(1px, -2px) rotate(-1deg); }
            }
          `}</style>
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
              padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.85rem', overflowY: 'auto'
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
          {(gameState === 'playing' || gameState === 'crashed' || gameState === 'crashing') && (
            <>
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
                  {ram.map((slot, i) => {
                    const isCrashTarget = crashData?.hit && i === crashData.targetSlot;
                    return (
                    <div key={i} style={{ flex: 1, position: 'relative', display: 'flex' }}>
                      {/* Undertale exclamation */}
                      {isCrashTarget && (
                        <div style={{
                          position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)',
                          color: '#ff3300', fontSize: '1.8rem', fontWeight: 900, zIndex: 50, 
                          textShadow: '2px 2px 0 #000, -2px -2px 0 #fff',
                          animation: 'shake 0.1s infinite'
                        }}>!!!</div>
                      )}
                      <div ref={ramRefs.current[i]} style={{
                        flex: 1,
                        background: (slot.app && slot.state !== 'allocating') ? APPS[slot.app].color : '#000',
                        border: isCrashTarget ? '4px solid #ff0000' : '1px solid #808080',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.65rem', fontWeight: 'bold',
                        textShadow: '1px 1px 0 #000',
                        position: 'relative', overflow: 'hidden'
                      }}>
                        {/* Scanline effect for running */}
                        {slot.state === 'running' && (
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}></div>
                        )}

                        {slot.app && slot.state !== 'allocating' && <span>{slot.app[0]}</span>}
                        {slot.state !== 'idle' && slot.state !== 'allocating' && (
                          <span style={{ fontSize: '0.55rem', color: slot.state === 'running' ? '#00ff00' : (slot.state === 'stopping' ? '#ffaa00' : '#ffff00') }}>
                            {slot.state}...
                          </span>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              </div>

              {/* Animated Lines SVG Overlay */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
                {lines.map(line => (
                  <g key={line.id}>
                    <mask id={`mask-${line.id}`}>
                      <path d={line.path} fill="none" stroke="white" strokeWidth="10" strokeDasharray="1500" strokeDashoffset="1500" style={{ animation: 'drawHydra 1s cubic-bezier(0.4, 0, 0.2, 1) forwards' }} />
                    </mask>
                    <path 
                      d={line.path} 
                      fill="none" 
                      stroke={line.color} 
                      strokeWidth="4"
                      strokeDasharray={line.isClosing ? "12, 12" : "1500"}
                      mask={`url(#mask-${line.id})`}
                      style={{
                        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'
                      }}
                    />
                  </g>
                ))}
              </svg>

            </>
          )}

        </div> {/* End Screen */}
        </div> {/* End Inner Bezel */}
      </div> {/* End Monitor Unit */}

      {/* Monitor Neck (Stand) */}
      <div style={{
        width: '150px',
        height: '40px',
        background: 'linear-gradient(to right, #b8b4a2, #e3dfcd, #b8b4a2)',
        borderLeft: '4px solid #a39f8d',
        borderRight: '4px solid #a39f8d',
        zIndex: 5
      }} />

      {/* PC Box Base */}
      <div style={{
        width: '500px',
        height: '70px',
        background: '#e3dfcd',
        borderRadius: '8px 8px 0 0',
        boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.6), 5px 5px 10px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 30px',
        borderBottom: '4px solid #b8b4a2',
        zIndex: 4
      }}>
        {/* Floppy Drive */}
        <div style={{ width: '60px', height: '12px', background: '#222', borderRadius: '2px', borderBottom: '2px solid #fff' }} />
        {/* CD Drive */}
        <div style={{ width: '120px', height: '18px', background: '#d1ccb8', border: '1px solid #b8b4a2', borderRadius: '2px', display: 'flex', alignItems: 'center', padding: '0 5px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffaa00' }}></div>
        </div>
      </div>
    </div>
  );
}
