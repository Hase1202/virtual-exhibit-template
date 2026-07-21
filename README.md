### **CSARCH2 VIRTUAL EXHIBIT - INCREMENTAL MILESTONE LOG**

**Submitted By:**

* Fabregas Matthew Drew  
* Lee Hannah  
* Lim Justin Lance Te  
* Nono Alec Marx Gabriel Belen  
* Yasumuro Mariel Mendoza

### **DEPLOYED SITE:** https://hase1202.github.io/virtual-exhibit-template/?fbclid=IwY2xjawS51_NleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEeRWW4ZKnuZ9oDu7o43sgbREaTRyrwppVkuey8OBcZkgQL1vK6sB4W7cmFr1E_aem_7PKhIVTHdtHrlPpERcP_jA

---
## **TABLE OF CONTENTS**

- [PART 3: FINAL SUBMISSION & INTERACTIVE HARDWARE OVERHAUL](#-part-3-final-submission--interactive-hardware-overhaul)
  - [3.1 Incremental Git Commit Log & Feature Trajectory](#31-incremental-git-commit-log--feature-trajectory)
  - [3.2 Complete Project Component Directory](#32-complete-project-component-directory)
  - [3.3 Final Exhibit Development & Design Philosophy](#33-final-exhibit-development--design-philosophy)
  - [3.4 Final Exhibit Technical Challenges & Solutions](#34-final-exhibit-technical-challenges--solutions)
  - [3.5 Final Exhibit Technical "Aha" Moments](#35-final-exhibit-technical-aha-moments)
  - [3.6 Visual & Interactive Development](#36-visual--interactive-development)
  - [3.7 AI Disclaimer](#37-ai-disclaimer)
- [PART 2: MID-MILESTONE FOUNDATION & EARLY PROTOTYPE](#-part-2-mid-milestone-foundation--early-prototype)
  - [2.1 Mid-Milestone Development Scope](#21-mid-milestone-development-scope)
  - [2.2 Mid-Milestone Challenges and Learnings](#22-mid-milestone-challenges-and-learnings)
  - [2.3 Mid-Milestone "Aha" Moment](#23-mid-milestone-aha-moment)
  - [2.4 Mid-Milestone Future Plans](#24-mid-milestone-future-plans)
- [PART 1: ORIGINAL PROPOSAL & ARCHITECTURAL WRITE-UP](#-part-1-original-proposal--architectural-write-up)
  - [1.1 Proposal Resource Links](#11-proposal-resource-links)
  - [1.2 Background of the Proposed Virtual Exhibit](#12-background-of-the-proposed-virtual-exhibit)
  - [1.3 Tech Stack Plan](#13-tech-stack-plan)
  - [1.4 Proposed Interactive Element: RedDev OS Memory Simulator](#14-proposed-interactive-element-reddev-os-memory-simulator)

---

# **PART 3: FINAL SUBMISSION & INTERACTIVE HARDWARE OVERHAUL**

### **3.1 Incremental Git Commit Log & Feature Trajectory**

| Commit Milestone | Area / Component | Feature & Architectural Improvements Added | Status |
| :--- | :--- | :--- | :--- |
| `69cb6a9` / `8ada80e` | `RetroOsSimulator.jsx` | Created interactive Win95 Retro OS simulator, task manager, direct access vs. virtual memory allocation, and crash handlers. | Completed |
| `69a3446` / `ca6199e` | Deep Dive Problem Visualizers | Implemented `SecurityVisualizer` (Problem 1), `SwapVisualizer` (Problem 2), and `SharedLibraryVisualizer` (Problem 3). | Completed |
| `ad278e5` / `1a60b1a` | Page Table & PTBR Mechanics | Built `ContextSwitchVisualizer` (PTBR process switching) and `PageTableEntryVisualizer` (Protection & Status bits). | Completed |
| `e879cfa` / `89fb653` | Quiz Suite | Added `VMKnowledgeQuiz` (8-question knowledge check) and `VirtualMemoryQuiz` (replacement algorithm test). | Completed |
| `569b3e6` / `0c31f4f` | Hardware & 3D Overhaul | Built `PageTableVisualizer` (side-by-side 3-column architecture), `AddressSignalPipeline` (MMU pipeline), `PageFrame3DVisualizer` (3D RAM matrix), and merged branch updates. | Completed |
| `686804c` / `Recent` | UI & Documentation Polish | Standardized SVG vector icons, centered quiz CTA screen, docked inspection drawers, and updated incremental README. | Completed |

---

### **3.2 Complete Project Component Directory**

```text
src/
├── components/
│   ├── RetroOsSimulator.jsx                    <- Interactive Retro Win95 OS mini-game & memory task manager
│   ├── SecurityVisualizer.jsx                  <- Problem 1: Memory protection & process isolation simulator
│   ├── SwapVisualizer.jsx                      <- Problem 2: Demand paging & disk swap file animator
│   ├── SharedLibraryVisualizer.jsx             <- Problem 3: Shared pages & C library (libc) RAM deduplication
│   ├── PageTableVisualizer.jsx                 <- Side-by-side 3-column Page Table & PTBR lookup architecture
│   ├── AddressSignalPipeline.jsx               <- Hardware MMU translation & TLB hit/miss pipeline stepper
│   ├── PageFrame3DVisualizer.jsx               <- 3D CSS isometric physical RAM matrix (4x4x4 cube)
│   ├── ContextSwitchVisualizer.jsx             <- Process context switch & PTBR pointer animator
│   ├── PageTableEntryVisualizer.jsx            <- Status (Valid/Dirty/Accessed) & Protection (R/W/X) bits inspector
│   ├── TlbSimulator.jsx                        <- Step-by-step Page Table + TLB lookup flow
│   ├── VMKnowledgeQuiz.jsx                     <- Centered 8-question knowledge checkpoint & review cards
│   ├── VirtualMemoryQuiz.jsx                   <- Page replacement algorithm personality test
│   ├── MemoryFragmentationSimulator.jsx        <- Canvas-based allocator (Paging vs. Segmentation)
│   ├── ConceptCard.astro                       <- Card template for key terms/hardware specs
│   └── TakeawayCard.astro                      <- Structured key findings template
├── pages/
│   └── virtual-memory.mdx                      <- Root MDX page assembling the full exhibit
└── styles/
    └── exhibit-theme.css                       <- "Memory Lab" dark futuristic theme stylesheet
```

---

### **3.3 Final Exhibit Development & Design Philosophy**

Expanding beyond our mid-milestone prototype, we built a full suite of interactive hardware visualizers and OS simulations. 

**Visual First & Retro UI Design:**  
The layout follows a modern futuristic feel with purplish glassmorphism, designed specifically to highlight essential hardware concepts visually through step-by-step interactive animations rather than heavy walls of text. We intentionally introduced the **REDDEV tutorial** and **Retro OS Simulator** early on—incorporating vintage PC aesthetics and cassette-tape elements to contrast legacy Direct Access crashes against modern Virtual Memory solutions.

We followed our proposed layout starting with the "Virtual Memory" title and abstract, followed by key concept cards. We then feature hardware-level pipeline simulations tracing virtual address requests through the MMU, TLB cache, and 3D RAM matrix (`PageFrame3DVisualizer`). Lastly, we included key takeaway summaries, an 8-question knowledge checkpoint (`VMKnowledgeQuiz`), and a personality quiz (`VirtualMemoryQuiz`).

---

### **3.4 Final Exhibit Technical Challenges & Solutions**

1. **Incorporating Step-by-Step Visualizations into Definitions & Asynchronous Timing Bugs:**  
   Thinking of ways to seamlessly incorporate interactive visualizers into technical definitions so users could easily grasp complex hardware concepts was a major challenge. While building animated visualizers, we frequently encountered tricky timing bugs, such as signal arrows and memory bus pulses not spawning at the correct step transitions. Debugging asynchronous animation sequences in React state while learning Astro on the fly was tough, especially since the more complex the CSARCH2 topic (like TLB misses and page table walks), the harder it was to design an intuitive step-by-step visualization for visitors to follow.

2. **Retro OS Desktop State Machine & Direct Access Memory Crashes (`RetroOsSimulator.jsx`):**  
   Managing multi-window state (`zIndex`, drag coordinates, open/close states) alongside real-time physical RAM allocation presented complex state management challenges. When a user opens apps under Direct Memory Access, calculating non-contiguous holes dynamically while triggering simulated kernel panic crashes when allocating a 4GB block across scattered holes required robust state tracking in React.

3. **Deduplicating Physical RAM Frames across Multiple Virtual Spaces (`SharedLibraryVisualizer.jsx`):**  
   Simulating shared library pages required visualizing four independent program virtual address spaces pointing to the exact same physical RAM frame (e.g., `libc`). Ensuring that closing one application freed its private virtual mapping while retaining the shared physical frame for remaining active programs required precise state synchronization.

4. **3D Isometric Depth & HUD Collisions (`PageFrame3DVisualizer.jsx`):**  
   Rendering a 4x4x4 (64-frame) CSS isometric 3D cube presented depth-layering challenges. Floating absolute HUD overlays originally collided with header filter pills and truncated footer captions on standard display resolutions. We solved this by restructuring the component into containerized CSS grid areas with docked info panels.

---

### **3.5 Final Exhibit Technical "Aha" Moments**

- **Bridging Classroom Theory & Hardware Middleman Realities:**  
  *“Wow, virtual memory is actually pretty related to what we are discussing in class, right?”* When starting out contributing to this project, virtual memory felt intimidating. We watched instructional videos to learn how it actually works. Virtual memory mainly is just a middleman, but how it works under the hood is quite complex, so creating a clear explanation with step-by-step visualizations was an illuminating milestone.

- **Docked Inspection Drawers vs. Absolute Floating Tooltips:**  
  When inspecting page table entry bits (`Valid`, `Dirty`, `Protection`), floating tooltips (`position: absolute, right: 105%`) frequently broke out of viewport bounds on smaller laptop screens. Our "aha" moment was embedding a docked bit inspector drawer directly at the base of the magnified table card. This eliminated clipping bugs permanently while keeping bit inspection clear and accessible.

- **Strict SVG Grid Alignment for Vector Badges:**  
  We encountered subtle cross-browser alignment shifts where SVG icons inside rounded glassmorphic badges rendered slightly offset to the left. Applying `display: grid; place-items: center;` to badge containers along with `display: block; margin: 0 auto;` on SVG elements ensured perfect geometric centering across all screen densities.

- **Address Space Identifier (ASID) & Context Switches:**  
  While building `ContextSwitchVisualizer` and `TlbSimulator`, we discovered how modern processors avoid costly TLB flushes during context switches. Tagging TLB entries with an ASID allows the CPU to store translations for multiple processes simultaneously, allowing context switches to occur in nanoseconds.

- **Hardware Address Decomposition (Page Number vs. Offset):**  
  Understanding that the MMU splits virtual addresses into a Virtual Page Number (VPN) and a Page Offset was an illuminating milestone. Because offset bits map 1-to-1 into physical frames without translation, the MMU only needs to translate the page number, dramatically speeding up hardware translation pipelines.

---

### **3.6 Visual & Interactive Development**

**Interactive Visual Allocation & 3D RAM Matrix:**  
Rather than just writing about paging and segmentation, the `MemoryFragmentationSimulator` uses an interactive grid that dynamically animates memory requests. Users can choose between contiguous memory, pure paging, or segmentation, and manually trigger allocation calls to watch external/internal fragmentation develop in real-time. We expanded this with `PageFrame3DVisualizer`, giving users a 3D isometric cube matrix to filter physical frames by Code Pages, Heap Frames, Shared Libraries, and Swapped sectors.

---

### **3.7 AI Disclaimer**

Generative AI tools (including Claude Code) were used throughout this project to accelerate work that would otherwise have taken significantly longer to complete manually, including:

* Scaffolding and writing frontend code for the RedDev OS Memory Simulator, such as React state logic, CSS Modules styling, and responsive layout handling  
* Assisting with UI/UX design decisions, including layout structure, visual styling, and component composition  
* Drafting and refining written content, such as exhibit copy and this README

All AI-assisted output was reviewed, tested, and edited by the team before inclusion in the final exhibit. The team remains responsible for the accuracy, functionality, and quality of the submitted work.

---

# **PART 2: MID-MILESTONE FOUNDATION & EARLY PROTOTYPE**

### **2.1 Mid-Milestone Development Scope**

Starting to bring the proposal’s vision to life, the group began with the foundational requirements of the exhibit. We followed our proposed layout by starting with the "Virtual Memory" title and abstract, followed by key concept cards to quickly introduce interesting facts. We intentionally introduced the interactive lab early on, as it is much more entertaining for users to play around with a visual simulation, which entices them to learn more about virtual RAM. The subsequent section provides detailed descriptions for users who want to dive deeper. Next, we featured an early virtual simulation demonstrating how a virtual address page lookup is traced through the TLB cache and page tables (`TlbSimulator.jsx`), utilizing loading animations to visualize the process. Lastly, we included a summary and a personality quiz (`VirtualMemoryQuiz.jsx`) to help the user determine which page replacement algorithm suits them best.

---

### **2.2 Mid-Milestone Challenges and Learnings**

- **Learning React and Astro on the Fly:**  
  Some of us struggled to learn React and Astro on the fly. We learned that React has the capability to store data (`state`) and is ideal for creating engaging UIs, whereas Astro does not store data in the same way, but acts more like "HTML+" with greater flexibility for building static designs.
- **Folder Organization & Scoped Styling:**  
  We quickly learned that organization is critical, employing a "divide and conquer" folder structure. The `styles` folder assists the `pages` folder (which contains our main MDX/HTML files). Because the `layouts` folder cannot be modified, and the `assets` folder is strictly for images, we utilized the `components` folder for our "sections". This is where we safely modified our React and Astro components, as it is much safer to scope layout and styling to a single section rather than cramming everything into a global CSS file. It was quite confusing to relearn JavaScript for React and Astro coming from CCAPDEV HTML, but having that prior web foundation gave us a good head start.

---

### **2.3 Mid-Milestone "Aha" Moment**

- **Global Stylesheet Isolation with CSS `:has()`:**  
  We ran into an issue where importing the customized dark-mode futuristic theme (`exhibit-theme.css`) inside the `virtual-memory.mdx` page was leaking styles globally—nuking the home page's light cube background pattern and breaking the layout structure when navigating back. Because we weren't allowed to edit locked `ExhibitLayout.astro` or `HomepageLayout.astro` files directly, the "aha" moment was wrapping all our global overrides in a `:has()` selector (`body:has(.ml-hero)`). This cleanly scopes all dark backgrounds, custom starfields, and header restyling to the virtual memory page only, leaving the home page intact.

---

### **2.4 Mid-Milestone Future Plans**

Although we weren’t able to fully implement everything in our original proposal during the mid-milestone—such as creating a separate page for a full-blown, step-by-step tutorial—we built a great foundation. We believed that if we had more time to learn React and Astro, we could create a gamified tutorial. However, even if that wasn't possible due to time constraints, we planned to improve our submission by adding more visual interactions related to virtual memory, such as its relationship to physical hardware and GPU mapping.

---

# **PART 1: ORIGINAL PROPOSAL & ARCHITECTURAL WRITE-UP**

### **1.1 Proposal Resource Links**

* **Proposal Write-Up Link:** https://docs.google.com/document/d/1ZMVh7Pd56G49Xbd0d0VN0TmAYVSYSMWPeGFJR1NeJHk/edit?tab=t.nmczb89685uj
* **Style Guide Snapshot Link:** https://www.figma.com/design/9UvQtgoi524cgPsaxZOKkg/CSARCH2---Style-guide-snapshot?node-id=1-1043&t=Wy7L57AGLdzWEqIN-1

---

### **1.2 Background of the Proposed Virtual Exhibit**

In early multitasking systems, the OS carved physical RAM into chunks and handed them to processes as they started. When a process closed, its chunk was freed, but that freed region sat wherever it happened to be in memory, not necessarily adjacent to any other free region. Over time, as programs were started and stopped at different moments, free memory became scattered across small, non-contiguous holes. This is external fragmentation. This means a system can have enough total free memory to satisfy an allocation request, yet be completely unable to fulfill it because no single contiguous block is large enough. A program needing 2.5 GB cannot be split across a 1 GB hole and a 2 GB hole. It must land in one contiguous region.

The classical workaround is compaction, moving all loaded programs to one end of RAM to consolidate the holes into one large block. It works, but it is expensive: the OS must copy potentially gigabytes of data and can cause noticeable freezes in the process. **Virtual memory is the deeper solution.** By introducing a layer of indirection between virtual and physical addresses, the OS frees programs from needing contiguous physical memory entirely. Physical RAM is divided into small fixed-size pages that can be scattered anywhere, while the program sees a clean, continuous address space. The fragmentation problem disappears from the program's perspective.

**This exhibit uses fragmentation as the entry point to that story, letting visitors experience the problem firsthand before arriving at virtual memory as the answer.**

---

### **1.3 Tech Stack Plan**

The project will follow the provided Astro-based museum template to ensure compatibility with the central virtual museum website.

The proposed core stack is as follows:

* Node.js 26 for the required runtime environment  
* Astro 6 for the website framework and page structure  
* MDX for combining written exhibit content with interactive components  
* React JSX for building interactive visualizers and simulations  
* CSS Modules for scoped and organized component styling

---

### **1.4 Proposed Interactive Element: RedDev OS Memory Simulator**

The interactive element is a gamified, state-driven React component that simulates a desktop operating system. Rather than clicking through static slides or a basic list, the user acts as the computer operator, guided by an interactive mascot named "RedDev." 

**Phase 1** will simulate the fragmentation trap that happens with physical memory. The user boots into the "RedDev OS" desktop. Guided by RedDev’s speech bubble, the user is instructed to manually open several programs from the desktop (Chrome, Discord, and Valorant). As apps open, the user can check the "Task Manager" window, which displays a proportional, color-coded physical RAM bar alongside real-time metrics (Total Free, Largest Block, and Holes).

To demonstrate external fragmentation, RedDev instructs the user to close Chrome and Valorant, stranding Discord in the center of the RAM bar. The user is then asked to open a massive 4 GB Video Editor. Because the system is restricted to physical memory allocation, the Video Editor triggers an "Out of Memory" crash, as there is no single contiguous 4 GB block available.

**Phase 2** will showcase the solution following the forced crash in Phase 1 by RedDev introducing Virtual Memory. The user toggles a system switch, revealing a dual-bar view in the Task Manager showing physical RAM on top and the program's virtual address space below. When the user attempts to open the Video Editor again, the component visually demonstrates the OS using a page table to map the application's contiguous virtual address space into the scattered physical holes, allowing the program to load successfully.

**Phase 3** unlocks "Sandbox Mode" once the tutorial concludes. The user is given a full queue of programs with fixed memory sizes (Chrome at 2 GB, Discord at 1 GB, Valorant at 3 GB, Spotify at 1 GB, and a Video Editor at 4 GB).
Instead of a pre-determined sequence or a static slideshow, the user has total freedom to click and open/close these programs directly on the desktop in any order they choose. Because the sequence is entirely user-defined, the fragmentation outcome varies dynamically. A user who closes programs cleanly from one end might never see an error, while a user who closes programs haphazardly will strand running apps and create isolated memory holes. This variability is intentional: it encourages visitors to experiment, intentionally cause fragmentation, and then toggle the Virtual Memory switch to watch the page table resolve their unique memory mess in real-time.

The component is built entirely in React. State management is handled via `useState` hooks to track the active programs array, recalculate the largest contiguous block dynamically as apps are opened or closed, and trigger CSS transitions. 

**Mobile-responsive layout:**
* The RAM bar and stats row stack cleanly at narrow widths via CSS `flex-wrap`  
* Program queue cards use `auto-fit` grid columns, collapsing to 2 columns on mobile  
* Navigation buttons are full-touch-target height (minimum 44px) on small screens  
* Caption text reflows naturally — no horizontal scrolling at any viewport
