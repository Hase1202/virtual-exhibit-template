### **CSARCH2 VIRTUAL EXHIBIT**

### **Proposal Write Up Link:** https://docs.google.com/document/d/1ZMVh7Pd56G49Xbd0d0VN0TmAYVSYSMWPeGFJR1NeJHk/edit?tab=t.nmczb89685uj

### **Style Guide Snapshot Link:** https://www.figma.com/design/9UvQtgoi524cgPsaxZOKkg/CSARCH2---Style-guide-snapshot?node-id=1-1043&t=Wy7L57AGLdzWEqIN-1

**Submitted By:**

* Fabregas Matthew Drew  
* Lee Hannah  
* Lim Justin Lance Te  
* Nono Alec Marx Gabriel Belen  
* Yasumuro Mariel Mendoza

### **Background of the Proposed Virtual Exhibit**

In early multitasking systems, the OS carved physical RAM into chunks and handed them to processes as they started. When a process closed, its chunk was freed, but that freed region sat wherever it happened to be in memory, not necessarily adjacent to any other free region. Over time, as programs were started and stopped at different moments, free memory became scattered across small, non-contiguous holes. This is external fragmentation. This means a system can have enough total free memory to satisfy an allocation request, yet be completely unable to fulfill it because no single contiguous block is large enough. A program needing 2.5 GB cannot be split across a 1 GB hole and a 2 GB hole. It must land in one contiguous region.

The classical workaround is compaction, moving all loaded programs to one end of RAM to consolidate the holes into one large block. It works, but it is expensive: the OS must copy potentially gigabytes of data and can cause noticeable freezes in the process. **Virtual memory is the deeper solution.** By introducing a layer of indirection between virtual and physical addresses, the OS frees programs from needing contiguous physical memory entirely. Physical RAM is divided into small fixed-size pages that can be scattered anywhere, while the program sees a clean, continuous address space. The fragmentation problem disappears from the program's perspective.

**This exhibit uses fragmentation as the entry point to that story, letting visitors experience the problem firsthand before arriving at virtual memory as the answer.**

### **Tech Stack Plan**

The project will follow the provided Astro-based museum template to ensure compatibility with the central virtual museum website.

The proposed core stack is as follows:

* Node.js 26 for the required runtime environment  
* Astro 6 for the website framework and page structure  
* MDX for combining written exhibit content with interactive components  
* React JSX for building interactive visualizers and simulations  
* CSS Modules for scoped and organized component styling

### **Interactive element: RedDev OS Memory Simulator**

The interactive element is a gamified, state-driven React component that simulates a desktop operating system. Rather than clicking through static slides or a basic list, the user acts as the computer operator, guided by an interactive mascot named "RedDev." 

Phase 1 will simulate the fragmentation trap that happens with physical memory. The user boots into the "RedDev OS" desktop. Guided by RedDev’s speech bubble, the user is instructed to manually open several programs from the desktop (Chrome, Discord, and Valorant). As apps open, the user can check the "Task Manager" window, which displays a proportional, color-coded physical RAM bar alongside real-time metrics (Total Free, Largest Block, and Holes).

To demonstrate external fragmentation, RedDev instructs the user to close Chrome and Valorant, stranding Discord in the center of the RAM bar. The user is then asked to open a massive 4 GB Video Editor. Because the system is restricted to physical memory allocation, the Video Editor triggers an "Out of Memory" crash, as there is no single contiguous 4 GB block available.
Phase 2 will showcase the solution following the forced crash in Phase 1 by RedDev introducing Virtual Memory. The user toggles a system switch, revealing a dual-bar view in the Task Manager showing physical RAM on top and the program's virtual address space below. When the user attempts to open the Video Editor again, the component visually demonstrates the OS using a page table to map the application's contiguous virtual address space into the scattered physical holes, allowing the program to load successfully.

Once the tutorial concludes, RedDev unlocks "Sandbox Mode" which is Phase 3. The user is given a full queue of programs with fixed memory sizes (Chrome at 2 GB, Discord at 1 GB, Valorant at 3 GB, Spotify at 1 GB, and a Video Editor at 4 GB).
Instead of a pre-determined sequence or a static slideshow, the user has total freedom to click and open/close these programs directly on the desktop in any order they choose. Because the sequence is entirely user-defined, the fragmentation outcome varies dynamically. A user who closes programs cleanly from one end might never see an error, while a user who closes programs haphazardly will strand running apps and create isolated memory holes. This variability is intentional: it encourages visitors to experiment, intentionally cause fragmentation, and then toggle the Virtual Memory switch to watch the page table resolve their unique memory mess in real-time.

The component is built entirely in React. State management is handled via useState hooks to track the active programs array, recalculate the largest contiguous block dynamically as apps are opened or closed, and trigger the CSS transitions. 

**Mobile-responsive layout:**

* The RAM bar and stats row stack cleanly at narrow widths via CSS flex-wrap  
* Program queue cards use `auto-fit` grid columns, collapsing to 2 columns on mobile  
* Navigation buttons are full-touch-target height (minimum 44px) on small screens  
* Caption text reflows naturally — no horizontal scrolling at any viewport
