# System Architecture

## Overview

Quantum Cinema is a single-page **Next.js 16 / React 19** application that turns invisible quantum hardware into a browsable, four-act cinematic experience. It is deployed to AWS as a containerized service behind a global CDN, with the immersive 3D worlds streamed in from **World Labs** ([marble.worldlabs.ai](https://marble.worldlabs.ai)). There is no database and no live quantum hardware in the request path — the "quantum" is pre-rendered as generative worlds and curated real-device data.

## System-Level Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│  👤 VIEWER                                                            │
│  Browser → CloudFront  (CDN · TLS · HSTS · security headers)         │
│              │  caches  _next/static/*  and  videos/*                 │
│              │  injects X-CloudFront-Secret header on every origin hit │
└──────────────┬─────────────────────────────────────────────────────────┘
               │  HTTPS → HTTP (origin)
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  🛡️ APPLICATION LOAD BALANCER  (public subnets)                       │
│      Default action: 403 Forbidden                                     │
│      Forward ONLY if  X-CloudFront-Secret  header matches  ───────┐   │
│      Ingress locked to the CloudFront managed prefix list         │   │
└──────────────────────────────────────────────────────────────────┼─────┘
                                                                    │ :3000
                                                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│  🎬 ECS FARGATE  (private subnets · no public IP)                     │
│      Next.js 16 standalone container · Node 20 Alpine · non-root      │
│      Auto-scales 1 → 4 tasks at 70% CPU · circuit-breaker rollback    │
│                                                                       │
│      NobelPrizeStep · VideoShowcaseStep · WorldModelStep · Comparison │
└──────────────┬─────────────────────────────────────────────────────────┘
               │  opens scene in a new tab (window.open)
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  🌌 WORLD LABS  (marble.worldlabs.ai)                                 │
│      Generative 3D "worlds" — one per quantum architecture            │
└──────────────────────────────────────────────────────────────────────┘

   📼 Static assets baked into the image:  /videos/*.mp4 · /laureates/*
```

## Data Flow

### Request Flow

```
1. Viewer requests https://<distribution>.cloudfront.net
        │
        ▼
2. CloudFront
   ├── Terminates TLS, redirects HTTP → HTTPS
   ├── Serves cached _next/static/* and videos/* when warm
   ├── Adds security response headers (HSTS, nosniff, frame, referrer, XSS)
   └── Injects X-CloudFront-Secret on the origin request
        │
        ▼
3. Application Load Balancer (HTTP :80)
   ├── Default action → 403 Forbidden
   └── Rule (priority 1): forward to the target group ONLY when
       X-CloudFront-Secret matches the synth-time secret value
        │
        ▼
4. ECS Fargate task (:3000, private subnet)
   └── Next.js standalone server renders the four-act SPA
        │
        ▼
5. Browser runs the client-side state machine (page.tsx)
   └── Act 3 opens the selected device's World Labs scene in a new tab
```

### Four-Act State Machine

The entire experience is driven client-side by `quantum-cinema/src/app/page.tsx`, which holds two pieces of state: `currentStep` (0–3) and `selectedDevice`.

```
┌─ ACT 0 ─ NobelPrizeStep ───────────────────────────────────────────┐
│  Laureates (Clarke · Devoret · Martinis) + 1900→2025 timeline       │
│  onNext ─────────────────────────────────────────────────────────┐ │
└───────────────────────────────────────────────────────────────────┼─┘
                                                                     ▼
┌─ ACT 1 ─ VideoShowcaseStep ────────────────────────────────────────┐
│  Three AI-dreamed clips + entanglement explainer                    │
│  onSelectDevice(deviceId) → sets selectedDevice, advances ────────┐ │
│  onBack ◀─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┼─┘
                                                                     ▼
┌─ ACT 2 ─ WorldModelStep(deviceId) ─────────────────────────────────┐
│  Opens World Labs scene in a new tab + entanglement breakdown       │
│  onNext ─┐    onBack ◀── (try another device)                       │
└──────────┼──────────────────────────────────────────────────────────┘
           ▼
┌─ ACT 3 ─ ComparisonStep ───────────────────────────────────────────┐
│  Radar chart (Performance / Environmental Impact) + metric bars     │
│  onBack ◀── back to explore                                          │
└──────────────────────────────────────────────────────────────────────┘

   🧭 StepIndicator (fixed top nav) lets the viewer jump to any
      completed/active act via onStepClick(step).
```

## Component Map

| Component | File | Role |
|-----------|------|------|
| `Home` | `src/app/page.tsx` | Four-act state machine; owns `currentStep` + `selectedDevice` |
| `RootLayout` | `src/app/layout.tsx` | Fonts (Inter · Space Grotesk · JetBrains Mono), ThemeProvider, no-flash theme script |
| `StepIndicator` | `src/components/StepIndicator.tsx` | Fixed top nav: act progress + theme toggle |
| `ParticleField` | `src/components/ParticleField.tsx` | Animated per-step particle backdrop (accent color per act) |
| `RadarChart` | `src/components/RadarChart.tsx` | Six-axis device comparison chart |
| `ThemeProvider` / `ThemeToggle` | `src/components/Theme*.tsx` | Theme context + localStorage persistence (`quantum-cinema-theme`) |
| `NobelPrizeStep` | `src/components/steps/NobelPrizeStep.tsx` | Act 1 — laureates + timeline |
| `VideoShowcaseStep` | `src/components/steps/VideoShowcaseStep.tsx` | Act 2 — video clips + device selection |
| `WorldModelStep` | `src/components/steps/WorldModelStep.tsx` | Act 3 — World Labs scene + entanglement breakdown |
| `ComparisonStep` | `src/components/steps/ComparisonStep.tsx` | Act 4 — radar + metric tables |
| `ui/*` | `src/components/ui/` | shadcn-style primitives (card, tabs, badge, button, separator, tooltip) |

## Interface Specifications

Quantum Cinema has **no REST API**. Its contracts are React props and one external embed.

### Step Props Contract

| Step | Props received |
|------|----------------|
| `NobelPrizeStep` | `onNext()` |
| `VideoShowcaseStep` | `onNext()`, `onBack()`, `onSelectDevice(deviceId)` |
| `WorldModelStep` | `deviceId`, `onNext()`, `onBack()` |
| `ComparisonStep` | `onBack()` |

`DeviceId = "ion-trap" | "superconducting" | "neutral-atoms"` — the three architectures.

### World Labs Embed Contract

`WorldModelStep.tsx` → `DEVICE_CONFIGS` maps each `DeviceId` to a hardcoded scene URL opened via `window.open(url, "_blank", "noopener,noreferrer")`:

| DeviceId | Device | World | Scene |
|----------|--------|-------|-------|
| `ion-trap` | IonQ Aria | Light Suspension | `marble.worldlabs.ai/world/7f7dcf51-…` |
| `superconducting` | Rigetti Ankaa-3 | Frozen Forge | `marble.worldlabs.ai/world/cfbff551-…` |
| `neutral-atoms` | QuEra Aquila | Wave Garden | `marble.worldlabs.ai/world/510dff36-…` |

## Input/Output Definitions

### Device Catalog (`src/lib/data.ts`)

```ts
interface QuantumDevice {
  id: string;            // ionq | rigetti | quera
  name: string;          // e.g. "Rigetti Ankaa-3"
  subtitle: string;      // e.g. "Frozen Forge"
  technology: string;
  provider: string;      // AWS | IonQ | Rigetti | QuEra
  color: string;         // accent hex
  colorRgb: string;
  worldName: string;
  worldDescription: string;
  metrics: {
    coherenceTime: string;
    gateFidelity: string;
    connectivity: string;
    errorRate: string;
    energyCost: string;
    qubits: string;
  };
  limitation: string;
  bestFor: string;
  bestForDetail: string;
  visualStyle: string;
  documentaryNarrative: string[];  // three-beat arc
}
```

### Radar Series Derivation (`ComparisonStep.tsx`)

Each selected device contributes a normalized 0–100 series. The active tab selects which dataset feeds the radar and bar breakdown:

- **Performance** → `scores` (`Coherence`, `Gate Fidelity`, `Connectivity`, `Error Rate`, `Energy Eff.`, `Qubits`)
- **Environmental Impact** → `envImpact` (`Carbon Footprint`, `Energy Usage`, `Cooling Req.`, `Material Use`, `E-Waste`, `Water Usage`)

`Error Rate` is inverted (lower error → higher score) so that "outward = better" holds across all performance axes.

## Security Model

| Layer | Mechanism |
|-------|-----------|
| **Edge** | CloudFront enforces HTTPS, HSTS (1 yr, includeSubdomains), and a security-headers response policy |
| **Origin gate** | ALB forwards only requests carrying the correct `X-CloudFront-Secret` header; all else → `403` |
| **Network** | ALB ingress restricted to the CloudFront managed prefix list; ECS tasks in private subnets, no public IP, egress via NAT |
| **Headers** | `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, Referrer-Policy, XSS protection (CloudFront) + `Permissions-Policy` (Next.js) |
| **Transport** | TLS everywhere; ALB drops invalid header fields |
| **Container** | Runs as non-root `nextjs` user from a minimal multi-stage Node 20 Alpine image |
| **Logs** | CloudFront access logs to a private, encrypted, SSL-enforced S3 bucket (90-day lifecycle) |

## AWS Infrastructure at a Glance

| Service | Role |
|---------|------|
| **ECS Fargate** | Next.js container (512 CPU / 1024 MiB, 1–4 tasks, auto-scales at 70% CPU, circuit-breaker rollback) |
| **Application Load Balancer** | Secret-header validation; returns `403` on direct access; health-checks `/` |
| **CloudFront** | CDN, TLS, security headers, separate cache policies for dynamic vs. `_next/static/*` and `videos/*`; HTTP/2+3; PriceClass 100 |
| **VPC + NAT Gateway** | 2 AZs; public subnets for the ALB, private subnets for ECS; one NAT for outbound pulls |
| **S3** | CloudFront access-log bucket (encrypted, SSL-enforced, 90-day lifecycle) |
| **CloudWatch Logs** | `/ecs/quantum-cinema`, 2-week retention |
| **ECR** | Container image asset built from `quantum-cinema/Dockerfile` |

### Stack Outputs

| Output | Meaning |
|--------|---------|
| `CloudFrontURL` | 🎬 The public URL — open this to experience Quantum Cinema |
| `ALBDnsName` | Load balancer DNS (direct access intentionally blocked → `403`) |
| `CloudFrontDistributionId` | Distribution ID for cache invalidation |

The stack is defined in [`lib/qc-worldlabs-stack.ts`](../../lib/qc-worldlabs-stack.ts) and instantiated as `QcWorldlabsStack` by [`bin/app.ts`](../../bin/app.ts).
