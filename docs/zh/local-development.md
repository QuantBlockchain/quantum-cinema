# 本地开发指南

## 工作原理

Quantum Cinema 是一个**静态设计**的 Next.js 应用。与依赖云资源的系统不同，**本地开发无需 AWS**：没有数据库、没有 API 密钥，也没有实时量子硬件。四幕体验完全在浏览器中运行，沉浸式 3D 世界直接从其公开的 **World Labs** URL 加载。

```
本地 Next.js (localhost:3000)
   ├── 渲染四幕 SPA（诺贝尔奖 → 世界模型 → 探索 → 对比）
   ├── 从 public/ 提供 /videos/*.mp4 与 /laureates/*
   └── 第 3 幕在新标签页打开 World Labs 场景（公开 URL）

只有在「部署」时才会涉及 AWS（见"CDK 基础设施变更"）。
```

## 前置条件

- **Node.js 20+**（`node --version`）
- *（仅部署需要）* **Docker**——构建 ECS 容器镜像所需
- *（仅部署需要）* 已配置凭证的 **AWS CLI** 与 **AWS CDK**（`npm install -g aws-cdk`）

## 快速开始

```bash
cd quantum-cinema      # Next.js 应用位于嵌套的 quantum-cinema/ 目录
npm install            # 首次运行，或依赖变更时
npm run dev
```

打开 http://localhost:3000 即可体验 Quantum Cinema。

**热重载**：对组件、页面与样式的编辑会自动刷新浏览器。

## 常见工作流

### 编辑某一幕（步骤组件）

每一幕都是 `quantum-cinema/src/components/steps/` 下一个自包含的组件：

| 幕 | 文件 |
|-----|------|
| 第 1 幕 — 诺贝尔奖 | `NobelPrizeStep.tsx`（获奖者 + 时间线数据为内联常量） |
| 第 2 幕 — 世界模型 | `VideoShowcaseStep.tsx`（视频元数据 + 纠缠摘要内联） |
| 第 3 幕 — 探索 | `WorldModelStep.tsx`（各设备 World Labs 配置 + 纠缠教学） |
| 第 4 幕 — 对比 | `ComparisonStep.tsx`（雷达评分 + 应用匹配内联） |

四幕编排（当前激活哪一幕、设备选择）位于 `quantum-cinema/src/app/page.tsx`。

### 编辑设备规格

- **目录 / 指标 / 叙事** → `quantum-cinema/src/lib/data.ts`（`devices` 数组与 `metricsInfo`）
- **对比雷达评分**（归一化 0–100，性能 + 环境）→ `quantum-cinema/src/components/steps/ComparisonStep.tsx` 中的 `DEVICES` 常量

> 注意：对比评分刻意与 `data.ts` 分离。若新增或重命名设备，请同时更新两处。

### 替换 World Labs 场景

在 `quantum-cinema/src/components/steps/WorldModelStep.tsx` 的 `DEVICE_CONFIGS` 中，编辑相应 `DeviceId` 的 `url`。

### 替换纪录片视频

将新文件放入 `quantum-cinema/public/videos/`（`ion-trap.mp4`、`superconducting.mp4`、`neutral-atoms.mp4`）并保持文件名不变，或更新 `VideoShowcaseStep.tsx` 中的 `src`。

### 调整主题 / 颜色

主题令牌（浅色 + 深色调色板、辉光/网格效果）位于 `quantum-cinema/src/app/globals.css`。主题切换逻辑与无闪烁初始化脚本位于 `quantum-cinema/src/components/ThemeProvider.tsx`（localStorage 键 `quantum-cinema-theme`，默认深色）。

### Lint

```bash
cd quantum-cinema
npm run lint
```

## 生产构建检查

在部署前，验证容器所承载的 standalone 构建：

```bash
cd quantum-cinema
npm run build          # 产出 .next/standalone（output: "standalone"）
npm run start          # 在本地以生产构建提供服务
```

要复现完全一致的容器镜像：

```bash
cd quantum-cinema
docker build -t quantum-cinema .       # 多阶段 Node 20 Alpine，以非 root 运行
docker run -p 3000:3000 quantum-cinema
```

## CDK 基础设施变更

基础设施从**仓库根目录**管理（而非嵌套的应用目录）。

```bash
# 预览变更
npm run diff           # → npx cdk diff

# 综合（synthesize）CloudFormation 模板
npm run synth          # → npx cdk synth

# 部署 / 拆除
npm run deploy         # → npx cdk deploy
npm run destroy        # → npx cdk destroy
```

或使用一键脚本，它会检查凭证、安装依赖、构建前端、引导 CDK 并部署：

```bash
./deploy.sh
```

区域默认取 `$CDK_DEFAULT_REGION`（或 `us-east-1`）。成功后，CDK 会打印 `CloudFrontURL`、`ALBDnsName` 与 `CloudFrontDistributionId`。

## 项目结构

```
quantum-cinema/                        ← 仓库根目录（CDK 基础设施）
├── bin/app.ts                         ← CDK 应用入口（QcWorldlabsStack）
├── lib/qc-worldlabs-stack.ts          ← VPC · ECS · ALB · CloudFront · S3
├── deploy.sh                          ← 一键构建 + 部署
├── design/design.md                   ← ACM MM 2026 设计论文
└── quantum-cinema/                    ← Next.js 应用（本地开发在此进行）
    ├── src/app/                       ← page.tsx（四幕状态机）· layout · globals.css
    ├── src/components/                ← StepIndicator · ParticleField · RadarChart · steps/* · ui/*
    ├── src/lib/                       ← data.ts（设备规格）· utils.ts
    ├── public/                        ← videos/ · laureates/
    └── Dockerfile                     ← 多阶段 Node 20 Alpine standalone 构建
```
