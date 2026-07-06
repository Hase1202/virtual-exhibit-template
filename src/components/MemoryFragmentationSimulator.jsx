import { useState } from 'react';
import s from './MemoryFragmentationSimulator.module.css';

/* ================================================================
   MemoryFragmentationSimulator.jsx
   Interactive 10-step simulator showing how external fragmentation
   prevents program loading, and how virtual memory solves it.
   ================================================================ */

const TOTAL_RAM = 8; // GB

// Program definitions
const PROGRAMS = {
  chrome:  { name: 'Chrome + YouTube', size: 2, color: 'segChrome',   dot: '#3b82f6' },
  discord: { name: 'Discord',          size: 1, color: 'segDiscord',  dot: '#7c3aed' },
  valorant:{ name: 'Valorant',         size: 3, color: 'segValorant', dot: '#22c55e' },
  spotify: { name: 'Spotify',          size: 1, color: 'segSpotify',  dot: '#14b8a6' },
  editor:  { name: 'Video Editor',     size: 4, color: 'segEditor',   dot: '#f59e0b' },
};

// Each step: { segments, virtual (optional), statuses, caption, captionType }
// segments: array of { id, label, size, type } where type = program key | 'free' | 'failed' | 'editorVM'
// statuses: { programKey: 'waiting'|'next'|'running'|'closed'|'failed'|'mapped' }

const STEPS = [
  // Step 0 — Empty RAM
  {
    segments: [{ id: 'f0', label: 'Free', size: 8, type: 'free' }],
    virtual: null,
    statuses: { chrome: 'next', discord: 'waiting', valorant: 'waiting', spotify: 'waiting', editor: 'waiting' },
    caption: 'RAM is completely empty — 8 GB of clean, contiguous memory. Click Next to start loading programs.',
    captionType: 'normal',
  },
  // Step 1 — Load Chrome
  {
    segments: [
      { id: 'chrome', label: 'Chrome + YT', size: 2, type: 'chrome' },
      { id: 'f1', label: 'Free', size: 6, type: 'free' },
    ],
    virtual: null,
    statuses: { chrome: 'running', discord: 'next', valorant: 'waiting', spotify: 'waiting', editor: 'waiting' },
    caption: 'Chrome with YouTube loads into the first 2 GB of RAM. There is still 6 GB of free space in one continuous block.',
    captionType: 'normal',
  },
  // Step 2 — Load Discord
  {
    segments: [
      { id: 'chrome', label: 'Chrome + YT', size: 2, type: 'chrome' },
      { id: 'discord', label: 'Discord', size: 1, type: 'discord' },
      { id: 'f2', label: 'Free', size: 5, type: 'free' },
    ],
    virtual: null,
    statuses: { chrome: 'running', discord: 'running', valorant: 'next', spotify: 'waiting', editor: 'waiting' },
    caption: 'Discord takes the next 1 GB. Programs are loaded one after another in contiguous blocks — this is how simple memory allocation works.',
    captionType: 'normal',
  },
  // Step 3 — Load Valorant
  {
    segments: [
      { id: 'chrome', label: 'Chrome + YT', size: 2, type: 'chrome' },
      { id: 'discord', label: 'Discord', size: 1, type: 'discord' },
      { id: 'valorant', label: 'Valorant', size: 3, type: 'valorant' },
      { id: 'f3', label: 'Free', size: 2, type: 'free' },
    ],
    virtual: null,
    statuses: { chrome: 'running', discord: 'running', valorant: 'running', spotify: 'next', editor: 'waiting' },
    caption: 'Valorant occupies the next 3 GB. Only 2 GB of free space remains. Notice how memory fills up quickly.',
    captionType: 'normal',
  },
  // Step 4 — Load Spotify
  {
    segments: [
      { id: 'chrome', label: 'Chrome + YT', size: 2, type: 'chrome' },
      { id: 'discord', label: 'Discord', size: 1, type: 'discord' },
      { id: 'valorant', label: 'Valorant', size: 3, type: 'valorant' },
      { id: 'spotify', label: 'Spotify', size: 1, type: 'spotify' },
      { id: 'f4', label: 'Free', size: 1, type: 'free' },
    ],
    virtual: null,
    statuses: { chrome: 'running', discord: 'running', valorant: 'running', spotify: 'running', editor: 'waiting' },
    caption: 'Spotify takes 1 GB. Now 7 of 8 GB are used, and only 1 GB is free. RAM is almost full.',
    captionType: 'normal',
  },
  // Step 5 — Close Chrome → 2 GB hole
  {
    segments: [
      { id: 'f5a', label: 'Free', size: 2, type: 'free' },
      { id: 'discord', label: 'Discord', size: 1, type: 'discord' },
      { id: 'valorant', label: 'Valorant', size: 3, type: 'valorant' },
      { id: 'spotify', label: 'Spotify', size: 1, type: 'spotify' },
      { id: 'f5b', label: 'Free', size: 1, type: 'free' },
    ],
    virtual: null,
    statuses: { chrome: 'closed', discord: 'running', valorant: 'running', spotify: 'running', editor: 'waiting' },
    caption: 'Chrome is closed. A 2 GB hole opens at the front of RAM. Notice that this hole is separated from the 1 GB hole at the end by Discord, Valorant, and Spotify.',
    captionType: 'normal',
  },
  // Step 6 — Close Valorant → 3 GB hole in middle
  {
    segments: [
      { id: 'f6a', label: 'Free', size: 2, type: 'free' },
      { id: 'discord', label: 'Discord', size: 1, type: 'discord' },
      { id: 'f6b', label: 'Free', size: 3, type: 'free' },
      { id: 'spotify', label: 'Spotify', size: 1, type: 'spotify' },
      { id: 'f6c', label: 'Free', size: 1, type: 'free' },
    ],
    virtual: null,
    statuses: { chrome: 'closed', discord: 'running', valorant: 'closed', spotify: 'running', editor: 'next' },
    caption: 'Valorant is closed — a 3 GB hole appears in the middle. Total free memory is now 6 GB, but it is scattered across three separate holes (2 + 3 + 1). Discord and Spotify physically separate the holes, preventing them from merging.',
    captionType: 'normal',
  },
  // Step 7 — Video Editor FAILS
  {
    segments: [
      { id: 'f7a', label: '⚠ Free', size: 2, type: 'failed' },
      { id: 'discord', label: 'Discord', size: 1, type: 'discord' },
      { id: 'f7b', label: '⚠ Free', size: 3, type: 'failed' },
      { id: 'spotify', label: 'Spotify', size: 1, type: 'spotify' },
      { id: 'f7c', label: '⚠ Free', size: 1, type: 'failed' },
    ],
    virtual: null,
    statuses: { chrome: 'closed', discord: 'running', valorant: 'closed', spotify: 'running', editor: 'failed' },
    caption: '❌ The Video Editor needs 4 GB of contiguous memory, but the largest single free block is only 3 GB! Total free = 6 GB, but no single hole is big enough. This is the fragmentation trap — external fragmentation in action.',
    captionType: 'fail',
  },
  // Step 8 — Introduce Virtual Memory concept
  {
    segments: [
      { id: 'f8a', label: 'Free', size: 2, type: 'free' },
      { id: 'discord', label: 'Discord', size: 1, type: 'discord' },
      { id: 'f8b', label: 'Free', size: 3, type: 'free' },
      { id: 'spotify', label: 'Spotify', size: 1, type: 'spotify' },
      { id: 'f8c', label: 'Free', size: 1, type: 'free' },
    ],
    virtual: [
      { id: 'vm-editor', label: 'Video Editor (virtual)', size: 4, type: 'editorVM' },
      { id: 'vm-free', label: 'Available', size: 4, type: 'free' },
    ],
    statuses: { chrome: 'closed', discord: 'running', valorant: 'closed', spotify: 'running', editor: 'mapped' },
    caption: '💡 Virtual memory to the rescue! The OS creates a page table that maps scattered physical pages into one continuous virtual address space. The Video Editor thinks it has 4 GB in a row, but physically the memory is split across different holes.',
    captionType: 'success',
  },
  // Step 9 — Video Editor loaded via virtual memory
  {
    segments: [
      { id: 'p9a', label: 'VE Page 1-2', size: 2, type: 'editorVM' },
      { id: 'discord', label: 'Discord', size: 1, type: 'discord' },
      { id: 'p9b', label: 'VE Page 3-4', size: 2, type: 'editorVM' },
      { id: 'spotify', label: 'Spotify', size: 1, type: 'spotify' },
      { id: 'f9', label: 'Free', size: 2, type: 'free' },
    ],
    virtual: [
      { id: 'vm-editor2', label: 'Video Editor — 4 GB continuous', size: 4, type: 'editorVM' },
      { id: 'vm-free2', label: 'Available', size: 4, type: 'free' },
    ],
    statuses: { chrome: 'closed', discord: 'running', valorant: 'closed', spotify: 'running', editor: 'mapped' },
    caption: '✅ The Video Editor is successfully loaded! Physical RAM shows the program split across two non-adjacent blocks, but the virtual memory view shows one clean 4 GB space. The page table handles the mapping transparently.',
    captionType: 'success',
  },
];

// Compute stats from segments
function computeStats(segments) {
  let totalFree = 0;
  let largestBlock = 0;
  let holes = 0;
  for (const seg of segments) {
    if (seg.type === 'free' || seg.type === 'failed') {
      totalFree += seg.size;
      if (seg.size > largestBlock) largestBlock = seg.size;
      holes++;
    }
  }
  return { totalFree, largestBlock, holes };
}

// Determine segment CSS class
function segClass(type) {
  const map = {
    chrome: s.segChrome,
    discord: s.segDiscord,
    valorant: s.segValorant,
    spotify: s.segSpotify,
    editor: s.segEditor,
    editorVM: s.segEditorVM,
    free: s.segFree,
    failed: s.segFailed,
  };
  return map[type] || s.segFree;
}

// Program pill component
function ProgramPill({ progKey, status }) {
  const prog = PROGRAMS[progKey];
  if (!prog) return null;

  const statusClasses = {
    waiting: s.pillWaiting,
    next: '',
    running: s.pillRunning,
    closed: s.pillClosed,
    failed: s.pillFailed,
    mapped: s.pillMapped,
  };

  const badgeClasses = {
    waiting: s.badgeWaiting,
    next: s.badgeNext,
    running: s.badgeRunning,
    closed: s.badgeClosed,
    failed: s.badgeFailed,
    mapped: s.badgeMapped,
  };

  const badgeLabels = {
    waiting: 'Waiting',
    next: 'Next Up',
    running: 'Running',
    closed: 'Closed',
    failed: 'Failed',
    mapped: 'VM Mapped',
  };

  return (
    <div className={`${s.programPill} ${statusClasses[status] || ''}`}>
      <span className={s.pillDot} style={{ backgroundColor: prog.dot }} />
      <span>{prog.name}</span>
      <span className={s.pillSize}>{prog.size} GB</span>
      <span className={`${s.pillStatusBadge} ${badgeClasses[status] || ''}`}>
        {badgeLabels[status] || status}
      </span>
    </div>
  );
}

// Main simulator
export default function MemoryFragmentationSimulator() {
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const stats = computeStats(current.segments);
  const totalSteps = STEPS.length - 1;

  const isFailStep = step === 7;
  const isVMStep = step >= 8;

  return (
    <div className={s.simulator}>
      {/* Progress */}
      <div className={s.progressRow}>
        <span className={s.progressLabel}>Step {step} of {totalSteps}</span>
        <div className={s.progressTrack}>
          <div
            className={s.progressFill}
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <span className={s.progressLabel}>{Math.round((step / totalSteps) * 100)}%</span>
      </div>

      {/* Physical RAM Bar */}
      <div className={s.memorySection}>
        <div className={s.memoryBarLabel}>
          <span className={s.memoryBarLabelIcon}>💾</span>
          Physical RAM — {TOTAL_RAM} GB
        </div>
        <div className={s.memoryBarContainer}>
          <div className={s.memoryBar}>
            {current.segments.map((seg) => (
              <div
                key={seg.id}
                className={`${s.segment} ${segClass(seg.type)}`}
                style={{ flex: seg.size }}
                title={`${seg.label} — ${seg.size} GB`}
              >
                <span className={s.segmentLabel}>{seg.label}</span>
                <span className={s.segmentSize}>{seg.size} GB</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Virtual Memory Bar (steps 8-9 only) */}
      {current.virtual && (
        <div className={`${s.memorySection} ${s.memoryBarVirtual}`}>
          <div className={s.mappingArrows}>↕ ↕ ↕</div>
          <div className={s.mappingHint}>
            🔗 Page Table maps physical → virtual
          </div>
          <div className={s.memoryBarLabel}>
            <span className={s.memoryBarLabelIcon}>🌐</span>
            Virtual Memory View — What the Video Editor sees
          </div>
          <div className={s.memoryBarContainer}>
            <div className={s.memoryBar}>
              {current.virtual.map((seg) => (
                <div
                  key={seg.id}
                  className={`${s.segment} ${segClass(seg.type)}`}
                  style={{ flex: seg.size }}
                  title={`${seg.label} — ${seg.size} GB`}
                >
                  <span className={s.segmentLabel}>{seg.label}</span>
                  <span className={s.segmentSize}>{seg.size} GB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className={s.statsRow}>
        <div className={`${s.statCard} ${isFailStep ? s.statWarning : ''}`}>
          <div className={s.statValue}>{stats.totalFree} GB</div>
          <div className={s.statLabel}>Total Free</div>
          <div className={s.statHint}>All unused RAM added together</div>
        </div>
        <div className={`${s.statCard} ${isFailStep ? s.statWarning : ''} ${isVMStep ? s.statSuccess : ''}`}>
          <div className={s.statValue}>{stats.largestBlock} GB</div>
          <div className={s.statLabel}>Largest Block</div>
          <div className={s.statHint}>Biggest single empty space</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{stats.holes}</div>
          <div className={s.statLabel}>Free Holes</div>
          <div className={s.statHint}>Separate gaps in memory</div>
        </div>
      </div>

      {/* Caption */}
      <div
        className={`${s.captionBox} ${
          current.captionType === 'fail'
            ? s.captionFail
            : current.captionType === 'success'
            ? s.captionSuccess
            : ''
        }`}
      >
        <div className={s.captionTitle}>
          {current.captionType === 'fail'
            ? '⛔ Fragmentation Trap'
            : current.captionType === 'success'
            ? '✨ Virtual Memory Solution'
            : '📋 System Log'}
        </div>
        <p className={s.captionText}>{current.caption}</p>
      </div>

      {/* Program Status Pills */}
      <div className={s.programsSection}>
        <div className={s.programsLabel}>Program Status</div>
        <div className={s.programGrid}>
          {Object.entries(current.statuses).map(([key, status]) => (
            <ProgramPill key={key} progKey={key} status={status} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className={s.controls}>
        <button
          className={s.btn}
          onClick={() => setStep((p) => Math.max(0, p - 1))}
          disabled={step === 0}
        >
          ← Back
        </button>
        <button
          className={`${s.btn} ${s.btnPrimary}`}
          onClick={() => setStep((p) => Math.min(totalSteps, p + 1))}
          disabled={step === totalSteps}
        >
          Next →
        </button>
        <button
          className={`${s.btn} ${s.btnReset}`}
          onClick={() => setStep(0)}
          disabled={step === 0}
        >
          ↺ Reset
        </button>
      </div>

      {/* Micro-explanations */}
      <div className={s.microExplanations}>
        <div className={s.microTip}>
          <span>💡</span>
          <span>Total free memory = all unused RAM added together.</span>
        </div>
        <div className={s.microTip}>
          <span>💡</span>
          <span>Largest block = the biggest single empty space.</span>
        </div>
        <div className={s.microTip}>
          <span>💡</span>
          <span>Without virtual memory, a program needs one continuous block.</span>
        </div>
        <div className={s.microTip}>
          <span>💡</span>
          <span>Virtual memory lets the program see scattered memory as one clean space.</span>
        </div>
      </div>
    </div>
  );
}
