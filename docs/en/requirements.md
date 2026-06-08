# Quantum Cinema — Requirements

## 1. Project Overview

### 1.1 Background

Quantum computers promise to reshape medicine, climate science, and cryptography — yet they remain locked behind layers of abstraction: hidden in dilution refrigerators, understood only by physicists, and visually indistinguishable from sculpture. The **2025 Nobel Prize in Physics** — awarded to John Clarke, Michel Devoret, and John Martinis for demonstrating macroscopic quantum tunnelling in superconducting circuits — made this *imagination gap* urgent: the hardware foundation of modern quantum computing was just honoured at the highest level, and almost nobody outside the field can picture what it does.

**Quantum Cinema** is a browser-only, four-act cinematic experience that uses **generative world models** (AI-dreamed 3D scenes) plus **real AWS Braket device data** to make three invisible forces — decoherence, laser cooling, and energy loss — observable as visual narrative. No headset, no PhD, no live quantum hardware required.

> The full research rationale lives in [`design/design.md`](../../design/design.md) (submitted toward ACM Multimedia 2026).

### 1.2 Goals

- Present quantum computing as a guided **Choose → Watch → Explore → Compare** flow
- Reimagine four real quantum architectures as named, explorable generative worlds
- Surface curated, real-device metrics (coherence, fidelity, connectivity, error rate, qubit count) in an interactive comparison
- Deploy on AWS using **CDK** for infrastructure-as-code
- Ship a secure, static-by-design site with no database, no user accounts, and no live hardware in the request path

## 2. System Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Browser    │────▶│  CloudFront  │────▶│      ALB        │
│  (viewer)   │     │ CDN·TLS·HSTS │     │ secret-header   │
└─────────────┘     └──────────────┘     │   gate (403)    │
                          │              └────────┬────────┘
            caches  _next/static/*                │ :3000
                    videos/*                       ▼
                                          ┌─────────────────┐
                                          │  ECS Fargate    │
                                          │  Next.js 16 SPA │
                                          │  (private subnet)│
                                          └────────┬────────┘
                                                   │ iframe / new tab
                                                   ▼
                                          ┌─────────────────┐
                                          │   World Labs    │
                                          │ generative 3D   │
                                          │     worlds      │
                                          └─────────────────┘
```

There is **no database, no Telegram, no Braket call, and no authentication** in the request path. The "quantum" is pre-rendered as generative worlds and curated real-device data baked into the app.

## 3. Functional Requirements

### 3.1 Four-Act Flow

- **FR-01**: Present the experience as a four-act state machine — Act 1 *Nobel Prize* → Act 2 *World Models* → Act 3 *Explore* → Act 4 *Compare*
- **FR-02**: Animate transitions between acts (fade in/out via Framer Motion)
- **FR-03**: Provide a persistent step indicator that lets the viewer jump back to any completed act
- **FR-04**: Scroll to the top of the page on each act transition

### 3.2 Act 1 — Nobel Prize

- **FR-05**: Show the three 2025 laureates (Clarke · Devoret · Martinis) with portrait, affiliation, contribution, and bio
- **FR-06**: Render a 125-year quantum timeline (1900 Planck → 1927 Uncertainty → 1981 Feynman → 1994 Shor → 2019 Supremacy → 2025 Nobel)

### 3.3 Act 2 — World Models / Video Showcase

- **FR-07**: Play three AI-dreamed documentary clips (trapped-ion, superconducting, neutral-atom) from `/videos/*.mp4`, autoplay/loop/muted
- **FR-08**: Explain quantum entanglement and how each architecture creates it differently
- **FR-09**: Let the viewer select a device, which advances to Act 3 carrying the selection

### 3.4 Act 3 — World Model / Explore

- **FR-10**: For the selected device, open its **World Labs** generative 3D scene in a new tab
- **FR-11**: Provide a guided entanglement breakdown for that device: core idea, a visual-element → meaning map, a detailed explanation, and a beginner analogy
- **FR-12**: Show the device's real-world "best for" application

### 3.5 Act 4 — Comparison

- **FR-13**: Render a six-axis radar chart comparing the selected devices
- **FR-14**: Toggle between **Performance** and **Environmental Impact** views
- **FR-15**: Let the viewer add/remove devices from the comparison (minimum one)
- **FR-16**: Show a per-metric bar breakdown and an "application → best device" matching grid

### 3.6 Presentation

- **FR-17**: Provide a dark/light theme toggle, dark by default, persisted across visits with no flash of the wrong theme
- **FR-18**: Render an animated particle field whose accent color shifts per act
- **FR-19**: Be responsive across mobile and desktop

## 4. Non-functional Requirements

### 4.1 Security

- **NFR-01**: CloudFront enforces HTTPS (viewer protocol policy `REDIRECT_TO_HTTPS`)
- **NFR-02**: CloudFront injects a secret `X-CloudFront-Secret` header; the ALB returns `403` to any request lacking the matching value (blocks direct ALB access)
- **NFR-03**: The ALB security group only accepts traffic from the AWS-managed CloudFront origin-facing prefix list
- **NFR-04**: ECS tasks run in private subnets with no public IP; egress is via NAT only
- **NFR-05**: CloudFront emits security response headers — HSTS (1 year, includeSubdomains), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, Referrer-Policy, XSS protection. Next.js additionally sets `Permissions-Policy`
- **NFR-06**: The ALB drops invalid header fields
- **NFR-07**: The container runs as a non-root `nextjs` user from a minimal multi-stage image
- **NFR-08**: CloudFront access logs are written to a private, encrypted, SSL-enforced S3 bucket (90-day lifecycle)

### 4.2 Performance

- **NFR-09**: CloudFront caches `_next/static/*` and `videos/*` with a long-TTL static cache policy (Gzip + Brotli); dynamic content uses `CachingDisabled`
- **NFR-10**: ECS auto-scales from 1 to 4 tasks at 70% CPU
- **NFR-11**: CloudFront serves over HTTP/2 and HTTP/3

### 4.3 Availability

- **NFR-12**: CloudFront global distribution (PriceClass 100) for low-latency access
- **NFR-13**: The ECS service uses a deployment circuit breaker with automatic rollback
- **NFR-14**: ALB target-group health checks probe `/` (healthy on `200,304`)

## 5. Data Model

Quantum Cinema has **no database**. All content is static and lives in the application source.

### 5.1 Device Catalog — `quantum-cinema/src/lib/data.ts`

The `QuantumDevice[]` array holds the three architectures (`ionq`, `rigetti`, `quera`), each with display metadata, six metrics, a limitation, a "best for" application, a visual style, and a three-beat documentary narrative. A separate `MetricInfo[]` array explains the five comparison metrics in plain language.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `ionq` / `rigetti` / `quera` |
| `name`, `subtitle`, `worldName` | string | Display labels (e.g. `Rigetti Ankaa-3` / `Frozen Forge`) |
| `metrics` | object | `coherenceTime`, `gateFidelity`, `connectivity`, `errorRate`, `energyCost`, `qubits` |
| `limitation`, `bestFor`, `bestForDetail` | string | Trade-off narrative |
| `documentaryNarrative` | string[] | Three-beat arc (strength → flaw) |

### 5.2 Comparison Scores — `quantum-cinema/src/components/steps/ComparisonStep.tsx`

Normalized 0–100 `scores` (performance) and `envImpact` (environmental) per device drive the radar chart and bar breakdown. These are intentionally separate from `data.ts`.

### 5.3 World Labs Scene Map — `quantum-cinema/src/components/steps/WorldModelStep.tsx`

`DEVICE_CONFIGS` maps each `DeviceId` (`ion-trap`, `superconducting`, `neutral-atoms`) to a hardcoded `marble.worldlabs.ai` scene URL plus the entanglement teaching content.

### 5.4 Static Assets — `quantum-cinema/public/`

```
public/
├── videos/         ion-trap.mp4 · superconducting.mp4 · neutral-atoms.mp4
└── laureates/      clarke.jpg · devoret.webp · martinis.jpg
```

## 6. Interface Design

Quantum Cinema exposes **no REST API**. Its "interfaces" are the React step contracts and the World Labs embed. See [`architecture.md`](architecture.md) for the full specification. In summary:

- The root page (`src/app/page.tsx`) owns `currentStep` (0–3) and `selectedDevice`, passing `onNext` / `onBack` / `onSelectDevice` / `deviceId` callbacks into each step.
- Act 3 hands off to World Labs by opening the device's scene URL in a new tab.

## 7. Deployment Architecture

### 7.1 AWS Resource Inventory

| Service | Purpose |
|---------|---------|
| ECS Fargate | Runs the Next.js standalone container (1–4 tasks) |
| Application Load Balancer | Public entry; validates the CloudFront secret header, else `403` |
| CloudFront | CDN, TLS termination, security headers, static/video caching |
| VPC + NAT Gateway | Public subnets for the ALB; private subnets for ECS; NAT for outbound image pulls |
| S3 | CloudFront access-log bucket (encrypted, SSL-enforced, 90-day lifecycle) |
| CloudWatch Logs | `/ecs/quantum-cinema`, 2-week retention |
| ECR | Container image asset built from `quantum-cinema/Dockerfile` |

### 7.2 CDK Project Layout

```
quantum-cinema/                        # repo root (AWS CDK infra)
├── bin/
│   └── app.ts                         # CDK app entry — instantiates QcWorldlabsStack
├── lib/
│   └── qc-worldlabs-stack.ts          # VPC · ECS · ALB · CloudFront · S3
├── design/
│   └── design.md                      # ACM MM 2026 design paper
├── quantum-cinema/                    # Next.js 16 application
│   ├── src/app/                       # page.tsx (4-act state machine) · layout · globals.css
│   ├── src/components/                # StepIndicator · ParticleField · RadarChart · steps/* · ui/*
│   ├── src/lib/                       # data.ts (device specs) · utils.ts
│   ├── public/                        # videos/ · laureates/
│   └── Dockerfile                     # multi-stage Node 20 Alpine standalone build
├── deploy.sh                          # one-command build + deploy
├── cdk.json
└── package.json                       # CDK dependencies
```

## 8. Configuration

The stack is configured through CDK environment context — no application config file is required. The deployment region defaults to `$CDK_DEFAULT_REGION` (or `us-east-1`); the container receives only `NODE_ENV=production` and `PORT=3000`.

The CloudFront → ALB secret header value is derived at synth time from the stack ID, so no secret needs to be managed manually.

## 9. Security Checklist

- [ ] CloudFront enforces HTTPS and HSTS
- [ ] ALB returns `403` without the CloudFront secret header
- [ ] ALB ingress restricted to the CloudFront managed prefix list
- [ ] ECS tasks run in private subnets with no public IP
- [ ] Container runs as a non-root user
- [ ] Security response headers configured (HSTS, nosniff, frame options, referrer, XSS)
- [ ] CloudFront access logs encrypted at rest with SSL enforced
- [ ] No secrets, accounts, or user data stored (static site)
