### **CSARCH2 VIRTUAL EXHIBIT**

**Submitted By:**

* Fabregas Matthew Drew  
* Lee Hannah  
* Lim Justin Lance Te  
* Nono Alec Marx Gabriel Belen  
* Yasumuro Mariel Mendoza

### **DEPLOYED SITE:** https://hase1202.github.io/virtual-exhibit-template/?fbclid=IwY2xjawS51_NleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEeRWW4ZKnuZ9oDu7o43sgbREaTRyrwppVkuey8OBcZkgQL1vK6sB4W7cmFr1E_aem_7PKhIVTHdtHrlPpERcP_jA

```text
src/
├── components/
│   ├── MemoryFragmentationSimulator.jsx        <- Canvas-based allocator (Paging vs. Seg.)
│   ├── MemoryFragmentationSimulator.module.css  <- Scoped styling for simulator grid
│   ├── TlbSimulator.jsx                        <- Step-by-step Page Table + TLB lookup flow
│   ├── VirtualMemoryQuiz.jsx                   <- Interactive feedback quiz component
│   ├── ConceptCard.astro                       <- Card template for key terms/hardware specs
│   └── TakeawayCard.astro                      <- Structured key findings template
├── pages/
│   └── virtual-memory.mdx                      <- Root MDX page assembling the full exhibit
└── styles/
    └── exhibit-theme.css                       <- "Memory Lab" dark futuristic theme stylesheet
```

### **Development**

We decided our aesthetic should be a space theme with tones of blue and purple, as these colors commonly signify technology. Although this was only a mid-milestone project, we were able to implement the foundational requirements of our site. It was quite a challenge trying to work around the provided templates and adhering to the strict guidelines, such as not modifying files inside the layouts folder or changing global.css.

We followed our proposed layout by starting with the "Virtual Memory" title and an abstract, followed by key concepts to quickly introduce interesting facts. We intentionally introduce the interactive lab early on, as it is much more entertaining for users to play around with a visual simulation, which entices them to learn more about virtual RAM. The subsequent section provides detailed descriptions for users who want to dive deeper. Next, we feature another virtual simulation that demonstrates how a virtual address page lookup is traced through the TLB cache and page tables, utilizing cool loading animations to visualize the process. Lastly, we included a summary and a quiz to help the user determine which page replacement algorithm suits them best.

### **Challenges**

Aside from the challenges we faced integrating the exhibit format, we also struggled with learning React and Astro on the fly. We learned that React has the capability to store data (state) and is ideal for creating engaging UIs, whereas Astro does not store data in the same way, but acts more like "HTML+" with greater flexibility for building static designs.

We quickly learned that organization is critical, employing a "divide and conquer" folder structure. The styles folder assists the pages folder (which contains our main MDX/HTML files). Because the layouts folder cannot be modified, and the assets folder is strictly for images, we utilized the components folder for our "sections." This is where we safely modified our React and Astro components, as it is much safer to scope the layout and styling to a single section rather than cramming everything into a global CSS file. It was quite confusing to relearn JavaScript for React and Astro, but because we were already familiar with HTML from CCAPDEV, we have a good head start. It will just take some time to fully grasp these new capabilities since we have only just started.

### Aha Moments
**Global stylesheet isolation with CSS `:has()`**
We ran into an issue where importing the customized dark-mode futuristic theme (`exhibit-theme.css`) inside the `virtual-memory.mdx` page was leaking styles globally—nuking the home page's light cube background pattern and breaking the layout structure when navigating back. Because we weren't allowed to edit the locked `ExhibitLayout.astro` or `HomepageLayout.astro` files directly, the "aha" moment was wrapping all our global overrides in a `:has()` selector (e.g., `body:has(.ml-hero)`). This cleanly scopes all dark backgrounds, custom starfields, and header restyling to the virtual memory page only, leaving the home page intact.

### Creative Development
**Interactive Visual Allocation instead of static diagrams**
Rather than just writing about paging and segmentation, the `MemoryFragmentationSimulator` uses an interactive grid that dynamically animates memory requests. Users can choose between contiguous memory, pure paging, or segmentation, and manually trigger allocation calls to watch external/internal fragmentation develop in real-time.

### **Future Plans**

Although we weren’t able to fully implement everything in our proposal—such as creating a separate page for a full-blown, step-by-step tutorial—we have built a great foundation. We believe that if we have more time to learn React and Astro, we can create a gamified tutorial. However, even if that isn't possible due to time constraints, we can still improve our current mid-milestone submission by adding a few more visual interactions related to virtual memory, such as its relationship to the GPU.

### **AI Disclaimer**

Generative AI tools (including Claude Code) were used throughout this project to accelerate work that would otherwise have taken significantly longer to complete manually, including:

* Scaffolding and writing frontend code for the RedDev OS Memory Simulator, such as React state logic, CSS Modules styling, and responsive layout handling  
* Assisting with UI/UX design decisions, including layout structure, visual styling, and component composition  
* Drafting and refining written content, such as exhibit copy and this README

All AI-assisted output was reviewed, tested, and edited by the team before inclusion in the final exhibit. The team remains responsible for the accuracy, functionality, and quality of the submitted work.

### **Proposal Write Up Link:** https://docs.google.com/document/d/1ZMVh7Pd56G49Xbd0d0VN0TmAYVSYSMWPeGFJR1NeJHk/edit?tab=t.nmczb89685uj

### **Style Guide Snapshot Link:** https://www.figma.com/design/9UvQtgoi524cgPsaxZOKkg/CSARCH2---Style-guide-snapshot?node-id=1-1043&t=Wy7L57AGLdzWEqIN-1


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

### **CSARCH2 VIRTUAL EXHIBIT MID MILESTONE**
### **Development**
Starting to bring the proposal’s vision to life, the group was able to begin with the foundational requirements of the exhibit.  We followed our proposed layout by starting with the "Virtual Memory" title and an abstract, followed by key concepts to quickly introduce interesting facts. We intentionally introduced the interactive lab early on, as it is much more entertaining for users to play around with a visual simulation, which entices them to learn more about virtual RAM. The subsequent section provides detailed descriptions for users who want to dive deeper. Next, we feature another virtual simulation that demonstrates how a virtual address page lookup is traced through the TLB cache and page tables, utilizing cool loading animations to visualize the process. Lastly, we included a summary and a quiz to help the user determine which page 

### **Challenges and Learnings**
Some of us struggled to learn React and Astro on the fly. We learned that React has the capability to store data (state) and is ideal for creating engaging UIs, whereas Astro does not store data in the same way, but acts more like "HTML+" with greater flexibility for building static designs.
We quickly learned that organization is critical, employing a "divide and conquer" folder structure. The styles folder assists the pages folder (which contains our main MDX/HTML files). Because the layouts folder cannot be modified, and the assets folder is strictly for images, we utilized the components folder for our "sections". This is where we safely modified our React and Astro components, as it is much safer to scope the layout and styling to a single section rather than cramming everything into a global CSS file. It was quite confusing to relearn JavaScript for React and Astro, but because we were already familiar with HTML from CCAPDEV, we have a good head start. It will just take some time to fully grasp these new capabilities since we have only just started.

### **Future Plans**
Although we weren’t able to fully implement everything in our proposal, such as creating a separate page for a full-blown, step-by-step tutorial, we have built a great foundation. We believe that if we have more time to learn React and Astro, we can create a gamified tutorial. However, even if that isn't possible due to time constraints, we can still improve our current mid-milestone submission by adding a few more visual interactions related to virtual memory, such as its relationship to the GPU.
