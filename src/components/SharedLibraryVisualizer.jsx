import React, { useState, useEffect } from 'react';
import discordLogo from '../assets/Discord_Logo.png?url';
import spotifyLogo from '../assets/Spotify_Logo.png?url';
import valorantLogo from '../assets/Valorant_Logo.png?url';
import chromeLogo from '../assets/Chrome_Logo.png?url';

export default function SharedLibraryVisualizer() {
  const [step, setStep] = useState(-1);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [animStage, setAnimStage] = useState(0);
  const [animTrigger, setAnimTrigger] = useState(0);

  useEffect(() => {
    setAnimStage(0);
    if (step === 1) {
      const t1 = setTimeout(() => setAnimStage(1), 200);  
      const t2 = setTimeout(() => setAnimStage(2), 1700); 
      const t3 = setTimeout(() => setAnimStage(3), 3200); 
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (step === 2) {
    }
    if (step === 3) {
      const t1 = setTimeout(() => setAnimStage(1), 200);  
      const t2 = setTimeout(() => setAnimStage(2), 1700); 
      const t3 = setTimeout(() => setAnimStage(3), 3200); 
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (step === 4) {
      const t1 = setTimeout(() => setAnimStage(1), 200);
      return () => { clearTimeout(t1); };
    }
  }, [step, animTrigger]);

  const handlePlay = () => {
    setHasPlayed(true);
    setTimeout(() => setStep(0), 100);
  };

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handleBack = () => setStep((s) => Math.max(0, s - 1));
  const handleRefresh = () => setAnimTrigger((t) => t + 1);

  const slotCenters = [...Array(10)].map((_, i) => 14.5 + i * 9);

  const yDiscord = 15;   
  const ySpotify = 40;   
  const yValorant = 65;  
  const yChrome = 90;    

  const apps = [
    { id: 'discord', icon: discordLogo, name: 'Discord', color: '#a855f7', top: `${yDiscord}%` },
    { id: 'spotify', icon: spotifyLogo, name: 'Spotify', color: '#34d399', top: `${ySpotify}%` },
    { id: 'valorant', icon: valorantLogo, name: 'Valorant', color: '#f43f5e', top: `${yValorant}%` }
  ];
  const chromeApp = { id: 'chrome', icon: chromeLogo, name: 'Chrome', color: '#facc15', top: `${yChrome}%` };

  // Step 1: Wasted Memory
  const step1Slots = {
    discord: { app: [0, 1], lib: 2 },
    spotify: { app: [3, 4], lib: 5 },
    valorant: { app: [6, 7, 8], lib: 9 }
  };

  // Step 2 & 3: Shared Memory
  const sharedLibSlot = 2;
  const step2Slots = {
    discord: { app: [0, 1] },
    spotify: { app: [3, 4] },
    valorant: { app: [5, 6, 7] },
    chrome: { app: [8, 9] }
  };

  const APP_L = 20;
  const APP_W = 18;
  const APP_R = APP_L + APP_W; 
  
  const RAM_L = 60;
  
  const SPLIT_X = APP_R + (RAM_L - APP_R) / 2;

  const renderAppPaths = (appY, color, markerId, slots, libSlot, stageReq, currentStage, isShared = false) => {
    if (currentStage < stageReq) return null;
    
    return (
      <React.Fragment key={`paths-${color}`}>
        <path d={`M ${APP_R} ${appY} L ${SPLIT_X} ${appY}`} fill="none" stroke={color} strokeWidth="1" pathLength="100" className="anim-trunk-fade" />
        {slots.map(s => (
          <path key={`path-${color}-${s}`} d={`M ${SPLIT_X} ${appY} L ${SPLIT_X} ${slotCenters[s]} L ${RAM_L} ${slotCenters[s]}`} fill="none" stroke={color} strokeWidth="1" pathLength="100" markerEnd={`url(#${markerId})`} className="anim-branch-fade" />
        ))}
        {libSlot !== null && (
          <path d={`M ${SPLIT_X} ${appY} L ${SPLIT_X} ${slotCenters[libSlot]} L ${RAM_L} ${slotCenters[libSlot]}`} fill="none" stroke={color} strokeWidth="1" strokeDasharray={isShared ? "4 4" : "none"} pathLength="100" markerEnd={`url(#${markerId})`} className="anim-branch-fade" />
        )}
      </React.Fragment>
    );
  };

  return (
    <div style={{
      background: 'rgba(10, 6, 32, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(196, 164, 255, 0.1)',
      borderRadius: '20px',
      padding: '2rem 5rem',
      color: '#fff',
      fontFamily: '"Inter", sans-serif',
      marginTop: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '650px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px',
        background: step === 4 ? 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 60%)' :
                    step === 3 ? 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 60%)' :
                    step === 2 ? 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 60%)' :
                    'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 60%)',
        filter: 'blur(40px)', zIndex: 0, transition: 'background 0.5s ease'
      }}></div>

      {!hasPlayed && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <button onClick={handlePlay} className="btn-play">PLAY</button>
        </div>
      )}

      {/* REFRESH BUTTON */}
      <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', zIndex: 60, opacity: hasPlayed ? 1 : 0, transition: 'all 0.5s' }}>
        <button onClick={handleRefresh} className="btn-refresh">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>

      {/* SIDE CONTROLS */}
      <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s' }}>
        <button onClick={handleBack} disabled={step <= 0} className={`side-btn ${step > 0 ? 'active' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </div>
      <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s' }}>
        <button onClick={handleNext} disabled={step === 4} className={`side-btn ${step < 4 ? 'active next' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div style={{ zIndex: 10, position: 'relative', marginBottom: '1rem', opacity: hasPlayed ? 1 : 0, transition: 'opacity 0.5s' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase' }}>Shared Library Visualizer</div>
        <h4 style={{ margin: '5px 0 0 0', fontSize: '1.4rem', color: '#fff', minHeight: '32px' }}>
          {step === 0 && "System Booted"}
          {step === 1 && "Duplicate Libraries (Loading...)"}
          {step === 2 && "Wasting RAM Space (Warning!)"}
          {step === 3 && "Shared Libraries (Virtual Memory)"}
          {step === 4 && "Reclaiming Memory"}
        </h4>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center', zIndex: 10, minHeight: '450px' }}>
        
        {/* SVG PATHS */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
          <defs>
            <marker id="arrowPurpleSL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#a855f7" /></marker>
            <marker id="arrowGreenSL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#34d399" /></marker>
            <marker id="arrowRedSL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#f43f5e" /></marker>
            <marker id="arrowYellowSL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#facc15" /></marker>
          </defs>

          {(step === 1 || step === 2) && (
            <>
              {renderAppPaths(yDiscord, apps[0].color, "arrowPurpleSL", step1Slots.discord.app, step1Slots.discord.lib, 1, step === 2 ? 3 : animStage, false)}
              {renderAppPaths(ySpotify, apps[1].color, "arrowGreenSL", step1Slots.spotify.app, step1Slots.spotify.lib, 2, step === 2 ? 3 : animStage, false)}
              {renderAppPaths(yValorant, apps[2].color, "arrowRedSL", step1Slots.valorant.app, step1Slots.valorant.lib, 3, step === 2 ? 3 : animStage, false)}
            </>
          )}

          {step === 3 && (
            <>
              {renderAppPaths(yDiscord, apps[0].color, "arrowPurpleSL", step2Slots.discord.app, sharedLibSlot, 1, animStage, true)}
              {renderAppPaths(ySpotify, apps[1].color, "arrowGreenSL", step2Slots.spotify.app, sharedLibSlot, 2, animStage, true)}
              {renderAppPaths(yValorant, apps[2].color, "arrowRedSL", step2Slots.valorant.app, sharedLibSlot, 3, animStage, true)}
            </>
          )}

          {step === 4 && (
            <>
              {renderAppPaths(yChrome, chromeApp.color, "arrowYellowSL", step2Slots.chrome.app, sharedLibSlot, 1, animStage, true)}
            </>
          )}
        </svg>

        {/* COLUMN 1: APPS */}
        <div style={{ position: 'absolute', left: `${APP_L}%`, width: `${APP_W}%`, height: '100%', transition: 'all 0.8s ease', opacity: hasPlayed ? 1 : 0 }}>
          {apps.map((app, i) => {
            return (
              <div key={app.id} style={{
                position: 'absolute', top: app.top, left: 0, right: 0, transform: `translateY(-50%) ${(step === 1 || step === 2) && animStage === i+1 ? 'scale(1.05)' : 'scale(1)'}`,
                background: 'rgba(15, 23, 42, 0.9)', border: `2px solid ${app.color}`, borderRadius: '10px', padding: '0.6rem 0', textAlign: 'center',
                boxShadow: (step === 1 || step === 2) && animStage > i ? `0 0 15px ${app.color}66` : (step >= 3 ? `0 0 15px ${app.color}66` : 'none'),
                transition: 'all 0.3s ease'
              }}>
                <img src={app.icon} alt={app.name} style={{ width: '32px', height: '32px', marginBottom: '4px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{app.name}</div>
              </div>
            );
          })}
          
          {/* Chrome App */}
          <div style={{
            position: 'absolute', top: chromeApp.top, left: 0, right: 0, transform: `translateY(-50%) ${step === 4 && animStage >= 1 ? 'scale(1.05)' : 'scale(1)'}`,
            background: 'rgba(15, 23, 42, 0.9)', border: `2px solid ${chromeApp.color}`, borderRadius: '10px', padding: '0.6rem 0', textAlign: 'center',
            boxShadow: step === 4 && animStage >= 1 ? `0 0 15px ${chromeApp.color}66` : 'none',
            opacity: step === 4 ? 1 : 0, transition: 'all 0.8s ease', pointerEvents: 'none'
          }}>
            <img src={chromeApp.icon} alt={chromeApp.name} style={{ width: '32px', height: '32px', marginBottom: '4px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{chromeApp.name}</div>
          </div>
        </div>

        {/* COLUMN 2: PHYSICAL RAM */}
        <div style={{ position: 'absolute', left: `${RAM_L}%`, width: '22%', height: '100%', transform: hasPlayed ? 'translateX(0)' : 'translateX(100px)', opacity: hasPlayed ? 1 : 0, transition: 'all 0.8s ease' }}>
          <div style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #334155', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '10%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', color: '#e2e8f0', textAlign: 'center' }}>
              PHYSICAL RAM<br/>(10 SLOTS)
            </div>
            {[...Array(10)].map((_, i) => {
              let owner = null;
              let isLib = false;
              let isDrawingNow = false;

              if (step === 1 || step === 2) {
                const st = step === 2 ? 3 : animStage;
                if (step1Slots.discord.app.includes(i) && st >= 1) { owner = apps[0]; if (step === 1 && animStage === 1) isDrawingNow = true; }
                if (step1Slots.discord.lib === i && st >= 1) { owner = apps[0]; isLib = true; if (step === 1 && animStage === 1) isDrawingNow = true; }
                
                if (step1Slots.spotify.app.includes(i) && st >= 2) { owner = apps[1]; if (step === 1 && animStage === 2) isDrawingNow = true; }
                if (step1Slots.spotify.lib === i && st >= 2) { owner = apps[1]; isLib = true; if (step === 1 && animStage === 2) isDrawingNow = true; }
                
                if (step1Slots.valorant.app.includes(i) && st >= 3) { owner = apps[2]; if (step === 1 && animStage === 3) isDrawingNow = true; }
                if (step1Slots.valorant.lib === i && st >= 3) { owner = apps[2]; isLib = true; if (step === 1 && animStage === 3) isDrawingNow = true; }
              } 
              else if (step >= 3) {
                if (step2Slots.discord.app.includes(i) && (step === 4 || animStage >= 1)) { owner = apps[0]; if (step === 3 && animStage === 1) isDrawingNow = true; }
                if (step2Slots.spotify.app.includes(i) && (step === 4 || animStage >= 2)) { owner = apps[1]; if (step === 3 && animStage === 2) isDrawingNow = true; }
                if (step2Slots.valorant.app.includes(i) && (step === 4 || animStage >= 3)) { owner = apps[2]; if (step === 3 && animStage === 3) isDrawingNow = true; }
                
                if (i === sharedLibSlot && (step === 4 || animStage >= 1)) { owner = { color: '#0ea5e9', name: 'Shared Lib' }; isLib = true; if (step === 3 && animStage === 1) isDrawingNow = true; }
                
                if (step === 4 && step2Slots.chrome.app.includes(i) && animStage >= 1) {
                  owner = chromeApp;
                  if (animStage === 1) isDrawingNow = true;
                }
              }

              // Background transparency for libs vs apps
              let blockBg = owner ? owner.color : 'transparent';
              if (isLib && owner && (step === 1 || step === 2)) {
                // Dim down the identical copies to differentiate from app data
                blockBg = `${owner.color}99`; 
              }

              const isWasting = step === 2 && isLib;

              return (
                <div key={`pram-${i}`} className={isDrawingNow ? 'fade-block-delayed' : 'fade-block'} style={{ 
                  height: '9%', borderBottom: i < 9 ? '1px solid #1e293b' : 'none', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: blockBg, transition: 'background 0.5s ease, transform 0.5s ease',
                  animation: isWasting ? 'blinkWarning 1.5s infinite' : ''
                }}>
                  {owner && (
                    <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                      {isLib ? 'libc (C Library)' : owner.name}
                      {isWasting && <span style={{ color: '#ef4444', marginLeft: '6px', fontSize: '1rem', fontWeight: '900', textShadow: '0 0 5px rgba(239,68,68,0.8)' }}>!</span>}
                      {!isLib && <span className="loading-dots"></span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER TEXT */}
      <div style={{ marginTop: '2rem', padding: '1.2rem', borderRadius: '12px', height: '110px', display: 'flex', alignItems: 'center', zIndex: 10, background: (step === 1 || step === 2) ? 'rgba(239, 68, 68, 0.1)' : (step === 3 ? 'rgba(167, 139, 250, 0.1)' : (step === 4 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.05)')), borderLeft: `4px solid ${(step === 1 || step === 2) ? '#ef4444' : (step === 4 ? '#34d399' : '#38bdf8')}`, opacity: hasPlayed ? 1 : 0, transition: 'all 0.5s' }}>
        <p style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0', lineHeight: '1.6' }}>
          {step === 0 && "Welcome to the Shared Library Simulator. Press Next to start loading programs."}
          {step === 1 && "In older architectures without Virtual Memory, every app loaded its own copy of standard libraries (like the C Library) into Physical RAM."}
          {step === 2 && "Because there is no sharing, 3 Apps means 3 identical copies of the same library taking up slots! We are wasting RAM space that could be used for other apps!"}
          {step === 3 && "With Virtual Memory, the OS maps all 3 programs to use a single 'Shared' C Library block in Physical RAM! The other apps simply shifted up. We just reclaimed 2 blocks of memory!"}
          {step === 4 && "Because we saved that space, we now have enough room to open Chrome! Chrome also uses the Shared C Library, so it only needs to load its own data into the 2 free blocks we reclaimed."}
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
        
        .btn-refresh {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); 
          border-radius: 8px; padding: 8px; color: #fff; cursor: pointer; 
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .btn-refresh:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05); box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
        .btn-refresh:active { transform: scale(0.95); }
        .btn-refresh svg { transition: transform 0.4s ease; }
        .btn-refresh:hover svg { transform: rotate(180deg); }

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

        @keyframes drawTrunk {
          from { stroke-dashoffset: 100; stroke-dasharray: 100; }
          to { stroke-dashoffset: 0; stroke-dasharray: 100; }
        }
        @keyframes drawBranch {
          from { stroke-dashoffset: 100; stroke-dasharray: 100; opacity: 0; }
          to { stroke-dashoffset: 0; stroke-dasharray: 100; opacity: 1; }
        }
        @keyframes fadeOutPath {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes blinkWarning {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 40px rgba(239, 68, 68, 0.4); }
          50% { opacity: 0.7; transform: scale(0.97); box-shadow: 0 0 15px rgba(239, 68, 68, 0.1); }
        }
        @keyframes fadeInBlock {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .anim-trunk-fade {
          stroke-dasharray: 100; stroke-dashoffset: 100;
          animation: drawTrunk 0.4s linear forwards, fadeOutPath 0.3s ease 1.5s forwards;
        }
        .anim-branch-fade {
          stroke-dasharray: 100; stroke-dashoffset: 100; opacity: 0;
          animation: drawBranch 0.4s linear 0.4s forwards, fadeOutPath 0.3s ease 1.5s forwards;
        }
        
        .fade-block-delayed { opacity: 0; animation: fadeInBlock 0.3s ease 0.8s forwards; }
        .fade-block { opacity: 1; }
        
        @keyframes dots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
        }
        .loading-dots::after {
          content: '';
          animation: dots 1.5s infinite steps(1);
        }
      `}</style>
    </div>
  );
}
