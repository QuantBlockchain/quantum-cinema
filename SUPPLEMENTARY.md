# Quantum Cinema Supplementary Material

## Purpose

This repository contains the software artifact and deployment infrastructure for the Quantum Cinema project. It is intended as a reproducible supplementary material package for academic publication.

## Contents

- `quantum-cinema/` — Next.js frontend application
- `lib/` — AWS CDK infrastructure stack
- `bin/` — deployment entrypoint for CDK
- `docs/` — design, architecture, and implementation rationale
- `README.md` — project overview and high-level documentation

## Reproducibility

### Required tools

- Node.js 20.x
- npm 10.x
- Docker (for container builds)
- AWS CLI configured with valid credentials
- AWS CDK v2

### Environment

Run these commands from the repository root.

```bash
# Install root dependencies
npm ci

# Install frontend dependencies
cd quantum-cinema
npm ci
```

### Local development

```bash
cd quantum-cinema
npm run dev
```

Open `http://localhost:3000` in a browser.

### Build

```bash
cd quantum-cinema
npm run build
```

### Deployment

```bash
./deploy.sh
```

If your AWS region is not `us-west-2`, set `AWS_DEFAULT_REGION` before running deploy:

```bash
AWS_DEFAULT_REGION=us-west-2 ./deploy.sh
```

## Provenance

- The frontend experience is driven by data and visuals defined in `quantum-cinema/src/lib/data.ts`.
- The AWS deployment is defined in `lib/qc-worldlabs-stack.ts`.
- The paper asset focuses on quantum device architecture, generative world models, and visual narrative.

## Notes for reviewers

- The app is built as a standalone Next.js deployment image and served by ECS Fargate behind CloudFront.
- The infrastructure stack synthesizes and deploys a VPC, ALB, ECS service, CloudFront distribution, and logging bucket.
- The repo contains no database and no runtime quantum hardware.
