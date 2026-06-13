# Quantum Cinema — Design Document

> **Live Demo:** [d3ospai7r368nk.cloudfront.net](https://d3ospai7r368nk.cloudfront.net/)  
> **Repo:** `QuantBlockchain/quantum-cinema`  
> **Purpose:** A cinematic browser experience that makes quantum computing visible through generative world models, AWS Braket device metrics, and a guided four-step exploration of trapped-ion, superconducting, and neutral-atom architectures.

---

## 1. Overview

Quantum Cinema is a single-page interactive web application that guides users through a four-step journey to understand quantum computing hardware. Each step progressively deepens the user's understanding — from Nobel Prize history, to world-model visualizations, to video deep-dives, to quantitative hardware comparison.

The experience is built as a **step wizard** with persistent top navigation. Users can move linearly through the steps or jump to any step via the navigation bar. Each step is a full-viewport scene with its own visual identity.

**Tech Stack:** Next.js 15 + React 19 + TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, HTML5 Canvas (particle effects).

---

## 2. Design Principles

| Principle | Application |
|-----------|-------------|
| **Progressive disclosure** | Start with human stories (Nobel laureates), then introduce physics concepts, then technical details |
| **Cinematic immersion** | Full-viewport scenes, animated transitions, particle backgrounds, generative world-model embeds |
| **Learn by comparison** | Side-by-side hardware comparison with radar charts makes trade-offs visceral |
| **No quantum background required** | Plain-language explanations; technical terms always paired with analogies |
| **Accessibility** | WCAG AA contrast, keyboard navigation, reduced-motion support, semantic HTML |

---

## 3. User Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌──────────────┐
│  1. Nobel Prize │ ──► │ 2. World Models  │ ──► │ 3. Explore  │ ──► │  4. Compare  │
│    (Landing)    │     │   (Selection)    │     │(Video Play) │     │ (Side-by-Side)│
└─────────────────┘     └──────────────────┘     └─────────────┘     └──────────────┘
       ▲                                                         │
       └─────────────────────────────────────────────────────────┘
                    (Step indicator persists at top)
```

**Linear flow:** Users primarily advance via CTAs at the bottom of each step.  
**Non-linear flow:** The top step indicator allows jumping to any step at any time.  
**State carry:** Device selection in Step 2 propagates to Steps 3 and 4 (default: Ion Trap).

---

## 4. Step-by-Step Design

### 4.1 Step 1: Nobel Prize (Landing)

**Purpose:** Establish credibility and historical context. Ground the experience in real science before introducing abstract quantum concepts.

**Layout:** Full-viewport dark scene with an animated particle field background.

```
┌─────────────────────────────────────────────────────────────────────┐
│  QUANTUM CINEMA                                                     │
│  [01 Nobel Prize]  [02 World Models]  [03 Explore]  [04 Compare]   │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│  WHERE IT ALL BEGAN                                                 │
│  2025 Nobel Prize in Physics                                        │
│  Awarded for pioneering experiments that demonstrated macroscopic   │
│  quantum tunneling and energy quantization in superconducting       │
│  circuits — the foundation of today's quantum computers.            │
│                                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐              │
│  │ John Clarke │  │Michel Devoret│  │John Martinis  │              │
│  │ UC Berkeley │  │ Yale Univ.   │  │ UC Santa Barb.│              │
│  │ [photo]     │  │ [photo]      │  │ [photo]       │              │
│  │ ~bio text~  │  │ ~bio text~   │  │ ~bio text~    │              │
│  └─────────────┘  └──────────────┘  └───────────────┘              │
│                                                                     │
│  [Bridge paragraph: artificial atoms from superconducting circuits] │
│                                                                     │
│  THE QUANTUM TIMELINE                                               │
│  1900 ──► 1927 ──► 1981 ──► 1994 ──► 2019 ──► 2025               │
│  Planck   Uncert.  Feynman  Shor     Suprem.  Nobel                │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│         SEE THE QUANTUM WORLD THROUGH AI EYES                       │
│              [ EXPLORE QUANTUM WORLDS ▼ ]                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Content blocks:**

| Element | Description |
|---------|-------------|
| **Header** | "WHERE IT ALL BEGAN" label, "2025 Nobel Prize in Physics" heading with highlighted keyword, descriptive paragraph |
| **Laureate Cards** | 3 cards: John Clarke (cyan accent), Michel Devoret (purple accent), John Martinis (amber accent). Each has photo, affiliation, one-line contribution, and 2-3 sentence bio |
| **Bridge Paragraph** | Explains the connection: their work made it possible to engineer artificial atoms from superconducting circuits — the bridge between quantum theory and quantum technology |
| **Timeline** | Horizontal scrollable (on mobile) or static (desktop) timeline: 1900, 1927, 1981, 1994, 2019, 2025. Each node: year + event title + one-line description |
| **CTA** | "EXPLORE QUANTUM WORLDS" — scrolls to Step 2 |

**Visual spec:**
- Background: Animated particle field with amber/cyan glow (colors shift per step)
- Cards: Glassmorphic effect (`backdrop-blur`, semi-transparent bg), hover lift animation
- Timeline: Dotted connector line with gradient nodes

---

### 4.2 Step 2: World Models (Selection)

**Purpose:** Introduce the three quantum architectures through generative world-model previews. Users select one to explore in depth.

**Layout:** Dark scene with generative world embeds and entanglement explainer.

```
┌─────────────────────────────────────────────────────────────────────┐
│  QUANTUM CINEMA                                                     │
│  [01 Nobel Prize]  [02 World Models]  [03 Explore]  [04 Compare]   │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│  GENERATIVE WORLD MODELS                                            │
│  Quantum Worlds Dreamed by AI                                       │
│  [Intro paragraph about entanglement and AI generation]             │
│                                                                     │
│  THE QUANTUM CONNECTION                                             │
│  What is Quantum Entanglement?                                      │
│  [3-column comparison: how each architecture creates entanglement]  │
│                                                                     │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌────────────────┐ │
│  │ Light Suspension    │ │ Frozen Forge        │ │ Wave Garden    │ │
│  │ IonQ Aria           │ │ Rigetti Ankaa-3     │ │ QuEra Aquila   │ │
│  │                     │ │                     │ │                │ │
│  │ [WorldLabs embed]   │ │ [WorldLabs embed]   │ │ [WorldLabs embed]│ │
│  │                     │ │                     │ │                │ │
│  │ coherence  ~1-10s   │ │ coherence  ~20-100µs│ │coherence ~1-10µs│ │
│  │ fidelity   99.5%+   │ │ fidelity   99.0%+   │ │fidelity ~97-99% │ │
│  │ qubits     25       │ │ qubits     84       │ │qubits    256    │ │
│  │                     │ │                     │ │                │ │
│  │ [EXPLORE THIS WORLD]│ │ [EXPLORE THIS WORLD]│ │[EXPLORE WORLD] │ │
│  └─────────────────────┘ └─────────────────────┘ └────────────────┘ │
│                                                                     │
│  SELECT A QUANTUM WORLD ABOVE TO SEE ENTANGLEMENT IN ACTION         │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│  [ BACK ]                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Content blocks:**

| Element | Description |
|---------|-------------|
| **Header** | "GENERATIVE WORLD MODELS" label, "Quantum Worlds Dreamed by AI" heading with "predicted" and "entanglement" highlighted |
| **Entanglement Explainer** | "THE QUANTUM CONNECTION" section. Defines entanglement in plain language, then shows how each of the 3 architectures achieves it differently: IonQ (shared chain motion), Rigetti (local chip couplers), QuEra (spatial Rydberg interactions) |
| **World Cards** | 3 cards with embedded WorldLabs generative world iframes. Each card: world name, device name, architecture type, key metrics (coherence, fidelity, qubits), "EXPLORE THIS WORLD" button |

**World embeds:**
| World | Device | Architecture | Embed URL |
|-------|--------|--------------|-----------|
| Light Suspension | IonQ Aria | Trapped-Ion | `marble.worldlabs.ai/world/7f7dcf51...` |
| Frozen Forge | Rigetti Ankaa-3 | Superconducting | `marble.worldlabs.ai/world/cfbff551...` |
| Wave Garden | QuEra Aquila | Neutral-Atom | `marble.worldlabs.ai/world/4d4ec5be...` |

**Selection behavior:** Clicking "EXPLORE THIS WORLD" sets the selected device and advances to Step 3.

**Visual spec:**
- World cards: purple border/glow (matching step color), hover scale animation
- Embedded worlds: Interactive 3D generative scenes from WorldLabs
- Background: Particle field with cyan/purple glow

---

### 4.3 Step 3: Explore (Video Deep-Dive)

**Purpose:** Provide a cinematic video documentary for each quantum architecture, with detailed entanglement explanations and technical metrics.

**Layout:** Dark scene with a large video player, device selector tabs, and contextual information panels.

```
┌─────────────────────────────────────────────────────────────────────┐
│  QUANTUM CINEMA                                                     │
│  [01 Nobel Prize]  [02 World Models]  [03 Explore]  [04 Compare]   │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│  [▶ Video Player — full width, ~60vh height]                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Ion Trap]  [Superconducting]  [Neutral Atoms]            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════    │
│                                                                     │
│  Light Suspension — IonQ Aria — Trapped-Ion Architecture            │
│                                                                     │
│  [Metrics row]    [Entanglement box]                                │
│  coherence ~1-10s         SHARED CHAIN MOTION                       │
│  fidelity  99.5%+        Ions entangle through collective...        │
│  qubits    25                                                       │
│                                                                     │
│  Ytterbium ions levitated in vacuum and manipulated by lasers...    │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│  [ BACK ]                      [ COMPARE HARDWARE ► ]               │
└─────────────────────────────────────────────────────────────────────┘
```

**Content blocks:**

| Element | Description |
|---------|-------------|
| **Video Player** | Full-width HTML5 `<video>` player. Autoplay muted loop. Sources: `/videos/ion-trap.mp4`, `/videos/superconducting.mp4`, `/videos/neutral-atoms.mp4`. 1080p MP4, ~5-15 seconds, seamless loop |
| **Device Tabs** | Three tabs: "Ion Trap", "Superconducting", "Neutral Atoms". Switching tabs changes the video, metrics, and description |
| **World Title** | Format: `{World Name} — {Device Name} — {Architecture Type}` |
| **Metrics** | Three key-value pairs: coherence time, gate fidelity, qubit count. Values match AWS Braket device calibration data |
| **Entanglement Method** | Badge + headline (e.g., "SHARED CHAIN MOTION") + 2-3 sentence explanation of how this architecture creates entanglement |
| **Description** | One paragraph describing the physical setup (e.g., "Ytterbium ions levitated in vacuum and manipulated by lasers...") |
| **CTAs** | BACK → Step 2; COMPARE HARDWARE → Step 4 |

**Video content by device:**

| Device | Video File | World Name | Key Visual Theme |
|--------|-----------|------------|------------------|
| IonQ Aria | `ion-trap.mp4` | Light Suspension | Glowing ions suspended in laser light, harmonic motion |
| Rigetti Ankaa-3 | `superconducting.mp4` | Frozen Forge | Golden circuitry in frost, rapid energy pulses |
| QuEra Aquila | `neutral-atoms.mp4` | Wave Garden | Optical tweezer arrays, wave interference patterns |

**Visual spec:**
- Background: Particle field with cyan glow
- Video: Rounded corners, subtle border glow matching device accent color
- Tabs: Underline-style active indicator, color-matched to device

---

### 4.4 Step 4: Compare (Side-by-Side)

**Purpose:** Enable quantitative comparison of all three quantum architectures via radar charts, detailed specifications, and use-case matching.

**Layout:** Dark scene with radar chart visualization, device tabs, and comparison tables.

```
┌─────────────────────────────────────────────────────────────────────┐
│  QUANTUM CINEMA                                                     │
│  [01 Nobel Prize]  [02 World Models]  [03 Explore]  [04 Compare]   │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│  QUANTUM HARDWARE COMPARISON                                        │
│  Compare Architectures Across Key Metrics                           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │         [Radar Chart — 6 axes, 3 devices overlaid]         │   │
│  │  Coherence ◄────────────────────────► Scale                │   │
│  │     ▲                                    ▲                 │   │
│  │      ╲    IonQ (purple)                 /                  │   │
│  │       ╲   Rigetti (amber)              /                   │   │
│  │        ╲  QuEra (cyan)                /                    │   │
│  │         ╲                            /                     │   │
│  │  2Q Fidelity ◄──────────────────► Connectivity            │   │
│  │                          Readout ◄────► Error Rate         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [IonQ Aria]  [Rigetti Ankaa-3]  [QuEra Aquila]                    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ SPECIFICATIONS            │ BEST FOR                        │   │
│  │ ──────────────────────────│─────────────────────────────────│   │
│  │ Coherence Time: ~1-10s    │ Drug Discovery                  │   │
│  │ 2-Qubit Fidelity: 99.5%+  │ (High fidelity prevents errors  │   │
│  │ Readout Fidelity: ~99.7%  │  in molecular simulation)       │   │
│  │ Error Rate: ~0.5%         │                                 │   │
│  │ Connectivity: Full        │                                 │   │
│  │ Qubits: 25                │                                 │   │
│  │ Critical Limitation:      │                                 │   │
│  │ Extremely slow gates      │                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════    │
│  MATCHING HARDWARE TO APPLICATIONS                                  │
│                                                                     │
│  ┌────────────────┬──────────────────┬──────────────────────────┐  │
│  │ Application    │ Best Device      │ Why                      │  │
│  ├────────────────┼──────────────────┼──────────────────────────┤  │
│  │ Drug Discovery │ IonQ Aria        │ High fidelity for sim... │  │
│  │ Grid Optim.    │ Rigetti Ankaa-3  │ Fast gates for iterat... │  │
│  │ Carbon Capture │ QuEra Aquila     │ Native analog simula...  │  │
│  └────────────────┴──────────────────┴──────────────────────────┘  │
│                                                                     │
│  ───────────────────────────────────────────────────────────────    │
│  [ BACK ]                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Content blocks:**

| Element | Description |
|---------|-------------|
| **Header** | "QUANTUM HARDWARE COMPARISON" label, "Compare Architectures Across Key Metrics" heading |
| **Radar Chart** | Canvas/SVG-based 6-axis radar chart. Axes: Coherence, 2Q Fidelity, Readout, Error Rate (inverted), Connectivity, Scale. All three devices overlaid with their accent colors. Normalized 0-100 scale |
| **Device Tabs** | Three tabs to select which device's detailed specs to display |
| **Specifications Panel** | Key-value table: Coherence Time, 2-Qubit Fidelity, Readout Fidelity, Error Rate, Connectivity, Qubit Count, Critical Limitation |
| **Best For Panel** | Application domain (Drug Discovery, Grid Optimization, Carbon Capture) with explanation |
| **Applications Table** | 3-row table: Application → Best Device → Rationale. Shows which hardware matches which real-world use case |
| **CTA** | BACK → Step 3 |

**Radar chart axes (normalized 0-100):**

| Axis | IonQ Aria | Rigetti Ankaa-3 | QuEra Aquila |
|------|-----------|-----------------|--------------|
| Coherence | 95 | 25 | 15 |
| 2Q Fidelity | 90 | 80 | 65 |
| Readout | 95 | 70 | 50 |
| Error Rate (inverted) | 85 | 70 | 55 |
| Connectivity | 95 | 30 | 60 |
| Scale | 12 | 45 | 80 |

**Visual spec:**
- Background: Particle field with amber glow
- Radar chart: Semi-transparent filled regions, device-colored strokes
- Cards: Glassmorphic, hover states on table rows

---

## 5. Global UI Elements

### 5.1 Step Indicator (Persistent Navigation)

```
┌─────────────────────────────────────────────────────────────────┐
│  QUANTUM CINEMA                                                  │
│  [01 Nobel Prize]  [02 World Models]  [03 Explore]  [04 Compare] │
│  1 / 4                                        [◄] [►]           │
└─────────────────────────────────────────────────────────────────┘
```

- **Position:** Fixed top, full width, z-index above all content
- **Layout:** Brand name left, 4 numbered step buttons center, page indicator right
- **Active state:** Current step button highlighted with accent color underline
- **Interaction:** Click any step button to jump directly to that step. Smooth scroll to top on step change.
- **Step counter:** Shows "N / 4" with prev/next arrow buttons

### 5.2 Particle Field Background

- **Technology:** HTML5 Canvas with animated particles
- **Behavior:** Particles drift slowly, connect with lines when near each other, pulse gently
- **Color:** Shifts per step (amber → purple → cyan → amber)
- **Count:** ~30 particles (performance-optimized)
- **Reduced motion:** Static particles with no animation when `prefers-reduced-motion` is set

### 5.3 Theme System

- **Default:** Dark mode (deep navy/black background)
- **Toggle:** Light/dark switch in the top-right corner
- **Colors:** CSS custom properties for all theme values; Tailwind `dark:` variants throughout

---

## 6. Visual System

### 6.1 Color Palette

```
Background:    #000000 (pure black) or #0a0a0f (deep navy)
Surface:       rgba(255,255,255,0.03) — glassmorphic card bg
Border:        rgba(255,255,255,0.08) — card borders
Text Primary:  #ffffff
Text Secondary: rgba(255,255,255,0.6)
Accent Amber:  #f59e0b — Nobel Prize / Compare step
Accent Purple: #a855f7 — World Models step
Accent Cyan:   #00f0ff — Explore step
```

**Device accent colors (consistent across all steps):**
| Device | Color | RGB | Usage |
|--------|-------|-----|-------|
| IonQ Aria | Purple | `168, 85, 247` | Cards, borders, glows, radar fill |
| Rigetti Ankaa-3 | Amber | `245, 158, 11` | Cards, borders, glows, radar fill |
| QuEra Aquila | Cyan | `0, 240, 255` | Cards, borders, glows, radar fill |

### 6.2 Typography

- **Heading font:** System sans-serif (Geist via Next.js font optimization)
- **H1:** 48px / font-weight 300 / letter-spacing -0.02em
- **H2:** 32px / font-weight 400 / letter-spacing -0.01em
- **H3:** 24px / font-weight 500
- **Body:** 16px / font-weight 400 / line-height 1.6
- **Caption/Label:** 12px / font-weight 500 / uppercase / letter-spacing 0.08em
- **Monospace (metrics):** `font-mono` for coherence times, fidelity percentages, qubit counts

### 6.3 Spacing & Layout

- **Container:** max-width 1200px, centered, px-4 on mobile, px-8 on desktop
- **Section padding:** py-24 (96px) between major content blocks
- **Card padding:** p-6 (24px)
- **Card border-radius:** rounded-2xl (16px)
- **Card border:** 1px solid `rgba(255,255,255,0.08)`
- **Grid:** 3-column on desktop (`grid-cols-3`), 1-column on mobile

### 6.4 Animation Specs

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Step transition (enter) | 0.4s | `cubic-bezier(0.16, 1, 0.3, 1)` | Step change (AnimatePresence) |
| Step transition (exit) | 0.2s | `ease-in` | Step change |
| Card hover lift | 0.3s | `ease-out` | Mouse enter |
| Particle drift | continuous | linear | Always (canvas loop) |
| Tab underline | 0.2s | `ease-out` | Tab switch |
| Button press | 0.1s | `ease-out` | Click/tap |
| Scroll fade-in | 0.5s | `ease-out` | IntersectionObserver |

---

## 7. Component Architecture

```
app/
├── page.tsx              # Main orchestrator: step state, device state, layout
├── layout.tsx            # Root layout: fonts, metadata, theme provider
├── globals.css           # Tailwind imports, CSS custom properties, animations
└── favicon.ico

components/
├── ParticleField.tsx      # Canvas particle background (step-colored, count prop)
├── RadarChart.tsx         # SVG radar chart for comparison (6 axes, multi-series)
├── StepIndicator.tsx      # Top navigation bar (currentStep, onStepClick)
├── ThemeProvider.tsx      # Dark/light context provider
├── ThemeToggle.tsx        # Theme switch button
├── steps/
│   ├── NobelPrizeStep.tsx      # Step 0: laureates, timeline, CTA
│   ├── WorldModelStep.tsx      # Step 1: world selection, entanglement explainer
│   ├── VideoShowcaseStep.tsx   # Step 2: video player, device tabs, metrics
│   └── ComparisonStep.tsx      # Step 3: radar chart, specs, applications table
└── ui/                    # shadcn/ui components (Button, Card, Badge, Tabs, etc.)
```

**State management (React useState in page.tsx):**
```typescript
const [currentStep, setCurrentStep] = useState(0);        // 0-3
const [selectedDevice, setSelectedDevice] = useState<DeviceId>("ion-trap");
// DeviceId = "ion-trap" | "superconducting" | "neutral-atoms"
```

**Step → Component mapping:**
| Step Index | Step Name | Component |
|------------|-----------|-----------|
| 0 | Nobel Prize | `NobelPrizeStep` |
| 1 | World Models | `WorldModelStep` |
| 2 | Explore | `VideoShowcaseStep` |
| 3 | Compare | `ComparisonStep` |

---

## 8. Data Model

### 8.1 Device Configuration

```typescript
type DeviceId = "ion-trap" | "superconducting" | "neutral-atoms";

interface DeviceConfig {
  name: string;              // e.g., "IonQ Aria"
  worldName: string;         // e.g., "Light Suspension"
  url: string;               // WorldLabs embed URL
  color: string;             // Hex accent color
  rgb: string;               // RGB values for CSS
  videoSrc: string;          // e.g., "/videos/ion-trap.mp4"
  subtitle: string;          // e.g., "Trapped-Ion Architecture"
  description: string;       // 1-2 sentence physical setup
  metrics: {
    coherence: string;       // e.g., "~1-10 s"
    fidelity: string;        // e.g., "99.5%+"
    qubits: string;          // e.g., "25"
  };
  entanglement: {
    method: string;          // e.g., "Shared Chain Motion"
    summary: string;         // 2-3 sentence explanation
  };
  radarScores: {
    coherence: number;       // 0-100 normalized
    twoQFidelity: number;
    readout: number;
    errorRate: number;       // inverted (higher = lower error)
    connectivity: number;
    scale: number;
  };
  details: {
    coherenceTime: string;
    twoQubitFidelity: string;
    readoutFidelity: string;
    errorRate: string;
    connectivity: string;
    qubits: string;
  };
  limitation: string;        // One-line critical limitation
  bestFor: string;           // Application domain
  bestForDetail: string;     // Why this device fits
}
```

### 8.2 Step Content Configuration

All step content is defined as **static data constants** at the top of each step component file. No CMS or API calls are required at runtime. All content is bundled at build time.

---

## 9. Asset Inventory

### 9.1 Videos

| File | Device | Format | Notes |
|------|--------|--------|-------|
| `/videos/ion-trap.mp4` | IonQ Aria | MP4, H.264, 1080p | ~5-15s, seamless loop |
| `/videos/superconducting.mp4` | Rigetti Ankaa-3 | MP4, H.264, 1080p | ~5-15s, seamless loop |
| `/videos/neutral-atoms.mp4` | QuEra Aquila | MP4, H.264, 1080p | ~5-15s, seamless loop |

### 9.2 Images

| File | Usage | Format |
|------|-------|--------|
| `/laureates/clarke.jpg` | John Clarke portrait | JPG |
| `/laureates/devoret.webp` | Michel Devoret portrait | WebP |
| `/laureates/martinis.jpg` | John Martinis portrait | JPG |

### 9.3 World Embeds

Three interactive 3D generative world scenes embedded via `<iframe>` from WorldLabs Marble platform. These are the primary visual content for the World Models step.

---

## 10. Interaction Design

### 10.1 Step Navigation

| Action | Behavior |
|--------|----------|
| Click step indicator button | Jump to that step (smooth scroll to top) |
| Click "EXPLORE QUANTUM WORLDS" | Advance to Step 1 |
| Click "EXPLORE THIS WORLD" | Set selected device, advance to Step 2 |
| Click "BACK" | Return to previous step |
| Click "COMPARE HARDWARE" | Advance to Step 3 |
| Prev/Next arrows in step indicator | Increment/decrement step |

### 10.2 Device Selection Flow

```
Step 1 (World Models) → select device → Step 2 (Explore) shows selected device
                                              ↓
Step 3 (Compare) → can switch device via tabs ←┘
```

The selected device from Step 1 becomes the default active tab in Steps 2 and 3.

### 10.3 Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Desktop (≥1024px) | 3-column card grids, side-by-side comparison panels, full radar chart |
| Tablet (768-1023px) | 2-column where appropriate, stacked comparison panels |
| Mobile (<768px) | Single column, scrollable timeline, stacked tabs, reduced particle count |

---

## 11. Accessibility Requirements

- **Keyboard navigation:** All interactive elements focusable, Tab order follows visual flow
- **Screen readers:** Semantic headings (`<h1>`-`<h3>`), ARIA labels on tabs and buttons, `aria-current` for active step
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables particle animation and entrance transitions
- **Color contrast:** All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- **Video:** Videos are decorative (no audio track required); `aria-hidden` on canvas particle layer

---

## 12. Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Total JS bundle (gzipped) | < 200KB |
| Video preload | `preload="metadata"` on page load; full preload on step 2 enter |
| Particle field | 30 particles max; 60fps on mid-range devices |

---

*This document describes the shipped implementation as of June 2026. For architecture and infrastructure details (AWS CDK, Docker, CI/CD), see `README.md` and `SUPPLEMENTARY.md` in the repository root.*
