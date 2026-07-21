import React, { useState, useEffect, useRef } from 'react';
import win95bg from '../assets/windows_95_background.png';
import redDevImg from '../assets/RedDev.png';

// Icons
const AppIcon = ({ name, color, size, onOpen, onClose, active, x, y, iconRef }) => (
  <div 
    ref={iconRef}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: '80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity: active ? 0.5 : 1,
      transition: 'transform 0.1s',
      transform: active ? 'scale(0.95)' : 'scale(1)',
      zIndex: 10
    }}>
    {/* X Button for closing */}
    {active && (
      <div 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute', top: '-5px', right: '-5px', width: '20px', height: '20px',
          background: '#c0c0c0', border: '2px outset #fff', fontWeight: 'bold', fontSize: '0.7rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11, color: '#000'
        }}
      >
        X
      </div>
    )}
    <div 
      onClick={(e) => { if (!active) { e.stopPropagation(); onOpen(); } }}
      style={{
        width: '40px', height: '40px', 
        backgroundColor: color,
        border: '2px outset #fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '2px 2px 0px #000', cursor: active ? 'default' : 'pointer'
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
  const [gameState, setGameState] = useState('start'); // 'start', 'tutorial', 'playing', 'crashing', 'crashed'
  const [tutorialStep, setTutorialStep] = useState(0);
  const [animatingSticky, setAnimatingSticky] = useState(false);
  const [crashData, setCrashData] = useState(null);
  const [ram, setRam] = useState(Array(8).fill({ app: null, state: 'idle' })); // state: idle, starting, running, stopping
  const [activeApps, setActiveApps] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [lines, setLines] = useState([]); // Array of { id, path, color }
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const [appsOpenedCounter, setAppsOpenedCounter] = useState(0);
  const [maxUnlockedChapter, setMaxUnlockedChapter] = useState(1);
  const [hoveredTape, setHoveredTape] = useState(null);
  const [loginHovered, setLoginHovered] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState('');

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

  const CHAPTERS = [
    { id: 1, title: 'Intro (Very Start)', color: '#fffa9e' },
    { id: 2, title: 'Insufficient Memory', color: '#ffa3a3' },
    { id: 3, title: 'External Fragmentation', color: '#a3d5ff' },
    { id: 4, title: 'Security Issues', color: '#ffc2a3' },
    { id: 5, title: 'Sandbox', color: '#c2ffc2' }
  ];

  // ------------------ TUTORIAL LOGIC ------------------

  const getRedDevMessage = () => {
    switch (tutorialStep) {
      case 1: return "Hello There! I am RedDev and I will be teaching you about what happens if there is no virtual memory.";
      case 2: return "Your first task is to Open the Browser.";
      case 4: return "This is Direct Access memory, our programs are directly mapped to our physical RAM.";
      case 5: return "Now try Opening Discord and Game.";
      case 7: return "Great! Now try opening Editor.";
      case 10: return "I want to open editor but we don't have enough space!";
      case 11: return "Try closing Browser and opening Editor.";
      case 14: return "Even though we have 4GB of free RAM, it's broken into separate pieces! This is External Fragmentation.";
      case 15: return "Now lets move into security issues.";
      case 16: return "Try spamming opening and closing these programs.";
      case 18: return "Without memory protection, two programs tried to use the exact same physical space!";
      case 19: return "This crashes the entire system! Virtual Memory solves this by giving every program its own isolated sandbox.";
      case 20: return "Feel free to restart the computer and test the simulator yourself. You'll still be using Direct Access Memory!";
      default: return null; 
    }
  };

  const getObjective = () => {
    if (gameState === 'crashing' || gameState === 'crashed') return null;
    if (gameState === 'playing') {
      return "You are free to experiment with Direct Access memory!\n\nSpam opening and closing apps as fast as you can. See what happens when there's no memory protection!";
    }
    if (tutorialStep === 3) return "Please Open The Browser.";
    if (tutorialStep === 6) return "Open Discord and Game.";
    if (tutorialStep >= 8 && tutorialStep <= 9) return "Open the Editor.";
    if (tutorialStep >= 12 && tutorialStep <= 13) return "Close Browser, then open Editor.";
    if (tutorialStep === 17) return "Spam opening and closing apps!";
    return null;
  };

  const prevObjective = useRef(getObjective());

  useEffect(() => {
    const currentObj = getObjective();
    if (currentObj !== prevObjective.current) {
      setAnimatingSticky(true);
      setTimeout(() => {
        prevObjective.current = currentObj;
        setAnimatingSticky(false);
      }, 500); 
    }
  }, [tutorialStep, gameState]);

  const advanceTutorial = () => {
    if ([1,2, 4,5, 7, 10,11, 14,15, 18,19].includes(tutorialStep)) {
      setTutorialStep(tutorialStep + 1);
    } else if (tutorialStep === 16) {
      setTutorialStep(17);
      setAppsOpenedCounter(0);
    } else if (tutorialStep === 20) {
      setTutorialStep(21);
    }
  };

  useEffect(() => {
    const fullMsg = getRedDevMessage();
    if (!fullMsg) {
      setDisplayedMessage('');
      return;
    }
    
    setDisplayedMessage('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedMessage(fullMsg.slice(0, i + 1));
      i++;
      if (i >= fullMsg.length) clearInterval(interval);
    }, 15);
    
    return () => clearInterval(interval);
  }, [tutorialStep, gameState]);

  useEffect(() => {
    if (tutorialStep >= 11 && maxUnlockedChapter < 2) setMaxUnlockedChapter(2);
    if (tutorialStep >= 15 && maxUnlockedChapter < 3) setMaxUnlockedChapter(3);
    if (tutorialStep >= 20 && maxUnlockedChapter < 4) setMaxUnlockedChapter(4);
    if (gameState === 'playing' && maxUnlockedChapter < 5) setMaxUnlockedChapter(5);
  }, [tutorialStep, gameState, maxUnlockedChapter]);

  useEffect(() => {
    if (gameState !== 'tutorial') return;
    if (tutorialStep === 3) { 
      if (activeApps.includes('Browser')) {
        setTimeout(() => setTutorialStep(4), 1800);
      }
    } else if (tutorialStep === 6) { 
      if (activeApps.includes('Discord') && activeApps.includes('Game')) {
        setTimeout(() => setTutorialStep(7), 1800);
      }
    } 
  }, [activeApps, tutorialStep, gameState]);
  
  const loadChapter = (chapterId) => {
    setGameState('tutorial');
    setErrorMsg('');
    setLines([]);
    setCrashData(null);
    setAppsOpenedCounter(0);
    
    if (chapterId === 1) {
      setTutorialStep(0);
      setRam(Array(8).fill({ app: null, state: 'idle' }));
      setActiveApps([]);
      setTimeout(() => setTutorialStep(1), 1000);
    } else if (chapterId === 2) {
      setTutorialStep(7);
      setActiveApps(['Browser', 'Discord', 'Game']);
      const newRam = Array(8).fill({ app: null, state: 'idle' });
      newRam[0] = { app: 'Browser', state: 'running' };
      newRam[1] = { app: 'Browser', state: 'running' };
      newRam[2] = { app: 'Discord', state: 'running' };
      newRam[3] = { app: 'Game', state: 'running' };
      newRam[4] = { app: 'Game', state: 'running' };
      newRam[5] = { app: 'Game', state: 'running' };
      setRam(newRam);
    } else if (chapterId === 3) {
      setTutorialStep(11);
      setActiveApps(['Browser', 'Discord', 'Game']);
      const newRam = Array(8).fill({ app: null, state: 'idle' });
      newRam[0] = { app: 'Browser', state: 'running' };
      newRam[1] = { app: 'Browser', state: 'running' };
      newRam[2] = { app: 'Discord', state: 'running' };
      newRam[3] = { app: 'Game', state: 'running' };
      newRam[4] = { app: 'Game', state: 'running' };
      newRam[5] = { app: 'Game', state: 'running' };
      setRam(newRam);
    } else if (chapterId === 4) {
      setTutorialStep(15);
      setActiveApps(['Discord', 'Game']);
      const newRam = Array(8).fill({ app: null, state: 'idle' });
      newRam[2] = { app: 'Discord', state: 'running' };
      newRam[3] = { app: 'Game', state: 'running' };
      newRam[4] = { app: 'Game', state: 'running' };
      newRam[5] = { app: 'Game', state: 'running' };
      setRam(newRam);
    } else if (chapterId === 5) {
      startGame();
    }
  };

  // ----------------------------------------------------

  const drawLine = (appName, startIdx, size, isClosing = false, isCrash = false) => {
    if (!containerRef.current || startIdx === -1) return;
    const slotRef = ramRefs.current[startIdx];
    if (!slotRef || !slotRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const iconRect = iconRefs[appName].current.getBoundingClientRect();
    
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
      setTimeout(() => {
        setLines(prev => prev.filter(l => !newLines.find(nl => nl.id === l.id)));
      }, 1200);
    }
  };

  const triggerCrash = (sourceAppName) => {
    setGameState('crashing');
    
    const occupiedIdx = ram.findIndex(s => s.app !== null && s.app !== sourceAppName);
    const targetIdx = occupiedIdx >= 0 ? occupiedIdx : 0; 
    
    setCrashData({ targetSlot: targetIdx, hit: false });
    
    drawLine(sourceAppName, targetIdx, 1, false, true); 
    
    setTimeout(() => {
      setCrashData({ targetSlot: targetIdx, hit: true });
      setLines(prev => prev.filter(l => l.isCrash)); 
      setTimeout(() => {
        setGameState('crashed');
        setCrashData(null);
        setTimeout(() => {
          setTutorialStep(prev => (prev === 17 ? 18 : prev)); // Show RedDev on BSOD
        }, 1500);
      }, 1500);
    }, 1000);
  };

  const startTutorial = () => {
    setGameState('tutorial');
    setTutorialStep(0);
    setRam(Array(8).fill({ app: null, state: 'idle' }));
    setActiveApps([]);
    setErrorMsg('');
    setLines([]);
    setCrashData(null);
    setAppsOpenedCounter(0);
    setTimeout(() => {
      setTutorialStep(1);
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

  const closeError = () => {
    setErrorMsg('');
    if (gameState === 'tutorial') {
      if (tutorialStep === 9) setTutorialStep(10); 
      if (tutorialStep === 13) setTutorialStep(14); 
    }
  };

  const openApp = (appName) => {
    if (activeApps.includes(appName)) return;

    if (gameState === 'tutorial') {
      if (tutorialStep === 3 && appName !== 'Browser') return;
      if (tutorialStep === 6 && (appName !== 'Discord' && appName !== 'Game')) return;
      if (tutorialStep === 8 && appName !== 'Editor') return;
      if (tutorialStep === 12 && appName !== 'Editor') return;
      if (tutorialStep < 17 && tutorialStep !== 3 && tutorialStep !== 6 && tutorialStep !== 8 && tutorialStep !== 12) return;
    }

    const now = Date.now();
    if (gameState === 'playing' && activeApps.length > 0 && now - lastActionTime < 300) {
      if (Math.random() < 0.7) {
         triggerCrash(appName);
         return;
      }
    }
    setLastActionTime(now);

    const app = APPS[appName];
    
    const totalUsed = ram.reduce((acc, slot) => acc + (slot.app && slot.state !== 'stopping' ? 1 : 0), 0);
    if (totalUsed + app.size > 8) {
      setErrorMsg(`Insufficient Memory!\nNot enough total RAM to open ${appName}.`);
      if (gameState === 'tutorial' && tutorialStep === 8 && appName === 'Editor') {
         setTutorialStep(9);
      }
      return;
    }

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
      setErrorMsg(`External Fragmentation!\nCannot fit ${app.size}GB contiguous block.`);
      if (gameState === 'tutorial' && tutorialStep === 12 && appName === 'Editor') {
         setTutorialStep(13);
      }
      return;
    }

    if (gameState === 'tutorial' && tutorialStep === 17) {
      if (appsOpenedCounter >= 6 && activeApps.length > 0) {
        triggerCrash(appName);
        return;
      }
      setAppsOpenedCounter(c => c + 1);
    }

    const newRam = [...ram];
    for (let i = startIdx; i < startIdx + app.size; i++) {
      newRam[i] = { app: appName, state: 'allocating' };
    }
    setRam(newRam);
    setActiveApps([...activeApps, appName]);
    
    drawLine(appName, startIdx, app.size);

    setTimeout(() => {
      setRam(currentRam => currentRam.map((s, i) => 
        (i >= startIdx && i < startIdx + app.size && s.app === appName && s.state === 'allocating') ? { ...s, state: 'starting' } : s
      ));
      
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
    if (startIdx === -1) return; 
    if (ram[startIdx].state === 'stopping') return; 
    
    const size = APPS[appName].size;
    
    drawLine(appName, startIdx, size, true);
    
    setRam(currentRam => currentRam.map(slot => 
      slot.app === appName ? { ...slot, state: 'stopping' } : slot
    ));
    
    setActiveApps(prev => prev.filter(app => app !== appName));

    setTimeout(() => {
      setRam(currentRam => currentRam.map(slot => 
        (slot.app === appName && slot.state === 'stopping') ? { app: null, state: 'idle' } : slot
      ));
    }, 1000);
  };

  const handleAppOpen = (appName) => {
    if (gameState !== 'playing' && gameState !== 'tutorial') return;
    openApp(appName);
  };

  const handleAppClose = (appName) => {
    if (gameState !== 'playing' && gameState !== 'tutorial') return;
    if (gameState === 'tutorial') {
      if (tutorialStep < 11) return; 
      if (tutorialStep >= 11 && tutorialStep < 17 && appName !== 'Browser') return; 
    }
    closeApp(appName);
  };

  return (
    <>
      <style>{`
        @keyframes redDevSlideUp {
          from { transform: translateY(200px); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0', gap: '2rem' }}>
      
      {/* Left Side: Monitor System */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '850px' }}>
      
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
          {(gameState === 'playing' || gameState === 'crashed' || gameState === 'crashing' || gameState === 'tutorial') && (
            <>
              {/* HUD / Sticky Note */}
              {prevObjective.current !== null && (
                <div style={{
                  position: 'absolute', top: '25px', right: '-85px', // On the right bezel
                  background: '#fffa9e', color: '#333', padding: '15px',
                  border: '1px solid #d4d0c8', fontWeight: 'bold', fontSize: '0.85rem',
                  width: '180px', zIndex: 200, 
                  boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                  transform: 'rotate(4deg)',
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                  borderBottomRightRadius: '10px',
                  animation: animatingSticky ? 'flyOut 0.5s forwards' : 'flyIn 0.5s forwards'
                }}>
                  <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.05)', position: 'absolute', top: 0, left: 0 }}></div>
                  <span style={{ color: '#aa0000', display: 'block', marginBottom: '8px', fontSize: '1rem', textDecoration: 'underline' }}>OBJECTIVE:</span>
                  <span style={{ whiteSpace: 'pre-wrap' }}>{prevObjective.current}</span>
                </div>
              )}
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
            @keyframes flyOut {
              to { transform: rotate(20deg) translateY(-200px) translateX(100px); opacity: 0; }
            }
            @keyframes flyIn {
              from { transform: rotate(-20deg) translateY(-200px) translateX(100px); opacity: 0; }
              to { transform: rotate(4deg) translateY(0) translateX(0); opacity: 1; }
            }
          `}</style>
          
          {/* Overlay for Start */}
          {gameState === 'start' && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: '#008080', zIndex: 100,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                background: '#c0c0c0', padding: '2rem', border: '2px outset #fff', width: '350px',
                boxShadow: '2px 2px 10px rgba(0,0,0,0.5)', textAlign: 'center'
              }}>
                <div style={{ background: '#0000aa', color: '#fff', padding: '4px 8px', fontWeight: 'bold', marginBottom: '25px', fontSize: '1.2rem' }}>
                  Welcome to Windows
                </div>
                <button 
                  onMouseEnter={() => setLoginHovered(true)}
                  onMouseLeave={() => setLoginHovered(false)}
                  onClick={startTutorial} 
                  style={{ 
                    padding: '8px 40px', fontWeight: 'bold', border: '2px outset #fff', 
                    cursor: 'pointer', fontSize: '1.2rem',
                    background: loginHovered ? '#d0d0d0' : '#c0c0c0',
                    boxShadow: loginHovered ? '2px 2px 5px rgba(0,0,0,0.5)' : 'none',
                    transform: loginHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.1s'
                  }}
                >
                  Play
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
              {(!getRedDevMessage() || tutorialStep >= 20) && (
                <>
                  <p>Press the button below to restart.</p>
                  <button onClick={startGame} style={{
                    marginTop: '1rem', padding: '5px 15px', background: '#c0c0c0', color: '#000', border: '2px outset #fff', cursor: 'pointer', fontFamily: 'monospace'
                  }}>Restart</button>
                </>
              )}
            </div>
          )}

          {/* RedDev Tutorial Layer */}
          {(gameState === 'tutorial' || (gameState === 'crashed' && tutorialStep >= 18)) && (
            <div 
              onClick={getRedDevMessage() ? advanceTutorial : undefined}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: (getRedDevMessage() || tutorialStep === 0) ? 'auto' : 'none', zIndex: 300,
                background: (getRedDevMessage() || tutorialStep === 0) ? 'rgba(0,0,0,0.6)' : 'transparent',
                transition: 'background 0.5s',
                cursor: getRedDevMessage() ? 'pointer' : 'default'
              }}
            >
              <div 
                style={{
                  position: 'absolute', 
                  bottom: getRedDevMessage() ? '0px' : '-200px', 
                  right: '20px',
                  transition: 'bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  animation: getRedDevMessage() ? 'redDevSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
                  display: 'flex', alignItems: 'flex-end', flexDirection: 'row-reverse',
                  pointerEvents: 'none'
                }}>
                <img src={typeof redDevImg === 'string' ? redDevImg : redDevImg?.src} alt="RedDev" style={{ width: '100px', height: 'auto', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }} />
                {getRedDevMessage() && (
                  <div 
                    style={{
                      background: '#fff', color: '#000', padding: '12px 18px', borderRadius: '15px',
                      borderBottomRightRadius: '0', marginRight: '10px', marginBottom: '40px',
                      boxShadow: '4px 4px 10px rgba(0,0,0,0.3)', maxWidth: '280px',
                      fontFamily: '"Comic Sans MS", cursive, sans-serif', fontSize: '0.95rem',
                      border: '2px solid #000'
                    }}>
                    {displayedMessage}
                    <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>[Click anywhere to continue]</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop Elements (Only show if playing) */}
          {(gameState === 'playing' || gameState === 'crashed' || gameState === 'crashing' || gameState === 'tutorial') && (
            <>
              {/* Error Popup */}
              {errorMsg && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  background: '#c0c0c0', color: '#000', padding: '1rem', width: '300px',
                  border: '3px outset #fff', zIndex: 350, fontWeight: 'bold',
                  boxShadow: '4px 4px 10px rgba(0,0,0,0.5)', textAlign: 'center'
                }}>
                  <div style={{ 
                    background: '#0000aa', color: '#fff', padding: '2px 4px', marginBottom: '15px', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span>Error</span>
                    <button onClick={closeError} style={{ background: '#c0c0c0', border: '2px outset #fff', color: '#000', fontWeight: 'bold', cursor: 'pointer', padding: '0 4px' }}>X</button>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'left', flex: 1, whiteSpace: 'pre-wrap' }}>{errorMsg}</div>
                  </div>
                  <button onClick={closeError} style={{ padding: '4px 20px', border: '2px outset #fff', cursor: 'pointer' }}>OK</button>
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
                  onOpen={() => handleAppOpen(appName)}
                  onClose={() => handleAppClose(appName)}
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

      </div> {/* End Monitor Unit wrapper */}

      {/* Right Side: VHS Chapter Select */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '40px', width: '220px' }}>
        <h3 style={{ color: '#fff', textShadow: '2px 2px #000', margin: '0 0 10px 0', fontFamily: 'monospace', fontSize: '1.2rem', textAlign: 'center' }}>TUTORIAL TAPES</h3>
        {CHAPTERS.map((chap, idx) => {
          const unlocked = maxUnlockedChapter >= chap.id;
          return (
            <div 
              key={chap.id}
              onClick={() => unlocked ? loadChapter(chap.id) : null}
              onMouseEnter={() => setHoveredTape(chap.id)}
              onMouseLeave={() => setHoveredTape(null)}
              style={{
                width: '200px', height: '100px', background: unlocked ? '#222' : '#111',
                border: '2px solid #555', borderRadius: '5px',
                position: 'relative', cursor: unlocked ? 'pointer' : 'not-allowed',
                boxShadow: unlocked ? '5px 5px 10px rgba(0,0,0,0.5)' : 'none',
                opacity: unlocked ? 1 : 0.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s',
                transform: unlocked 
                  ? (hoveredTape === chap.id ? 'scale(1.05) translateX(10px)' : 'scale(1)') 
                  : 'scale(0.95)'
              }}>
              {/* Spine label */}
              <div style={{
                width: '160px', height: '40px', background: unlocked ? chap.color : '#444',
                borderRadius: '3px', border: '1px solid #000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '5px'
              }}>
                <span style={{ 
                  fontFamily: '"Comic Sans MS", cursive, sans-serif', fontSize: '0.8rem', 
                  fontWeight: 'bold', color: '#000', textAlign: 'center'
                }}>
                  {unlocked ? chap.title : "???"}
                </span>
              </div>
              {/* Tape ridges */}
              <div style={{ position: 'absolute', left: '-2px', top: '20px', width: '4px', height: '60px', background: '#111', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                 {[1,2,3,4,5,6,7,8].map(i => <div key={i} style={{ flex: 1, background: '#333' }} />)}
              </div>
            </div>
          );
        })}
      </div>

    </div>
    </>
  );
}
