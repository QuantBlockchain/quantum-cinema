# 系统架构

## 概述

Quantum Cinema 是一个单页 **Next.js 16 / React 19** 应用，将不可见的量子硬件转化为可浏览的四幕电影化体验。它以容器化服务的形式部署在 AWS 上，置于全球 CDN 之后，沉浸式 3D 世界由 **World Labs**（[marble.worldlabs.ai](https://marble.worldlabs.ai)）流式传入。请求路径中没有数据库，也没有实时量子硬件——"量子"部分被预先渲染为生成式世界，以及经过整理的真实设备数据。

## 系统级图示

```
┌──────────────────────────────────────────────────────────────────────┐
│  👤 观众                                                              │
│  浏览器 → CloudFront  (CDN · TLS · HSTS · 安全响应头)                │
│              │  缓存  _next/static/*  与  videos/*                    │
│              │  在每次源站请求上注入 X-CloudFront-Secret 头           │
└──────────────┬─────────────────────────────────────────────────────────┘
               │  HTTPS → HTTP（源站）
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  🛡️ 应用负载均衡器 (ALB)  （公有子网）                                │
│      默认动作：403 Forbidden                                          │
│      仅当 X-CloudFront-Secret 头匹配时才转发  ──────────────────┐   │
│      入站限制为 CloudFront 托管前缀列表                          │   │
└──────────────────────────────────────────────────────────────────┼─────┘
                                                                    │ :3000
                                                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│  🎬 ECS FARGATE  （私有子网 · 无公网 IP）                            │
│      Next.js 16 standalone 容器 · Node 20 Alpine · 非 root           │
│      在 70% CPU 时自动扩展 1 → 4 个任务 · 熔断器回滚                  │
│                                                                       │
│      NobelPrizeStep · VideoShowcaseStep · WorldModelStep · Comparison │
└──────────────┬─────────────────────────────────────────────────────────┘
               │  在新标签页打开场景（window.open）
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│  🌌 WORLD LABS  (marble.worldlabs.ai)                                 │
│      生成式 3D "世界"——每种量子架构一个                              │
└──────────────────────────────────────────────────────────────────────┘

   📼 烘焙进镜像的静态资源：  /videos/*.mp4 · /laureates/*
```

## 数据流

### 请求流程

```
1. 观众请求 https://<distribution>.cloudfront.net
        │
        ▼
2. CloudFront
   ├── 终止 TLS，将 HTTP 重定向到 HTTPS
   ├── 缓存命中时直接提供 _next/static/* 与 videos/*
   ├── 添加安全响应头（HSTS、nosniff、frame、referrer、XSS）
   └── 在源站请求上注入 X-CloudFront-Secret
        │
        ▼
3. 应用负载均衡器（HTTP :80）
   ├── 默认动作 → 403 Forbidden
   └── 规则（优先级 1）：仅当 X-CloudFront-Secret 与综合阶段的密钥值
       匹配时，才转发到目标组
        │
        ▼
4. ECS Fargate 任务（:3000，私有子网）
   └── Next.js standalone 服务器渲染四幕 SPA
        │
        ▼
5. 浏览器运行客户端状态机（page.tsx）
   └── 第 3 幕在新标签页打开所选设备的 World Labs 场景
```

### 四幕状态机

整个体验由 `quantum-cinema/src/app/page.tsx` 在客户端驱动，它持有两块状态：`currentStep`（0–3）与 `selectedDevice`。

```
┌─ 第 0 幕 ─ NobelPrizeStep ──────────────────────────────────────────┐
│  获奖者（Clarke · Devoret · Martinis）+ 1900→2025 时间线            │
│  onNext ─────────────────────────────────────────────────────────┐ │
└───────────────────────────────────────────────────────────────────┼─┘
                                                                     ▼
┌─ 第 1 幕 ─ VideoShowcaseStep ───────────────────────────────────────┐
│  三段 AI 梦境式片段 + 纠缠讲解                                       │
│  onSelectDevice(deviceId) → 设置 selectedDevice，前进 ────────────┐ │
│  onBack ◀─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┼─┘
                                                                     ▼
┌─ 第 2 幕 ─ WorldModelStep(deviceId) ────────────────────────────────┐
│  在新标签页打开 World Labs 场景 + 纠缠讲解                           │
│  onNext ─┐    onBack ◀──（换一个设备）                              │
└──────────┼──────────────────────────────────────────────────────────┘
           ▼
┌─ 第 3 幕 ─ ComparisonStep ──────────────────────────────────────────┐
│  雷达图（性能 / 环境影响）+ 指标条形分解                             │
│  onBack ◀── 返回探索                                                 │
└──────────────────────────────────────────────────────────────────────┘

   🧭 StepIndicator（固定顶部导航）允许观众通过 onStepClick(step)
      跳转到任意已完成/当前的幕。
```

## 组件映射

| 组件 | 文件 | 职责 |
|-----------|------|------|
| `Home` | `src/app/page.tsx` | 四幕状态机；持有 `currentStep` + `selectedDevice` |
| `RootLayout` | `src/app/layout.tsx` | 字体（Inter · Space Grotesk · JetBrains Mono）、ThemeProvider、无闪烁主题脚本 |
| `StepIndicator` | `src/components/StepIndicator.tsx` | 固定顶部导航：幕进度 + 主题切换 |
| `ParticleField` | `src/components/ParticleField.tsx` | 逐幕动画粒子背景（每幕不同强调色） |
| `RadarChart` | `src/components/RadarChart.tsx` | 六轴设备对比图 |
| `ThemeProvider` / `ThemeToggle` | `src/components/Theme*.tsx` | 主题上下文 + localStorage 持久化（`quantum-cinema-theme`） |
| `NobelPrizeStep` | `src/components/steps/NobelPrizeStep.tsx` | 第 1 幕——获奖者 + 时间线 |
| `VideoShowcaseStep` | `src/components/steps/VideoShowcaseStep.tsx` | 第 2 幕——视频片段 + 设备选择 |
| `WorldModelStep` | `src/components/steps/WorldModelStep.tsx` | 第 3 幕——World Labs 场景 + 纠缠讲解 |
| `ComparisonStep` | `src/components/steps/ComparisonStep.tsx` | 第 4 幕——雷达图 + 指标表 |
| `ui/*` | `src/components/ui/` | shadcn 风格基础组件（card、tabs、badge、button、separator、tooltip） |

## 接口规范

Quantum Cinema **没有 REST API**。它的契约是 React props 与一个外部嵌入。

### 步骤 Props 契约

| 步骤 | 接收的 props |
|------|----------------|
| `NobelPrizeStep` | `onNext()` |
| `VideoShowcaseStep` | `onNext()`、`onBack()`、`onSelectDevice(deviceId)` |
| `WorldModelStep` | `deviceId`、`onNext()`、`onBack()` |
| `ComparisonStep` | `onBack()` |

`DeviceId = "ion-trap" | "superconducting" | "neutral-atoms"`——三种架构。

### World Labs 嵌入契约

`WorldModelStep.tsx` → `DEVICE_CONFIGS` 将每个 `DeviceId` 映射到一个硬编码的场景 URL，通过 `window.open(url, "_blank", "noopener,noreferrer")` 打开：

| DeviceId | 设备 | 世界 | 场景 |
|----------|--------|-------|-------|
| `ion-trap` | IonQ Aria | Light Suspension | `marble.worldlabs.ai/world/7f7dcf51-…` |
| `superconducting` | Rigetti Ankaa-3 | Frozen Forge | `marble.worldlabs.ai/world/cfbff551-…` |
| `neutral-atoms` | QuEra Aquila | Wave Garden | `marble.worldlabs.ai/world/510dff36-…` |

## 输入/输出定义

### 设备目录（`src/lib/data.ts`）

```ts
interface QuantumDevice {
  id: string;            // ionq | rigetti | quera
  name: string;          // 如 "Rigetti Ankaa-3"
  subtitle: string;      // 如 "Frozen Forge"
  technology: string;
  provider: string;      // AWS | IonQ | Rigetti | QuEra
  color: string;         // 强调色十六进制
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
  documentaryNarrative: string[];  // 三段式弧线
}
```

### 雷达图序列推导（`ComparisonStep.tsx`）

每个被选设备贡献一条归一化到 0–100 的序列。当前标签决定哪个数据集驱动雷达图与条形分解：

- **性能** → `scores`（`Coherence`、`Gate Fidelity`、`Connectivity`、`Error Rate`、`Energy Eff.`、`Qubits`）
- **环境影响** → `envImpact`（`Carbon Footprint`、`Energy Usage`、`Cooling Req.`、`Material Use`、`E-Waste`、`Water Usage`）

`Error Rate` 被反转（错误越低 → 分数越高），从而在所有性能轴上保持"越往外 = 越好"。

## 安全模型

| 层级 | 机制 |
|-------|-----------|
| **边缘** | CloudFront 强制 HTTPS、HSTS（1 年，含子域）以及安全响应头策略 |
| **源站网关** | ALB 仅转发携带正确 `X-CloudFront-Secret` 头的请求；其余一律 `403` |
| **网络** | ALB 入站限制为 CloudFront 托管前缀列表；ECS 任务在私有子网，无公网 IP，出站经 NAT |
| **响应头** | `X-Frame-Options: SAMEORIGIN`、`X-Content-Type-Options: nosniff`、Referrer-Policy、XSS 保护（CloudFront）+ `Permissions-Policy`（Next.js） |
| **传输** | 全程 TLS；ALB 丢弃无效头部字段 |
| **容器** | 以非 root 的 `nextjs` 用户身份运行，基于最小化的多阶段 Node 20 Alpine 镜像 |
| **日志** | CloudFront 访问日志写入私有、加密、强制 SSL 的 S3 桶（90 天生命周期） |

## AWS 基础设施一览

| 服务 | 角色 |
|---------|------|
| **ECS Fargate** | Next.js 容器（512 CPU / 1024 MiB，1–4 个任务，70% CPU 自动扩展，熔断器回滚） |
| **Application Load Balancer** | 密钥头校验；直接访问返回 `403`；健康检查 `/` |
| **CloudFront** | CDN、TLS、安全响应头，动态与 `_next/static/*`、`videos/*` 使用不同缓存策略；HTTP/2+3；PriceClass 100 |
| **VPC + NAT 网关** | 2 个可用区；ALB 用公有子网，ECS 用私有子网；一个 NAT 用于出站拉取 |
| **S3** | CloudFront 访问日志桶（加密、强制 SSL、90 天生命周期） |
| **CloudWatch Logs** | `/ecs/quantum-cinema`，保留 2 周 |
| **ECR** | 由 `quantum-cinema/Dockerfile` 构建的容器镜像资产 |

### 栈输出

| 输出 | 含义 |
|--------|---------|
| `CloudFrontURL` | 🎬 公开 URL——打开它即可体验 Quantum Cinema |
| `ALBDnsName` | 负载均衡器 DNS（直接访问被刻意阻止 → `403`） |
| `CloudFrontDistributionId` | 用于缓存失效的分发 ID |

该栈定义于 [`lib/qc-worldlabs-stack.ts`](../../lib/qc-worldlabs-stack.ts)，并由 [`bin/app.ts`](../../bin/app.ts) 实例化为 `QcWorldlabsStack`。
