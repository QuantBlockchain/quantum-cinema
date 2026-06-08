# Local Development Guide

## How It Works

Quantum Cinema is a **static-by-design** Next.js application. Unlike systems that depend on cloud resources, **local development needs no AWS**: there is no database, no API keys, and no live quantum hardware. The four-act experience runs entirely in the browser, and the immersive 3D worlds load directly from their public **World Labs** URLs.

```
Local Next.js (localhost:3000)
   ├── renders the four-act SPA (Nobel → World Models → Explore → Compare)
   ├── serves /videos/*.mp4 and /laureates/* from public/
   └── Act 3 opens World Labs scenes in a new tab (public URLs)

AWS is only involved when you DEPLOY (see "CDK Infrastructure Changes").
```

## Prerequisites

- **Node.js 20+** (`node --version`)
- *(Deploy only)* **Docker** — required to build the ECS container image
- *(Deploy only)* **AWS CLI** with configured credentials and **AWS CDK** (`npm install -g aws-cdk`)

## Quick Start

```bash
cd quantum-cinema      # the Next.js app lives in the nested quantum-cinema/ dir
npm install            # first run, or when dependencies change
npm run dev
```

Open http://localhost:3000 to experience Quantum Cinema.

**Hot reload**: edits to components, pages, and styles refresh the browser automatically.

## Common Workflows

### Edit an Act (Step Component)

Each act is a self-contained component under `quantum-cinema/src/components/steps/`:

| Act | File |
|-----|------|
| Act 1 — Nobel Prize | `NobelPrizeStep.tsx` (laureates + timeline data are inline constants) |
| Act 2 — World Models | `VideoShowcaseStep.tsx` (video metadata + entanglement summaries inline) |
| Act 3 — Explore | `WorldModelStep.tsx` (per-device World Labs config + entanglement teaching) |
| Act 4 — Comparison | `ComparisonStep.tsx` (radar scores + application matches inline) |

The four-act orchestration (which step is active, device selection) lives in `quantum-cinema/src/app/page.tsx`.

### Edit Device Specs

- **Catalog / metrics / narratives** → `quantum-cinema/src/lib/data.ts` (the `devices` array and `metricsInfo`)
- **Comparison radar scores** (normalized 0–100, performance + environmental) → the `DEVICES` constant inside `quantum-cinema/src/components/steps/ComparisonStep.tsx`

> Note: the comparison scores are intentionally separate from `data.ts`. If you add or rename a device, update both places.

### Swap a World Labs Scene

Edit the `url` for the relevant `DeviceId` in `DEVICE_CONFIGS` inside `quantum-cinema/src/components/steps/WorldModelStep.tsx`.

### Replace a Documentary Video

Drop a new file into `quantum-cinema/public/videos/` (`ion-trap.mp4`, `superconducting.mp4`, `neutral-atoms.mp4`) and keep the filename, or update the `src` in `VideoShowcaseStep.tsx`.

### Adjust Theme / Colors

Theme tokens (light + dark palettes, glow/grid effects) live in `quantum-cinema/src/app/globals.css`. Theme switching logic and the no-flash init script are in `quantum-cinema/src/components/ThemeProvider.tsx` (localStorage key `quantum-cinema-theme`, dark default).

### Lint

```bash
cd quantum-cinema
npm run lint
```

## Production Build Check

Verify the standalone build that the container ships before deploying:

```bash
cd quantum-cinema
npm run build          # produces .next/standalone (output: "standalone")
npm run start          # serve the production build locally
```

To reproduce the exact container image:

```bash
cd quantum-cinema
docker build -t quantum-cinema .       # multi-stage Node 20 Alpine, runs as non-root
docker run -p 3000:3000 quantum-cinema
```

## CDK Infrastructure Changes

Infrastructure is managed from the **repo root** (not the nested app dir).

```bash
# Preview the change
npm run diff           # → npx cdk diff

# Synthesize the CloudFormation template
npm run synth          # → npx cdk synth

# Deploy / tear down
npm run deploy         # → npx cdk deploy
npm run destroy        # → npx cdk destroy
```

Or use the one-command script, which checks credentials, installs deps, builds the frontend, bootstraps CDK, and deploys:

```bash
./deploy.sh
```

The region defaults to `$CDK_DEFAULT_REGION` (or `us-east-1`). On success, CDK prints `CloudFrontURL`, `ALBDnsName`, and `CloudFrontDistributionId`.

## Project Layout

```
quantum-cinema/                        ← repo root (CDK infrastructure)
├── bin/app.ts                         ← CDK app entry (QcWorldlabsStack)
├── lib/qc-worldlabs-stack.ts          ← VPC · ECS · ALB · CloudFront · S3
├── deploy.sh                          ← one-command build + deploy
├── design/design.md                   ← ACM MM 2026 design paper
└── quantum-cinema/                    ← Next.js application (where local dev happens)
    ├── src/app/                       ← page.tsx (4-act state machine) · layout · globals.css
    ├── src/components/                ← StepIndicator · ParticleField · RadarChart · steps/* · ui/*
    ├── src/lib/                       ← data.ts (device specs) · utils.ts
    ├── public/                        ← videos/ · laureates/
    └── Dockerfile                     ← multi-stage Node 20 Alpine standalone build
```
