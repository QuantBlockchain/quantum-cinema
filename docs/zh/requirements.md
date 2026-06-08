# Quantum Cinema — 需求文档

## 1. 项目概述

### 1.1 背景

量子计算机有望重塑医学、气候科学与密码学——然而它们始终被层层抽象所封锁：藏身于稀释制冷机中，只有物理学家才能理解，外观与雕塑无异。**2025 年诺贝尔物理学奖**——授予 John Clarke、Michel Devoret 与 John Martinis，以表彰他们在超导电路中演示宏观量子隧穿——让这道**想象力鸿沟**变得紧迫：现代量子计算的硬件基础刚刚在最高层级获得认可，而领域之外几乎无人能想象它的实际样貌。

**Quantum Cinema** 是一个纯浏览器、四幕式的电影化体验，利用**生成式世界模型**（AI 梦境般生成的 3D 场景）结合**真实的 AWS Braket 设备数据**，将三种不可见的力量——退相干、激光冷却与能量损耗——呈现为可观察的视觉叙事。无需头显，无需博士学位，也无需实时量子硬件。

> 完整的研究背景见 [`design/design.md`](../../design/design.md)（提交至 ACM Multimedia 2026）。

### 1.2 目标

- 将量子计算呈现为一条**选择 → 观看 → 探索 → 对比**的引导式流程
- 将四种真实量子架构重新构想为命名化、可探索的生成式世界
- 在交互式对比中呈现经过整理的真实设备指标（相干时间、保真度、连通性、错误率、量子比特数）
- 使用 **CDK** 在 AWS 上以基础设施即代码的方式部署
- 交付一个安全、静态设计的站点——无数据库、无用户账户，请求路径中也无实时硬件

## 2. 系统架构

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   浏览器     │────▶│  CloudFront  │────▶│      ALB        │
│  （观众）    │     │ CDN·TLS·HSTS │     │  密钥头校验      │
└─────────────┘     └──────────────┘     │   网关（403）    │
                          │              └────────┬────────┘
            缓存  _next/static/*                  │ :3000
                  videos/*                         ▼
                                          ┌─────────────────┐
                                          │  ECS Fargate    │
                                          │  Next.js 16 SPA │
                                          │  （私有子网）    │
                                          └────────┬────────┘
                                                   │ iframe / 新标签页
                                                   ▼
                                          ┌─────────────────┐
                                          │   World Labs    │
                                          │  生成式 3D       │
                                          │     世界         │
                                          └─────────────────┘
```

请求路径中**没有数据库、没有 Telegram、没有 Braket 调用、也没有身份认证**。"量子"部分被预先渲染为生成式世界，以及内置于应用中的、经过整理的真实设备数据。

## 3. 功能需求

### 3.1 四幕流程

- **FR-01**：以四幕状态机呈现体验——第 1 幕《诺贝尔奖》→ 第 2 幕《世界模型》→ 第 3 幕《探索》→ 第 4 幕《对比》
- **FR-02**：各幕之间带动画过渡（通过 Framer Motion 淡入/淡出）
- **FR-03**：提供常驻的步骤指示器，允许观众跳回任意已完成的幕
- **FR-04**：每次切换幕时滚动到页面顶部

### 3.2 第 1 幕 — 诺贝尔奖

- **FR-05**：展示 2025 年三位获奖者（Clarke · Devoret · Martinis），含肖像、所属机构、贡献与简介
- **FR-06**：渲染一条 125 年的量子时间线（1900 普朗克 → 1927 不确定性原理 → 1981 费曼 → 1994 Shor → 2019 量子优越性 → 2025 诺贝尔奖）

### 3.3 第 2 幕 — 世界模型 / 视频展示

- **FR-07**：播放三段 AI 梦境式纪录片片段（离子阱、超导、中性原子），来自 `/videos/*.mp4`，自动播放/循环/静音
- **FR-08**：讲解量子纠缠，以及每种架构创造纠缠的不同方式
- **FR-09**：允许观众选择一种设备，携带该选择进入第 3 幕

### 3.4 第 3 幕 — 世界模型 / 探索

- **FR-10**：针对所选设备，在新标签页中打开其 **World Labs** 生成式 3D 场景
- **FR-11**：为该设备提供引导式纠缠讲解：核心思想、"视觉元素 → 含义"映射、详细解释，以及面向初学者的类比
- **FR-12**：展示该设备的现实世界"最适合"应用

### 3.5 第 4 幕 — 对比

- **FR-13**：渲染六轴雷达图，对比所选设备
- **FR-14**：在**性能**与**环境影响**两种视图间切换
- **FR-15**：允许观众在对比中增删设备（至少保留一个）
- **FR-16**：展示逐项指标条形分解，以及"应用 → 最佳设备"匹配网格

### 3.6 呈现

- **FR-17**：提供深色/浅色主题切换，默认深色，跨访问持久化，且无错误主题闪烁
- **FR-18**：渲染动画粒子场，其强调色随幕切换
- **FR-19**：在移动端与桌面端均自适应

## 4. 非功能需求

### 4.1 安全

- **NFR-01**：CloudFront 强制 HTTPS（查看者协议策略 `REDIRECT_TO_HTTPS`）
- **NFR-02**：CloudFront 注入密钥头 `X-CloudFront-Secret`；ALB 对缺少匹配值的请求返回 `403`（阻止直接访问 ALB）
- **NFR-03**：ALB 安全组仅接受来自 AWS 托管的 CloudFront 源站前缀列表的流量
- **NFR-04**：ECS 任务运行在私有子网中，无公网 IP；出站仅经由 NAT
- **NFR-05**：CloudFront 输出安全响应头——HSTS（1 年，含子域）、`X-Content-Type-Options: nosniff`、`X-Frame-Options: SAMEORIGIN`、Referrer-Policy、XSS 保护。Next.js 另外设置 `Permissions-Policy`
- **NFR-06**：ALB 丢弃无效的头部字段
- **NFR-07**：容器以非 root 的 `nextjs` 用户身份运行，基于最小化的多阶段镜像
- **NFR-08**：CloudFront 访问日志写入私有、加密、强制 SSL 的 S3 存储桶（90 天生命周期）

### 4.2 性能

- **NFR-09**：CloudFront 以长 TTL 静态缓存策略缓存 `_next/static/*` 与 `videos/*`（Gzip + Brotli）；动态内容使用 `CachingDisabled`
- **NFR-10**：ECS 在 CPU 70% 时从 1 个任务自动扩展到 4 个
- **NFR-11**：CloudFront 通过 HTTP/2 与 HTTP/3 提供服务

### 4.3 可用性

- **NFR-12**：CloudFront 全球分发（PriceClass 100），实现低延迟访问
- **NFR-13**：ECS 服务使用带自动回滚的部署熔断器
- **NFR-14**：ALB 目标组健康检查探测 `/`（`200,304` 视为健康）

## 5. 数据模型

Quantum Cinema **没有数据库**。所有内容都是静态的，存在于应用源码中。

### 5.1 设备目录 — `quantum-cinema/src/lib/data.ts`

`QuantumDevice[]` 数组保存三种架构（`ionq`、`rigetti`、`quera`），每个包含显示元数据、六项指标、一项局限、一个"最适合"应用、一种视觉风格，以及一段三段式纪录片叙事。另有独立的 `MetricInfo[]` 数组以通俗语言解释五项对比指标。

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `id` | string | `ionq` / `rigetti` / `quera` |
| `name`、`subtitle`、`worldName` | string | 显示标签（如 `Rigetti Ankaa-3` / `Frozen Forge`） |
| `metrics` | object | `coherenceTime`、`gateFidelity`、`connectivity`、`errorRate`、`energyCost`、`qubits` |
| `limitation`、`bestFor`、`bestForDetail` | string | 权衡叙事 |
| `documentaryNarrative` | string[] | 三段式弧线（优势 → 缺陷） |

### 5.2 对比评分 — `quantum-cinema/src/components/steps/ComparisonStep.tsx`

每个设备归一化到 0–100 的 `scores`（性能）与 `envImpact`（环境）驱动雷达图与条形分解。它们刻意与 `data.ts` 分离。

### 5.3 World Labs 场景映射 — `quantum-cinema/src/components/steps/WorldModelStep.tsx`

`DEVICE_CONFIGS` 将每个 `DeviceId`（`ion-trap`、`superconducting`、`neutral-atoms`）映射到一个硬编码的 `marble.worldlabs.ai` 场景 URL，以及纠缠教学内容。

### 5.4 静态资源 — `quantum-cinema/public/`

```
public/
├── videos/         ion-trap.mp4 · superconducting.mp4 · neutral-atoms.mp4
└── laureates/      clarke.jpg · devoret.webp · martinis.jpg
```

## 6. 接口设计

Quantum Cinema **不暴露任何 REST API**。它的"接口"是 React 步骤契约与 World Labs 嵌入。完整规范见 [`architecture.md`](architecture.md)。简而言之：

- 根页面（`src/app/page.tsx`）持有 `currentStep`（0–3）与 `selectedDevice`，并向每个步骤传入 `onNext` / `onBack` / `onSelectDevice` / `deviceId` 回调。
- 第 3 幕通过在新标签页打开设备的场景 URL，将控制权移交给 World Labs。

## 7. 部署架构

### 7.1 AWS 资源清单

| 服务 | 用途 |
|---------|---------|
| ECS Fargate | 运行 Next.js standalone 容器（1–4 个任务） |
| Application Load Balancer | 公网入口；校验 CloudFront 密钥头，否则返回 `403` |
| CloudFront | CDN、TLS 终止、安全响应头、静态/视频缓存 |
| VPC + NAT 网关 | ALB 用公有子网；ECS 用私有子网；NAT 用于出站拉取镜像 |
| S3 | CloudFront 访问日志桶（加密、强制 SSL、90 天生命周期） |
| CloudWatch Logs | `/ecs/quantum-cinema`，保留 2 周 |
| ECR | 由 `quantum-cinema/Dockerfile` 构建的容器镜像资产 |

### 7.2 CDK 项目结构

```
quantum-cinema/                        # 仓库根目录（AWS CDK 基础设施）
├── bin/
│   └── app.ts                         # CDK 应用入口——实例化 QcWorldlabsStack
├── lib/
│   └── qc-worldlabs-stack.ts          # VPC · ECS · ALB · CloudFront · S3
├── design/
│   └── design.md                      # ACM MM 2026 设计论文
├── quantum-cinema/                    # Next.js 16 应用
│   ├── src/app/                       # page.tsx（四幕状态机）· layout · globals.css
│   ├── src/components/                # StepIndicator · ParticleField · RadarChart · steps/* · ui/*
│   ├── src/lib/                       # data.ts（设备规格）· utils.ts
│   ├── public/                        # videos/ · laureates/
│   └── Dockerfile                     # 多阶段 Node 20 Alpine standalone 构建
├── deploy.sh                          # 一键构建 + 部署
├── cdk.json
└── package.json                       # CDK 依赖
```

## 8. 配置

该栈通过 CDK 环境上下文进行配置——无需应用配置文件。部署区域默认取 `$CDK_DEFAULT_REGION`（或 `us-east-1`）；容器仅接收 `NODE_ENV=production` 与 `PORT=3000`。

CloudFront → ALB 的密钥头取值在综合（synth）阶段从栈 ID 派生，因此无需手动管理任何密钥。

## 9. 安全检查清单

- [ ] CloudFront 强制 HTTPS 与 HSTS
- [ ] 缺少 CloudFront 密钥头时 ALB 返回 `403`
- [ ] ALB 入站限制为 CloudFront 托管前缀列表
- [ ] ECS 任务运行在私有子网且无公网 IP
- [ ] 容器以非 root 用户运行
- [ ] 配置安全响应头（HSTS、nosniff、frame options、referrer、XSS）
- [ ] CloudFront 访问日志静态加密且强制 SSL
- [ ] 不存储任何密钥、账户或用户数据（静态站点）
