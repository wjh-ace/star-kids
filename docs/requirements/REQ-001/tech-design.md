# REQ-001：UI 框架搭建 — 技术方案

<!-- 修订: UX-R1, UX-R2, UX-R3, UX-R4, UX-R6, UX-R7, UX-R10, UX-R11, UX-R12, UX-R13, UX-R14, UX-R15 -->
<!-- 本次修订解决 UX Evaluator 发现的 1 个 BLOCKER + 5 个 HIGH + 6 个 MEDIUM findings -->

---

## 1. 方案概述：技术选型与架构思路

### 1.1 整体架构

```
┌─────────────────────────────────────────────────┐
│              Electron Main Process              │
│  electron/main.ts                               │
│  - BrowserWindow 创建（无边框中型窗口）          │
│  - session.setPermissionRequestHandler（摄像头） │
│  - IPC: requestCamera / releaseCamera            │
│  - 开发模式：加载 Vite dev server               │
├─────────────────────────────────────────────────┤
│  contextBridge (electron/preload.ts)            │
│  - window.electronAPI.getCameraPermission()     │
│  - window.electronAPI.getAppVersion()           │
├─────────────────────────────────────────────────┤
│              React Renderer Process             │
│  ┌───────────────────────────────────────────┐  │
│  │  Zustand Stores (chatStore / uiStore /    │  │
│  │  cameraStore)                              │  │
│  ├───────────────────────────────────────────┤  │
│  │  App.tsx (CSS Grid 三层布局)               │  │
│  │  ├── Environment (背景环境元素)             │  │
│  │  ├── CameraView (55%)                      │  │
│  │  │   ├── WoodFrame                         │  │
│  │  │   ├── VideoElement                      │  │
│  │  │   └── FloatingStars                     │  │
│  │  ├── ChatArea (25%)                        │  │
│  │  │   ├── ChatBackground                    │  │
│  │  │   ├── StarAvatar                        │  │
│  │  │   └── MessageBubble[]                   │  │
│  │  └── ControlBar (20%)                      │  │
│  │      ├── TextInput                         │  │
│  │      └── ToolButton[]                      │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 1.2 木纹边框实现

<!-- 修订: UX-R1 (BLOCKER) — 将主方案从 box-shadow 同心几何环改为 SVG 纹理边框方案 -->
<!-- 修订: UX-R2 (HIGH) — SVG 木纹纹理不再是"可选增强"，而是必需方案 -->

**设计原则**：PRD 追求"手绘童话感、木屋温馨氛围、拒绝科技感"。木框必须具备**真正的不规则笔触**，而非完美同心几何环（这正是 PRD 否定的"机械直线"效果）。box-shadow 方案产生的是等宽、等距、平行的几何环，无论叠加多少层都无法掩盖其机器生成的本质。

**主方案（必需）：SVG 滤镜纹理边框**

核心技术栈：`<feTurbulence>` + `<feDisplacementMap>` + 圆角裁剪容器。

**SVG 滤镜链定义**（内联于全局样式或组件内 `<defs>`）：

```xml
<!-- 木纹生成滤镜链: 木纹纹理 + 边缘不规则扰动 -->
<filter id="wood-texture" x="0%" y="0%" width="100%" height="100%">
  <!-- 1. 生成基础噪点（木纹基底） -->
  <feTurbulence
    type="fractalNoise"
    baseFrequency="0.04 0.3"
    numOctaves="4"
    seed="2"
    result="noise"
  />

  <!-- 2. 拉伸噪点模拟纵向木纹纤维 -->
  <!-- 通过 feColorMatrix 映射噪点为木色色阶 -->
  <feColorMatrix
    type="matrix"
    values="
      0.2 0   0   0   0.55
      0   0.1 0   0   0.35
      0   0   0.05 0  0.15
      0   0   0   1   0"
    in="noise"
    result="woodColor"
  />

  <!-- 3. 边缘不规则扰动（打破几何直线） -->
  <feDisplacementMap
    in="woodColor"
    in2="noise"
    scale="6"
    xChannelSelector="R"
    yChannelSelector="G"
    result="texturedWood"
  />

  <!-- 4. 叠加微光（模拟木纹亚光反射） -->
  <feComposite
    in="texturedWood"
    in2="SourceGraphic"
    operator="in"
    result="finalWood"
  />
</filter>

<!-- 边缘扰动专用滤镜（用于内边框伪元素） -->
<filter id="wood-edge-roughen">
  <feTurbulence
    type="fractalNoise"
    baseFrequency="0.08"
    numOctaves="3"
    seed="5"
    result="edgeNoise"
  />
  <feDisplacementMap
    in="SourceGraphic"
    in2="edgeNoise"
    scale="4"
    xChannelSelector="R"
    yChannelSelector="G"
  />
</filter>
```

**CSS 实现方案**：

```css
/* 外层容器：圆角裁剪 + overflow:hidden 确保内边框不溢出 */
.wood-frame {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  /* 背景应用木纹纹理 */
  background-color: #D4A574;
  /* 木纹暗角（内阴影模拟嵌入感） */
  box-shadow:
    inset 0 0 30px rgba(107, 66, 38, 0.25),
    2px 3px 12px rgba(107, 66, 38, 0.35);
}

/* 内层内容区（视频/聊天）通过 padding 留出边框宽度 */
.wood-frame__content {
  position: relative;
  margin: 8px; /* 边框宽度 */
  border-radius: 16px;
  overflow: hidden;
  z-index: 1;
}

/* ::before 伪元素：SVG 纹理层（应用木纹滤镜） */
.wood-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    /* 基色层 */
    linear-gradient(
      135deg,
      #C4956A 0%,
      #D4A574 20%,
      #B8845A 50%,
      #D4A574 80%,
      #C4956A 100%
    );
  /* 叠加木纹噪声纹理 */
  filter: url('#wood-texture');
  z-index: 0;
  pointer-events: none;
}

/* ::after 伪元素：内边框（带边缘不规则扰动） */
.wood-frame::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 3px solid rgba(139, 90, 43, 0.5);
  border-radius: 18px;
  filter: url('#wood-edge-roughen');
  z-index: 2;
  pointer-events: none;
}
```

**关键设计决策**：

| 决策 | 说明 |
|------|------|
| `baseFrequency="0.04 0.3"` | X 方向低频（模拟纵向木纹纤维），Y 方向高频（产生细密横向纹理变化） |
| `feDisplacementMap scale="6"` | 边缘扰动 6px，肉眼可见不规则但不至于过度扭曲 |
| `overflow: hidden` + `border-radius` | 外层容器裁剪确保所有圆角一致，解决 SVG 滤镜不跟随 border-radius 的问题 |
| box-shadow 降级使用 | box-shadow 仅用于环境光/深度暗示，不再用于纹理模拟 |
| 多 seed 值 | 不同木框组件使用不同 `seed` 值（通过 CSS 变量传递），避免视觉重复 |

**保底方案：9-slice PNG**

<!-- 修订: UX-R1 (BLOCKER) — 保底方案保留 9-slice PNG -->

当浏览器不支持 SVG 滤镜（如部分旧版 Electron/Chromium 或渲染异常）时，降级为预渲染的 9-slice PNG 木纹边框：

- 提供一张 64x64 的 PNG 木纹纹理（由设计师产出或从 SVG 滤镜预渲染导出）
- 使用 `border-image: url('wood-9slice.png') 24 fill / 8px stretch`
- 外层容器同样使用 `border-radius: 22px` + `overflow: hidden` 裁剪
- 9-slice PNG 方案不产生边缘扰动，手绘感弱于 SVG 滤镜方案，但远优于纯 box-shadow

**方案层级总结**：

```
Layer 1 (必需): SVG feTurbulence + feDisplacementMap 木纹滤镜
Layer 2 (保底): 9-slice PNG border-image
Layer 3 (降级): box-shadow 色阶分层（仅作为终极降级，不推荐）
```

### 1.3 小星角色实现

<!-- 修订: UX-R6 (HIGH) — 增加 Sprite Sheet 作为并行方案 -->
<!-- 修订: UX-R7 (MEDIUM) — 眨眼动画从 scaleY 改为眼睑覆盖层 -->

**双轨策略**：CSS 构建版本 + Sprite Sheet 版本并行开发，通过 `animationType` prop 切换。

**轨道 A：CSS 逐帧动画 + React 组件化**

理由：
- 零额外资源依赖，Phase 1 即刻启动
- CSS Sprite 动画零依赖，GPU 合成层性能优异
- 角色规格约 120x180px 渲染尺寸

**轨道 B：Sprite Sheet 静态 PNG + CSS animation（并行方案）**

<!-- 修订: UX-R6 (HIGH) — 新增 Sprite Sheet 方案详细设计 -->

当设计师提供角色精灵图后启用。实现方式：

- 单张 PNG 精灵图（如 `star-sprite.png`），包含角色的多个动画帧排列
- 通过 CSS `background-image` + `background-position` + `steps()` 实现逐帧播放
- `@keyframes` 中使用 `background-position` 偏移而非 `scaleY`/`transform`

```css
/* Sprite Sheet 角色示例 */
.star-sprite {
  width: 120px;
  height: 180px;
  background-image: url('assets/sprites/star-sprite.png');
  background-size: 600px 180px; /* 5 帧横向排列 */
  image-rendering: pixelated;    /* 保持像素风格 */
}

.star-sprite--blink {
  animation: spriteBlink 0.3s steps(2) infinite;
}

@keyframes spriteBlink {
  from { background-position: 0 0; }
  to   { background-position: -240px 0; } /* 眨眼占 2 帧 */
}
```

**animationType prop 枚举扩展**：

```ts
interface StarAvatarProps {
  animationType: 'css' | 'sprite' | 'lottie';
  // 'css'    — CSS div 构建（Phase 1 默认）
  // 'sprite' — Sprite Sheet PNG 序列帧（UX-R6 新增）
  // 'lottie' — Lottie JSON 动画（设计师交付后启用）
  currentAnimation: AnimationName;
  size?: 'small' | 'normal';
}
```

**CSS 版本最低可接受质量标准**：

<!-- 修订: UX-R6 (HIGH) — 设定 CSS 版本最低质量标准 -->

| 维度 | 最低标准 | 验证方式 |
|------|---------|---------|
| 角色辨识度 | 非专业用户可在 3 秒内认出"这是一个穿斗篷的小星角色" | 内部 3 人盲测 |
| 比例协调 | 2.5 头身比例可辨识，头部:身体 ≈ 1:1.5 | 截图测量像素比 |
| 颜色准确 | 使用 tokens.css 中定义的颜色变量，误差在 1 个色阶内 | DevTools 取色对比 |
| 动画流畅 | 眨眼/点头动画 60fps，无可见卡顿或跳帧 | Chrome DevTools Performance 面板 |
| 无恐怖谷 | 角色不产生"诡异""恐怖"的第一印象（常见于低质量 CSS 角色） | 内部 3 人盲测 |
| 手绘感 | 角色边缘有轻微不规则感，非完美几何形状 | 视觉审查 |

若 CSS 版本未通过以上标准，立即切换至 Sprite Sheet 方案。

**结构**：

```
StarAvatar/
├── StarAvatar.tsx         # 角色容器组件（调度 animationType 切换）
├── StarParts.tsx          # CSS 轨道：分解部位（头部、身体、斗篷、四肢）
├── StarSprite.tsx         # Sprite 轨道：精灵图渲染组件（UX-R6 新增）
├── starAnimations.css     # @keyframes 定义（blink, nod, wave, idleFloat）
├── starSprite.css          # Sprite 动画专属 keyframes（UX-R6 新增）
├── starColors.css         # CSS custom properties（颜色体系）
└── StarGlow.tsx           # 发光轮廓层
```

**眨眼动画修订：眼睑覆盖层方案**

<!-- 修订: UX-R7 (MEDIUM) — 从 scaleY 机械眨眼改为眼睑覆盖层 -->

**问题**：`scaleY(1 → 0.1 → 1)` 产生的是机械压缩效果，眼球被"压扁"而非"闭上"，缺乏生命感。

**新方案**：眼睑覆盖层动画。

```
<!-- 眼睛结构 -->
<div class="star-eye">
  <!-- 眼球（始终圆形，不缩放） -->
  <div class="star-eye__ball"></div>
  <!-- 上眼睑覆盖层（从上方滑入） -->
  <div class="star-eye__lid-top"></div>
  <!-- 下眼睑覆盖层（从下方滑入，幅度小） -->
  <div class="star-eye__lid-bottom"></div>
</div>
```

```css
/* 眼睑从上方覆盖眼球，模拟自然闭眼 */
.star-eye__lid-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0%;
  background-color: var(--color-star-skin); /* 与肤色相同 */
  border-radius: 50% 50% 0 0;
  transition: height 0.08s ease-in-out; /* 快速闭眼 */
}

.star-eye.blinking .star-eye__lid-top {
  height: 55%; /* 覆盖眼球上半部分 */
}

/* 下眼睑微动（增加真实感） */
.star-eye.blinking .star-eye__lid-bottom {
  height: 15%;
}

@keyframes eyeBlink {
  0%, 90%, 100% { /* 正常睁眼 */ }
  95% { /* 闭眼：上眼睑覆盖 55%，下眼睑 15% */ }
}
```

- 闭眼时长约 100-150ms，比 scaleY 方案更短（眼睑物理速度快于眼球形变）
- 上眼睑覆盖 55%，下眼睑微微抬起 15%（真实眨眼的下眼睑参与）
- 眼睑颜色与脸部肤色一致，无缝融合

### 1.4 像素字体选型

<!-- 修订: UX-R3 (HIGH) — 中文主字体改为站酷像素体，Zpix 降级为英文字符首选，增加圆体/手写体 fallback -->
<!-- 修订: UX-R4 (MEDIUM) — 14px 以上恢复 antialiased 渲染 -->

**推荐字体栈**（按优先级）：

| 优先级 | 字体名 | 覆盖范围 | 说明 |
|--------|--------|---------|------|
| 1 | **站酷像素体 (ZCOOL Pixel)** | 中文 + 拉丁 | 开源免费，字形更饱满厚重，14-18px 下可读性显著优于 Zpix，中文像素风格首选 |
| 2 | **Zpix（最像素）** | 拉丁优先 | 开源免费，英文像素字符精致，作为英文字符首选 fallback |
| 3 | **ZCOOL QingKe HuangYou** | 中文 + 拉丁 | 开源免费，圆体手写风格，在像素体加载失败时提供温暖的童话感 fallback |
| 4 | **Silkscreen** | 仅拉丁 | Google Fonts，英文像素首选之一，与站酷像素体组合使用 |
| 5 | `'Courier New', monospace` | 系统回退 | 最终兜底 |

**设计理由**：

- UX 审查发现 Zpix 在 14-18px 下中文字形纤细，可读性对儿童用户存疑。站酷像素体字形更饱满，在同等字号下感知字号更大。
- Zpix 保留在字体栈第二优先级，用于英文/数字字符渲染（其拉丁字形设计成熟度高于站酷像素体）。
- ZCOOL QingKe HuangYou 提供圆体手写感 fallback，确保即使所有像素字体加载失败，界面仍保持"手绘温暖"而非退化为系统无衬线体。

**CSS 字体栈**：

```css
--font-pixel: 'ZCOOL Pixel', 'Zpix', 'ZCOOL QingKe HuangYou', 'Silkscreen', 'Courier New', monospace;
--font-pixel-size: 16px;
--font-pixel-line-height: 1.6;
```

**字体平滑渲染策略（修订）**：

<!-- 修订: UX-R4 (MEDIUM) — 14px 以上恢复 antialiased -->

```css
/* 全局像素字体渲染（按字号分段处理） */
.pixel-text {
  font-family: var(--font-pixel);
}

/* 12-13px 微字号：保持像素感，关闭抗锯齿 */
.pixel-text--micro {
  font-size: 12px;
  font-smooth: never;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
}

/* 14px 及以上：恢复抗锯齿，避免 Windows 上中文锯齿影响可读性 */
.pixel-text--normal {
  font-size: 14px; /* 或更大 */
  font-smooth: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- 14px 是分界线：12-13px 的微字号（如角标、提示文字）保持像素感关闭抗锯齿，14px 及以上（对话气泡、按钮、标题）恢复 `antialiased`，避免 Windows 平台上中文字符的锯齿状渲染影响儿童阅读体验。
- `antialiased`（灰度抗锯齿）而非 `subpixel-antialiased`（次像素抗锯齿），在保留一定像素感的同时消除锯齿。

**字体加载策略**：

- 站酷像素体 + Zpix 作为自托管字体（`src/assets/fonts/`），分别约 4MB + 3.5MB
- 使用 `font-display: swap` 避免 FOIT
- 预加载 `<link rel="preload">` 关键字体文件
- ZCOOL QingKe HuangYou 和 Silkscreen 从 Google Fonts CDN 引入
- 使用 `unicode-range` 子集化：站酷像素体仅加载常用汉字（3500 字覆盖日常对话 99.5%），Zpix 仅加载拉丁字符集

### 1.5 动画系统架构

<!-- 修订: UX-R7 (MEDIUM) — 眨眼动画改为眼睑覆盖层方案 -->
<!-- 修订: UX-R10 (MEDIUM) — FloatingStars 合并到单个 SVG/Canvas -->
<!-- 修订: UX-R15 (MEDIUM) — WarmLightOverlay 改为渐变遮罩（模拟左上方方向光） -->

**分层设计**（按复杂度递进）：

```
Layer 1: CSS @keyframes（纯装饰动画）
├── 漂浮星星（floatingStar, twinkle）【合并到单个 SVG/Canvas — UX-R10】
├── 小星眨眼/点头/空闲浮动【眨眼改为眼睑覆盖层 — UX-R7】
├── 光晕呼吸（softPulse）
├── 环境粒子（dustMotes）
└── 挂画轻微摆动（paintingSway）【UX-R14 新增】

Layer 2: Framer Motion（交互动画）
├── 按钮 hover/click（scale + glow）
├── 消息气泡进入/退出（AnimatePresence）
├── 聊天区滚动提示（scroll indicator fade）
└── 摄像头画面加载过渡（fadeIn）

Layer 3: Custom Hooks（状态驱动的动画逻辑）
├── useStarAnimation.ts —— 管理小星动画队列（blink → nod → wave）
├── useIdleTimer.ts       —— 空闲检测触发随机动画
└── useCameraTransition.ts —— 摄像头启动/停止过渡
```

**Framer Motion 使用原则**：

- 仅用于交互反馈动画（hover/click/enter/exit）
- 不用于持续循环动画（循环动画用 CSS，性能更好、不触发 React 重渲染）
- `layout` 动画谨慎使用（性能开销大），优先用 CSS transition

**自定义 Hook 设计**：

```ts
// useStarAnimation.ts
interface StarAnimationState {
  current: 'idle' | 'blink' | 'nod' | 'wave' | 'curious';
  queue: AnimationName[];
  isPlaying: boolean;
}

function useStarAnimation(): {
  animation: StarAnimationState;
  trigger: (name: AnimationName) => void;
  pause: () => void;
  resume: () => void;
}
```

- blink 通过 `setInterval` 每 3-6 秒自动加入队列（眼睑覆盖层方案 — UX-R7）
- nod 通过 `setInterval` 每 8-15 秒自动加入队列
- wave 由 `chatStore` 的 `sendMessage` 事件触发
- curious 由摄像头帧变化检测触发（Phase 2，当前用定时模拟）

**FloatingStars 性能优化**：

<!-- 修订: UX-R10 (MEDIUM) — 合并到单个 SVG/Canvas 减少 DOM 节点 -->

原方案：每个星星一个绝对定位 `<span>` 元素（12+ DOM 节点，各自独立的 CSS animation）。

优化方案：单个 `<canvas>` 或内联 `<svg>` 统一管理所有星星，通过 `requestAnimationFrame` 驱动：

```tsx
// FloatingStars.tsx — 改为 Canvas 实现
function FloatingStars({ count = 12, area = 'corners' }: FloatingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * ctx.canvas.width,
      y: Math.random() * ctx.canvas.height,
      radius: 1 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.7,
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      stars.forEach(star => {
        ctx.globalAlpha = star.opacity * (0.5 + 0.5 * Math.sin(time * 0.001 * star.speed + star.phase));
        ctx.fillStyle = '#E8C56D';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [count]);

  return <canvas ref={canvasRef} className="floating-stars-canvas" />;
}
```

- DOM 节点从 12+ 降为 1（单个 `<canvas>`），减少布局/重绘成本
- 所有星星在同一个 `requestAnimationFrame` 中绘制，无独立 CSS animation 开销
- Canvas 尺寸与 CameraView 区域绑定，通过 ResizeObserver 自适应

**WarmLightOverlay 改为渐变遮罩**：

<!-- 修订: UX-R15 (MEDIUM) — 改为渐变遮罩模拟左上方方向光 -->

原方案：全屏均匀暖色叠加（`::after` 伪元素 + 纯色半透明层），无方向性。

新方案：CSS `radial-gradient` 模拟左上方暖光源照射效果：

```css
.warm-light-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  /* 左上方暖光放射渐变 */
  background: radial-gradient(
    ellipse 80% 60% at 25% 25%,
    rgba(255, 220, 160, 0.12) 0%,
    rgba(255, 200, 120, 0.05) 40%,
    transparent 70%
  );
  mix-blend-mode: overlay;
}
```

- 光心位于左上角 (25%, 25%)，模拟窗户/夜灯从左上照射
- 右下角保持较暗，形成自然的光影层次
- `mix-blend-mode: overlay` 叠加而非覆盖，保留底色细节

### 1.6 全局噪点纹理

<!-- 修订: UX-R11 (HIGH) — 增加全局噪点纹理，降低"机械几何感" -->

**目的**：全屏覆盖一层极淡的 SVG 噪点纹理，将所有"完美几何形状"统一到同一个物理介质层面（模拟纸面/画布质感），系统性降低"数字矢量感"。

**实现**：`body::after` 伪元素全屏 SVG 噪点：

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999; /* 最顶层，覆盖所有 UI */
  opacity: 0.03; /* 极淡，几乎不可见但潜意识可感知 */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
```

- 噪点纹理通过内联 data URI 引入，零额外 HTTP 请求
- `opacity: 0.03` 保证不影响内容可读性，但提供潜意识层面的"物理介质感"
- 使用 `feTurbulence` 生成高频噪点（`baseFrequency="0.9"`），比 CSS `noise()` 函数更可控
- `pointer-events: none` 确保不阻挡任何交互

### 1.7 摄像头接入方案

**Electron 中的 `getUserMedia` 注意事项**：

1. **权限处理**：Electron 中 `navigator.mediaDevices.getUserMedia` 需要主进程预先授权

   ```ts
   // electron/main.ts
   session.defaultSession.setPermissionRequestHandler(
     (webContents, permission, callback) => {
       if (permission === 'media') {
         callback(true); // 授权（后续可改为弹窗确认）
       } else {
         callback(false);
       }
     }
   );
   ```

2. **contextBridge 暴露**：

   ```ts
   // electron/preload.ts
   contextBridge.exposeInMainWorld('electronAPI', {
     requestCamera: () => ipcRenderer.invoke('request-camera'),
     releaseCamera: () => ipcRenderer.invoke('release-camera'),
   });
   ```

3. **渲染进程使用**：

   ```ts
   // src/hooks/useCamera.ts
   async function startCamera(): Promise<MediaStream> {
     const permitted = await window.electronAPI.requestCamera();
     if (!permitted) throw new Error('Camera permission denied');

     const stream = await navigator.mediaDevices.getUserMedia({
       video: {
         width: { ideal: 1280 },
         height: { ideal: 720 },
         frameRate: { ideal: 30 },
       },
       audio: false, // Phase 1 不接入麦克风
     });
     return stream;
   }
   ```

4. **安全约束**：
   - 渲染进程不直接调用 `getUserMedia`，统一通过 `useCamera` hook
   - hook 内部通过 contextBridge 请求主进程权限
   - 提供显式的"关闭摄像头"按钮（`ControlBar` 中）
   - 摄像头状态由 `cameraStore` 管理（`idle | requesting | active | denied | error`）

5. **视频渲染**：使用原生 `<video>` 标签 + `ref`，将 `MediaStream` 赋值给 `srcObject`：
   ```tsx
   <video ref={videoRef} autoPlay playsInline muted />
   // videoRef.current.srcObject = stream;
   ```

### 1.8 三层布局实现

**主方案：CSS Grid + `vh` 单位**

```css
.app-layout {
  display: grid;
  grid-template-rows: 55fr 25fr 20fr; /* 按比例分配 */
  height: 100vh;
  overflow: hidden; /* 阻止整体滚动，聊天区内部滚动 */
}
```

- `fr` 单位保证比例始终为 55:25:20，不受窗口缩放影响
- `100vh` 确保占满 Electron 窗口（无系统标题栏时）
- `overflow: hidden` 在根布局上，仅 `ChatArea` 内部允许 `overflow-y: auto`

**内部布局**：

- `CameraView`：单元素填充，`<video>` 使用 `object-fit: cover` 填满窗户区域
- `ChatArea`：CSS Grid 两列（`auto 1fr`），左列固定宽度给 StarAvatar，右列 Flexbox 纵向排列消息气泡
- `ControlBar`：Flexbox 水平排列，`TextInput` 用 `flex: 1` 占 60%，其余按钮固定 `48px`<!-- 修订: UX-R12 (MEDIUM) — 40px → 48px -->

**响应式边界**：

- 最小窗口尺寸：800x600（低于此尺寸提示用户）
- 字体和角色使用 `clamp()` 做基础缩放，不做复杂断点

---

## 2. 涉及模块/文件清单

### 2.1 Electron 主进程

```
electron/
├── main.ts                    # BrowserWindow 创建、权限处理、IPC 注册、dev 模式
├── preload.ts                 # contextBridge 暴露 electronAPI
└── tsconfig.json              # Electron 主进程 TS 配置（target: ESNext, module: commonjs）
```

### 2.2 React 组件树

<!-- 修订: UX-R6 (HIGH) — 新增 StarSprite.tsx, starSprite.css -->
<!-- 修订: UX-R14 (HIGH) — 新增 HangingPainting.tsx -->
<!-- 修订: UX-R10 (MEDIUM) — FloatingStars 改为 Canvas 实现 -->

```
src/
├── App.tsx                              # 根组件：三层 Grid 布局 + Environment 背景 + 全局噪点纹理
├── main.tsx                             # React 18 createRoot 入口
├── vite-env.d.ts                        # Vite + electronAPI 类型声明
│
├── components/
│   ├── CameraView/
│   │   ├── CameraView.tsx               # 视频区容器，管理视频渲染 + 木框包裹
│   │   ├── WoodFrame.tsx                # 木纹边框组件（SVG feTurbulence + feDisplacementMap 主方案）<!-- UX-R1 -->
│   │   ├── FloatingStars.tsx            # 窗户漂浮星星（单个 Canvas 实现）<!-- UX-R10 -->
│   │   └── VignetteOverlay.tsx          # 暗角 + 暖光散射遮罩
│   │
│   ├── ChatArea/
│   │   ├── ChatArea.tsx                 # 聊天区容器，消息列表 + 滚动管理 + 自动滚动到底部
│   │   ├── MessageList.tsx              # 消息列表（虚拟列表预留，Phase 1 直接 map）
│   │   ├── MessageBubble.tsx            # 单个消息气泡（小星/用户两种样式）
│   │   ├── ChatBackground.tsx           # 羊皮纸纹理背景层
│   │   └── ScrollHint.tsx               # 底部渐变提示（有新消息时）
│   │
│   ├── StarAvatar/
│   │   ├── StarAvatar.tsx               # 小星角色容器，动画调度入口（animationType: 'css' | 'sprite' | 'lottie'）<!-- UX-R6 -->
│   │   ├── StarHead.tsx                 # 头部：头发 + 发饰 + 眼睛 + 眼睑覆盖层眨眼动画 <!-- UX-R7 -->
│   │   ├── StarBody.tsx                 # 身体：斗篷 + 服装 + 手臂（挥手动画）
│   │   ├── StarSprite.tsx              # Sprite Sheet 渲染组件（UX-R6 新增）<!-- UX-R6 -->
│   │   ├── StarGlow.tsx                 # 发光轮廓层（drop-shadow + soft glow）
│   │   ├── SurroundingStars.tsx         # 角色周围漂浮小星星
│   │   ├── StarAvatar.css              # 角色 CSS 动画定义
│   │   └── starSprite.css              # Sprite 动画专属 keyframes（UX-R6 新增）<!-- UX-R6 -->
│   │
│   ├── ControlBar/
│   │   ├── ControlBar.tsx               # 工具栏容器：木底座 + 按钮排列
│   │   ├── TextInput.tsx                # 文本输入框（placeholder 使用系统字体）<!-- UX-R13 -->
│   │   ├── ToolButton.tsx               # 通用工具栏按钮（48×48px 最小尺寸）<!-- UX-R12 -->
│   │   └── icons/                       # 手绘风格 SVG 图标
│   │       ├── MicIcon.tsx
│   │       ├── CameraIcon.tsx
│   │       ├── PhotoIcon.tsx
│   │       ├── SettingsIcon.tsx
│   │       └── StarIcon.tsx
│   │
│   └── Environment/
│       ├── Environment.tsx              # 背景环境层（绝对定位，z-index 最低）
│       ├── Bookshelf.tsx                # 左侧模糊书架
│       ├── HangingPainting.tsx          # 右上角挂画（UX-R14 新增）<!-- UX-R14 -->
│       ├── PottedPlant.tsx              # 左下/右下小盆栽
│       ├── NightLamp.tsx                # 右下夜灯 + 暖光
│       ├── WindowScenery.tsx            # 窗户两侧窗外景色
│       └── WarmLightOverlay.tsx         # 左上方暖光渐变遮罩（radial-gradient）<!-- UX-R15 -->
│
├── hooks/
│   ├── useCamera.ts                     # 摄像头生命周期管理
│   ├── useStarAnimation.ts              # 小星动画队列调度
│   ├── useMockChat.ts                   # 模拟对话数据注入
│   ├── useAutoScroll.ts                 # 聊天区自动滚动到底部
│   └── useIdleAnimation.ts              # 空闲随机动画触发器
│
├── stores/
│   ├── chatStore.ts                     # 消息列表、发送消息、模拟回复
│   ├── uiStore.ts                       # UI 状态（动画类型、主题、面板开关）
│   └── cameraStore.ts                   # 摄像头状态、权限、stream 引用
│
├── mock/
│   └── chatData.ts                      # 3 轮模拟对话数据（含延迟模拟）
│
├── types/
│   ├── chat.ts                          # Message, Sender, ChatState 类型
│   ├── camera.ts                        # CameraState, CameraPermission 类型
│   └── star.ts                          # AnimationType, StarAnimation 类型<!-- UX-R6: 新增 'sprite' -->
│
├── styles/
│   ├── global.css                       # 全局重置、字体引入、CSS 变量定义、全局噪点纹理 <!-- UX-R11 -->
│   ├── tokens.css                       # 设计 Token（颜色、间距、圆角、阴影）
│   ├── animations.css                   # 全局 @keyframes（星星、光晕、粒子、挂画摆动）<!-- UX-R14 -->
│   └── fonts.css                        # @font-face 声明 + 字体加载策略
│
└── assets/
    ├── fonts/
    │   ├── zcool-pixel.woff2            # 站酷像素体（中文主字体）<!-- UX-R3 -->
    │   └── zpix-latin.woff2             # 最像素字体（仅拉丁子集）<!-- UX-R3 -->
    ├── sprites/
    │   └── star-sprite.png              # 小星精灵图（Sprite Sheet 方案）<!-- UX-R6 -->
    └── textures/
        ├── wood-texture.svg             # 木纹 SVG 滤镜定义（feTurbulence + feDisplacementMap）<!-- UX-R1 -->
        └── wood-9slice.png              # 木纹 9-slice PNG（保底方案）<!-- UX-R1 -->
```

### 2.3 状态管理（Zustand Store 结构）

<!-- 修订: UX-R6 (HIGH) — uiStore.animationType 新增 'sprite' -->

```ts
// chatStore.ts
interface ChatStore {
  messages: Message[];                    // 消息列表
  isSending: boolean;                     // 是否正在"发送"（模拟）
  sendMessage: (text: string) => void;    // 发送消息 + 触发模拟回复
  addMessage: (msg: Message) => void;     // 添加单条消息
  clearMessages: () => void;              // 清空对话
}

// uiStore.ts
interface UIStore {
  starAnimationType: 'css' | 'sprite' | 'lottie';   // 小星动画实现方式<!-- UX-R6: 新增 'sprite' -->
  isSettingsOpen: boolean;                // 设置面板（Phase 1 始终 false）
  activePanel: 'chat' | 'settings';      // 当前活跃面板
  toggleSettings: () => void;
}

// cameraStore.ts
interface CameraStore {
  status: 'idle' | 'requesting' | 'active' | 'denied' | 'error';
  stream: MediaStream | null;
  errorMessage: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  resetCamera: () => void;
}
```

### 2.4 Mock 数据结构

```ts
// mock/chatData.ts
interface MockMessage {
  id: string;
  sender: 'star' | 'user';
  text: string;
  timestamp: number;
  delayMs: number; // 模拟"思考"延迟
}

// 3 轮预置对话
const MOCK_CONVERSATION: MockMessage[] = [
  { id: '1', sender: 'star',  text: '嗨！欢迎来到小木屋～你今天想聊什么呀？⭐', timestamp: Date.now() - 60000, delayMs: 0 },
  { id: '2', sender: 'user',  text: '小星你好！今天外面天气好好啊～', timestamp: Date.now() - 30000, delayMs: 0 },
  { id: '3', sender: 'star',  text: '是呢！我看到窗外阳光很温暖～你要不要出去散散步？我可以陪你一起看风景！🌿', timestamp: Date.now() - 15000, delayMs: 2000 },
];
```

---

## 3. 组件树与数据流

### 3.1 组件层级关系

<!-- 修订: UX-R14 (HIGH) — Environment 增加 HangingPainting 右上角挂画 -->

```
App
├── Environment (z-index: 0, position: fixed)
│   ├── Bookshelf (left edge, blurred)
│   ├── HangingPainting (right-top corner)<!-- UX-R14 新增 -->
│   ├── PottedPlant (left-bottom)
│   ├── PottedPlant (right-bottom)
│   ├── NightLamp (right-bottom)
│   ├── WindowScenery (around camera)
│   └── WarmLightOverlay (full screen radial-gradient top-left → bottom-right)<!-- UX-R15 -->
│
├── section.camera (grid-row: 1, z-index: 1)
│   └── CameraView
│       ├── WoodFrame (SVG feTurbulence + feDisplacementMap + 圆角裁剪)<!-- UX-R1 -->
│       ├── <video> (ref from useCamera)
│       ├── VignetteOverlay (CSS overlay)
│       └── FloatingStars (single <canvas>, requestAnimationFrame)<!-- UX-R10 -->
│
├── section.chat (grid-row: 2, z-index: 1)
│   └── ChatArea
│       ├── ChatBackground (羊皮纸纹理 + 木框)
│       ├── div.chat-left-avatar
│       │   └── StarAvatar<!-- UX-R6: animationType='css'|'sprite'|'lottie' -->
│       │       ├── StarGlow (发光层)
│       │       ├── [if css]  StarHead (头 + 眼 + 眼睑覆盖层)<!-- UX-R7 -->
│       │       ├── [if css]  StarBody (斗篷 + 身体 + 手)
│       │       ├── [if sprite] StarSprite (PNG sprite sheet)<!-- UX-R6 -->
│       │       └── SurroundingStars (漂浮星星)
│       └── div.chat-right-messages
│           ├── MessageList
│           │   └── MessageBubble[] (来自 chatStore.messages)
│           └── ScrollHint (有新消息时显示)
│
└── section.control (grid-row: 3, z-index: 1)
    └── ControlBar
        ├── TextInput (flex: 1, placeholder 系统字体)<!-- UX-R13 -->
        ├── ToolButton (MicIcon, 48×48px)<!-- UX-R12 -->
        ├── ToolButton (CameraIcon, 48×48px)<!-- UX-R12 -->
        ├── ToolButton (PhotoIcon, 48×48px)<!-- UX-R12 -->
        ├── ToolButton (SettingsIcon, 48×48px)<!-- UX-R12 -->
        └── ToolButton (StarIcon, 48×48px)<!-- UX-R12 -->
```

### 3.2 各组件 Props/State 设计

<!-- 修订: UX-R6 (HIGH) — StarAvatarProps.animationType 新增 'sprite' -->
<!-- 修订: UX-R12 (MEDIUM) — ToolButton 最小尺寸 48px -->
<!-- 修订: UX-R13 (MEDIUM) — placeholder 使用系统字体 -->
<!-- 修订: UX-R14 (HIGH) — 新增 HangingPaintingProps -->

```ts
// === CameraView ===
interface CameraViewProps {
  // 无外部 props，全部从 cameraStore 读取
}
// Internal state:
// - videoRef: RefObject<HTMLVideoElement>
// - canvasRef: RefObject<HTMLCanvasElement> (for FloatingStars)<!-- UX-R10 -->

// === WoodFrame ===
interface WoodFrameProps {
  thickness: number;      // 边框粗度，默认 8 (px)
  borderRadius: number;   // 圆角，默认 22 (px)
  hasGlow: boolean;       // 是否显示暖色光晕
  woodSeed: number;       // feTurbulence seed 值，不同组件使用不同值避免重复<!-- UX-R1 新增 -->
  children: ReactNode;    // 嵌套内容
}

// === FloatingStars ===
interface FloatingStarsProps {
  count: number;          // 星星数量，默认 12
  area: 'corners' | 'all'; // 仅四角还是全区域
}
// 内部使用单个 <canvas> + requestAnimationFrame 实现<!-- UX-R10 -->

// === HangingPainting ===
// UX-R14 (HIGH) 新增 — 右上角挂画组件
interface HangingPaintingProps {
  src?: string;           // 画作图片（默认使用内置 SVG 插画）
  width: number;          // 画框宽度，默认 80 (px)
  height: number;         // 画框高度，默认 100 (px)
  tilt?: number;          // 倾斜角度 -5~5 度模拟手工挂画的不规则感，默认 -2
}
// 挂画由木框 + canvas 画面 + 悬挂绳索三部分组成
// 使用 CSS transform: rotate() 模拟手工挂画的轻微倾斜

// === ChatArea ===
interface ChatAreaProps {
  // 无外部 props，从 chatStore 读取
}

// === MessageBubble ===
interface MessageBubbleProps {
  message: Message;
}
// Sender === 'star': 奶油白背景 + 蜂蜜金边框 + 左侧星标 + 圆角左底方
// Sender === 'user':  浅木棕背景 + 无边框 + 圆角右底方

// === StarAvatar ===
interface StarAvatarProps {
  animationType: 'css' | 'sprite' | 'lottie'; // UX-R6: 新增 'sprite'
  currentAnimation: AnimationName;
  size?: 'small' | 'normal';       // 默认 'normal' (~120x180)
}
// 'css' 轨道使用: StarHead + StarBody + StarGlow + SurroundingStars
// 'sprite' 轨道使用: StarSprite + StarGlow + SurroundingStars<!-- UX-R6 -->

// === TextInput ===
interface TextInputProps {
  placeholder: string;
  disabled: boolean;
  onSend: (text: string) => void;
}
// placeholder 使用系统字体（-apple-system, sans-serif），非像素字体<!-- UX-R13 -->

// === ToolButton ===
interface ToolButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
  size?: number;           // 默认 48 (px)<!-- UX-R12: 40 → 48 -->
}
```

### 3.3 模拟数据注入方式

**策略**：通过 `useMockChat` hook 注入 `chatStore`

```
chatStore.sendMessage(text)
  → addMessage({ sender: 'user', text })
  → useMockChat 监听 messages 变化
  → 检测到用户发送消息后，延迟 1.5-3 秒
  → addMessage({ sender: 'star', text: randomPick(MOCK_REPLIES) })
```

**Mock 数据管理**：

- `mock/chatData.ts` 导出 `MOCK_REPLIES` 数组和 `MOCK_CONVERSATION` 预置对话
- `useMockChat` hook 在组件挂载时注入 3 轮预置对话（用于验证滚动和气泡渲染）
- 用户每次发送消息后，hook 随机选取一条模拟回复，延迟 1.5-3 秒后添加
- 模拟回复包含随机时间戳和小星动画触发器（wave）

**数据流图**：

```
User types → TextInput.onSend(text)
  → chatStore.sendMessage(text)
    → chatStore.addMessage({ sender: 'user', text })
    → React re-render → MessageList 更新 → useAutoScroll 滚动
    → useMockChat detects user message
      → setTimeout(1500-3000ms)
      → chatStore.addMessage({ sender: 'star', text: mockReply })
      → React re-render → MessageBubble 进场动画
      → useStarAnimation.trigger('wave')
```

---

## 4. Impact Scope

| 维度 | 判定 | 说明 |
|------|------|------|
| **ux_surface** | **yes** | 从零构建完整 UI 壳子，包含全新的视觉语言体系（星露谷手绘童话风）、三层布局、自定义角色组件。所有用户可见界面均为本次新建。 |
| **product_contract_change** | **no** | 本需求是第一里程碑，建立初始产品形态，不修改任何既有契约。后续 Phase 接入真实 AI 时，仅替换数据源（mock → API），UI 壳子本身不变。 |
| **structural_change** | **yes** | 创建完整的 Electron + React + TypeScript 前端架构：主进程（main/preload）、渲染进程（组件树 + Zustand stores + hooks + 类型体系）、样式系统（Design Token + CSS 分层）。这是项目的结构性奠基。 |
| **scope_tradeoff** | **yes** | 仅做静态 UI 壳子 + 模拟数据。明确裁剪：不接入真实 AI、不接入麦克风/语音、不实现设置面板逻辑、不做 Electron 打包、小星动画用 CSS/Sprite 版本而非 Lottie。所有裁剪项在 PRD Scope 边界中已明确记录。 |

---

## 5. Phase/Task 建议

### Phase 0：项目脚手架（1 个 task）

| Task | 内容 | 产出 |
|------|------|------|
| P0-T1 | 初始化 Electron + React + Vite + TS 项目骨架 | `electron/main.ts`, `electron/preload.ts`, `src/main.tsx`, `vite.config.ts`, `package.json` |

- 主进程创建无边框窗口（`frame: false`），加载 Vite dev server
- 配置 `session.setPermissionRequestHandler` 处理摄像头权限
- preload 通过 contextBridge 暴露 `electronAPI`
- 验证：`npm run dev` 能启动 Electron 窗口显示 React 页面

### Phase 1：设计 Token + 全局样式（3 个 task）<!-- UX-R11 新增任务 -->

| Task | 内容 | 产出 |
|------|------|------|
| P1-T1 | 建立设计 Token 体系（CSS 变量） | `styles/tokens.css`：颜色（12 个主色 + 点缀色）、间距（8px 基准）、圆角（4 档）、阴影（3 档）、字体栈 |
| P1-T2 | 全局样式 + 字体引入 + 动画定义 | `styles/global.css`, `styles/fonts.css`, `styles/animations.css`, `assets/fonts/zcool-pixel.woff2`, `assets/fonts/zpix-latin.woff2` |
| P1-T3 | 全局噪点纹理 + 手绘感基底层 | `styles/global.css` 中 `body::after` SVG 噪点纹理，`assets/textures/wood-texture.svg` SVG 木纹滤镜定义<!-- UX-R11 新增 --> |

- 引入站酷像素体（中文主字体）+ Zpix（拉丁子集）+ ZCOOL QingKe HuangYou（圆体 fallback）<!-- UX-R3 -->
- 定义全局 `@keyframes`：`floatingStar`, `twinkle`, `softPulse`, `dustMotes`, `paintingSway`<!-- UX-R14 -->
- CSS reset 按字号分段设置字体平滑：12-13px `font-smooth: never`，14px+ `antialiased`<!-- UX-R4 -->
- 全局噪点纹理作为最顶层伪元素，opacity 0.03，提供物理介质感<!-- UX-R11 -->
- SVG 木纹滤镜定义在 `<svg><defs>` 中全局注入，供所有 WoodFrame 组件引用<!-- UX-R1 -->
- 验证：页面加载后字体正确渲染，CSS 变量在 DevTools 中可见，噪点纹理可感知但不干扰阅读

### Phase 2：三层布局骨架 + 环境背景（2 个 task）

| Task | 内容 | 产出 |
|------|------|------|
| P2-T1 | 实现 CSS Grid 三层布局 | `App.tsx`：`grid-template-rows: 55fr 25fr 20fr`；各层占位容器 |
| P2-T2 | 实现环境背景层 | `Environment/` 下全部组件：书架、挂画<!-- UX-R14 -->、盆栽、夜灯、窗外景色、暖光渐变遮罩<!-- UX-R15 --> |

- 三层比例在窗口缩放时保持稳定
- 环境元素使用 `filter: blur()` + 低透明度不抢主体
- HangingPainting 位于右上角，带轻微倾斜（rotate -2deg）平衡视觉<!-- UX-R14 -->
- WarmLightOverlay 使用 `radial-gradient` 模拟左上方方向光<!-- UX-R15 -->
- 验证：Electron 窗口缩放至 800x600 和 1920x1080，布局比例不变

### Phase 3：摄像头视频区（3 个 task）

| Task | 内容 | 产出 |
|------|------|------|
| P3-T1 | 实现 `useCamera` hook + `cameraStore` | `hooks/useCamera.ts`, `stores/cameraStore.ts`, `types/camera.ts` |
| P3-T2 | 实现木纹边框组件（SVG 滤镜主方案） | `WoodFrame.tsx`：SVG feTurbulence + feDisplacementMap + 圆角裁剪容器 + 9-slice PNG 保底<!-- UX-R1, UX-R2 --> |
| P3-T3 | 实现 CameraView + 漂浮星星（Canvas）+ 暗角 | `CameraView.tsx`, `FloatingStars.tsx`（单 Canvas 实现）<!-- UX-R10 -->, `VignetteOverlay.tsx` |

- 摄像头画面通过 `getUserMedia` 实时显示在 `<video>` 中
- 木框使用 SVG 滤镜产生木纹纹理和边缘不规则扰动（非 box-shadow 几何环）<!-- UX-R1 -->
- WoodFrame 通过 `woodSeed` prop 为不同实例设置不同 feTurbulence seed<!-- UX-R1 -->
- 漂浮星星使用单个 Canvas + requestAnimationFrame，性能优于 12+ 独立 DOM 节点<!-- UX-R10 -->
- 暗角柔和不遮挡画面
- 验证：(1) 授权摄像头后画面正确显示在窗户内 (2) 拒绝授权显示友好提示 (3) 可通过工具栏按钮关闭/重开摄像头 (4) 木框边缘有不规则手绘感

### Phase 4：聊天区 + 消息气泡（3 个 task）

| Task | 内容 | 产出 |
|------|------|------|
| P4-T1 | 实现 `chatStore` + `useMockChat` + 模拟数据 | `stores/chatStore.ts`, `hooks/useMockChat.ts`, `mock/chatData.ts`, `types/chat.ts` |
| P4-T2 | 实现聊天区背景 + 消息气泡 | `ChatArea.tsx`, `ChatBackground.tsx`, `MessageList.tsx`, `MessageBubble.tsx` |
| P4-T3 | 实现自动滚动 + 动画 | `hooks/useAutoScroll.ts`, `ScrollHint.tsx`, Framer Motion 气泡进场 |

- 两种气泡样式（小星/用户）视觉区分明确
- 羊皮纸背景纹理可见
- 3 轮预置对话正确渲染并通过滚动验证
- 发送新消息后自动滚动到底部，气泡有进场动画
- 验证：通过文本输入框发送消息 → 用户气泡出现 → 延迟后小星气泡出现 → 自动滚动

### Phase 5：小星角色 + 动画（4 个 task）<!-- UX-R6 新增 Sprite Sheet 任务 -->

| Task | 内容 | 产出 |
|------|------|------|
| P5-T1 | 实现 StarAvatar CSS 轨道（静态角色） | `StarAvatar.tsx`, `StarHead.tsx`（含眼睑覆盖层）<!-- UX-R7 -->, `StarBody.tsx`, `StarGlow.tsx` |
| P5-T2 | 实现 StarAvatar Sprite Sheet 轨道 | `StarSprite.tsx`, `starSprite.css`, `assets/sprites/star-sprite.png`<!-- UX-R6 新增 --> |
| P5-T3 | 实现 `useStarAnimation` + CSS 动画（眼睑眨眼/漂浮/点头） | `hooks/useStarAnimation.ts`, `StarAvatar.css`：blink（眼睑覆盖层）/nod/idleFloat |
| P5-T4 | 实现角色周围漂浮星星 + 发光轮廓 | `SurroundingStars.tsx`，`filter: drop-shadow` 发光 |

- 角色位置在聊天区左侧固定，不随消息滚动
- 眨眼使用眼睑覆盖层动画（非 scaleY）<!-- UX-R7 -->
- CSS 版本须通过最低质量标准的 3 人盲测<!-- UX-R6 -->
- 同时准备 Sprite Sheet 轨道，通过 `animationType='sprite'` 切换<!-- UX-R6 -->
- 使用 PRD 定义的颜色体系
- 验证：(1) 角色正确渲染且比例协调 (2) 自动动画触发正常 (3) 发送消息后挥手动画触发 (4) CSS 版本通过盲测或成功切换到 Sprite 版本

### Phase 6：工具栏 + 输入交互（3 个 task）

| Task | 内容 | 产出 |
|------|------|------|
| P6-T1 | 实现工具栏底座 + 按钮布局 | `ControlBar.tsx`：木底座样式（SVG 木纹滤镜）<!-- UX-R1 --> |
| P6-T2 | 实现 TextInput + 中文输入法兼容 | `TextInput.tsx`：placeholder 使用系统字体<!-- UX-R13 -->，处理 `compositionstart/end` 事件 |
| P6-T3 | 实现 ToolButton + 手绘 SVG 图标 | `ToolButton.tsx`（48×48px 最小尺寸）<!-- UX-R12 -->, `icons/*`：5 个手绘风格 SVG 图标，hover/click 动画 |

- 5 个按钮 + 输入框布局正确
- 输入框占 60% 宽度，按钮各 48x48px<!-- UX-R12 -->
- Hover 放大 + 发光，Click 缩小反馈
- 输入框在中文输入法组合输入时不误触发发送
- placeholder 使用系统字体（-apple-system, sans-serif），保持可读性，避免像素字体在 14px placeholder 场景下辨识度不足<!-- UX-R13 -->
- 验证：(1) Enter 发送消息，Shift+Enter 换行 (2) 中文输入不误发 (3) 按钮 hover/click 动画流畅 (4) 按钮 48px 尺寸符合触屏友好标准

### Phase 7：集成联调 + 细节打磨（3 个 task）<!-- UX-R11 新增手绘感审计 -->

| Task | 内容 | 产出 |
|------|------|------|
| P7-T1 | 全组件集成 + 交互流程走查 | 整体 UI 渲染、消息闭环、动画联动 |
| P7-T2 | 色彩审计 + 性能检查 + 边缘情况 | 禁止色扫描、FPS 检查、窗口缩放/最小尺寸适配 |
| P7-T3 | **手绘感审计（Hand-Drawn Audit）** | 系统性排查机械几何感来源<!-- UX-R11 新增 --> |

**P7-T3 手绘感审计检查清单**：

<!-- 修订: UX-R11 (HIGH) — 新增手绘感审计步骤 -->

| # | 检查项 | 判定标准 | 不合格处理 |
|---|--------|---------|-----------|
| 1 | 是否存在完美同心几何环？ | 所有"边框"必须经过 feDisplacementMap 扰动或手绘 SVG 路径 | 替换为 SVG 滤镜方案 |
| 2 | 直线长度是否超过 40px？ | CSS border 直线段不超过 40px，超过则用 SVG path 替代 | 分解为分段路径 |
| 3 | 圆角是否过于完美？ | border-radius 配合 feDisplacementMap 微扰，或使用 clip-path 不规则圆角 | 叠加边缘扰动滤镜 |
| 4 | 阴影是否均匀？ | box-shadow 必须非对称（offset-x ≠ offset-y），不得使用 0 0 均匀扩散 | 调整 shadow offset |
| 5 | 颜色是否"数字感"过重？ | 全局噪点纹理覆盖后，纯色区域应有微纹理可见 | 调高噪点 opacity 至 0.04 |
| 6 | 动画是否机械匀速？ | 所有循环动画使用 ease-in-out 或 cubic-bezier，拒绝 linear | 调整 timing-function |
| 7 | 组件排列是否过于网格化？ | 环境元素位置有 2-5px 的随机偏移 | 添加随机偏移 |
| 8 | 字体渲染是否过于尖锐？ | 14px+ 像素字体使用 antialiased，无锯齿 | 检查 font-smooth 设置 |
| 9 | 整体第一印象是否"温暖手绘"而非"科技产品"？ | 3 人盲测：80% 以上选择"手绘/温暖/童话"而非"科技/现代/App" | 重新审视材质方案 |

- 审计在 Phase 7 末尾进行，作为 Phase 7 完成的门禁条件
- 整体色调符合色彩体系，无禁止色
- Electron 窗口启动后 2 秒内完成渲染
- 浮动星星/角色动画保持 60fps
- 验证：按 PRD 成功标准逐项检查 + 手绘感审计清单全部通过

---

## 6. 技术风险

<!-- 修订: R1 更新为反映新的 SVG 滤镜主方案 -->
<!-- 修订: R4 更新为反映 Sprite Sheet 并行方案 -->

| # | 风险描述 | 影响 | 概率 | 缓解措施 |
|---|---------|------|------|---------|
| **R1** | **SVG `feDisplacementMap` 滤镜在低性能设备上渲染性能不足**。SVG 滤镜（尤其是多层 `feTurbulence` + `feDisplacementMap`）可能在集成显卡或低配机器上导致帧率下降，木框渲染开销过大。<!-- 修订: UX-R1 — 风险焦点从 border-image 兼容性转移 --> | 木框渲染卡顿，整体 UI 帧率下降 | 中 | 木框滤镜仅在挂载时渲染一次（`<filter>` 结果被浏览器缓存）；对 WoodFrame 使用 `will-change: filter` 提前提升合成层；若性能不达标，降级为 9-slice PNG 方案（零滤镜开销）；在 Phase 7 性能检查中重点监控木框区域 FPS。 |
| **R2** | **站酷像素体 + Zpix 双字体包体积过大**（合计约 7.5MB 未压缩），影响首次加载速度。<!-- 修订: UX-R3 — 字体从单一 Zpix 变为双字体 --> | 首屏白屏时间超 2 秒 | 中 | 使用 `font-display: swap` + 预加载 `<link rel="preload">`；使用 `unicode-range` 子集化：站酷像素体仅加载常用 3500 汉字，Zpix 仅加载拉丁字符集；若影响严重，ZCOOL QingKe HuangYou 作为 CDN fallback 先行渲染。 |
| **R3** | **`getUserMedia` 在 Electron 中权限弹窗行为不一致**。不同操作系统（Windows/Mac）对摄像头权限的处理不同，部分 Windows 版本可能在无提示时拒绝。 | 摄像头无法启动，用户体验断裂 | 中 | 在主进程 `setPermissionRequestHandler` 中统一授权；添加详细的错误状态处理（`cameraStore.errorMessage`）；提供手动重试按钮 + 友好错误提示。 |
| **R4** | **CSS 构建角色精细度不足 / Sprite Sheet 素材未及时交付**。CSS div 构建 Q 版角色可能在细节上显简陋，达不到"高端独立游戏美术质感"要求；同时设计师可能无法在 Phase 5 前交付 Sprite Sheet 素材。<!-- 修订: UX-R6 — 增加 Sprite Sheet 并行方案的交付风险 --> | 视觉质量不达标，需要返工 | 中 | Phase 5 先快速出 MVP CSS 版本验证整体比例和布局；同步设立 CSS 版本最低质量标准（辨识度、比例、无恐怖谷），不通过则阻塞发布；准备占位 Sprite Sheet（由开发者用简易像素画工具绘制临时版本）；最终方案通过 `animationType` prop 无缝切换。 |
| **R5** | **Framer Motion 与像素字体渲染冲突**。Framer Motion 的 `opacity`/`scale` 动画可能在像素字体上引发抗锯齿，破坏像素感。 | 动画时字体模糊 | 低 | 测试 Framer Motion 对像素字体渲染的影响；若冲突，将文本动画改为纯 CSS `@keyframes`（GPU 合成层不触发重绘）；或对文本层禁用 transform 动画，改用 `color`/`background` 变化。 |
| **R6** | **CSS Grid `fr` 单位在 Electron 旧版 Chromium 中行为异常**。Electron 28 内嵌 Chromium 版本可能对 `fr` 的某些边缘情况处理不佳（如子元素有固定高度时 `fr` 计算不准确）。 | 三层布局比例偏移 | 低 | 使用百分比 `55% 25% 20%` 作为 `fr` 的等价替代；或在 `App.tsx` 中检测实际渲染高度并通过 JS 修正。实际上 Electron 28 的 Chromium 版本已充分支持 Grid，此风险概率很低。 |
| **R7** | **Canvas 漂浮星星在窗口缩放时像素失真**。Canvas 渲染是位图，窗口缩放时需要重新计算尺寸和重绘，若 ResizeObserver 回调延迟可能出现短暂模糊。<!-- 修订: UX-R10 — 从 DOM 粒子风险转为 Canvas 风险 --> | 窗口缩放时星星短暂模糊 | 低 | 使用 ResizeObserver + `devicePixelRatio` 动态调整 Canvas 分辨率；debounce 缩放事件处理（150ms）；若 Canvas 方案在缩放时表现不佳，可降级为少量 CSS 定位星星（≤6 个）。 |
| **R8** | **全局噪点纹理在部分 GPU 上引发合成层过载**。<!-- UX-R11 新增风险 --> `body::after` 全屏 SVG 噪点在低配 GPU 上可能导致整个页面的合成成本增加。 | 整体渲染帧率下降 | 低 | 噪点 opacity 仅 0.03，渲染成本极低；使用 `background-repeat: repeat` + 256px tile 而非全屏 SVG；通过 `prefers-reduced-motion` 媒体查询在低性能模式下移除噪点层；Phase 7 性能检查中监控。 |

---

## 附录 A：依赖清单

### 生产依赖

```
react: ^18.3
react-dom: ^18.3
zustand: ^4.5
framer-motion: ^11.0
```

### 开发依赖

```
electron: ^28.x
typescript: ^5.4
vite: ^5.x
@vitejs/plugin-react: ^4.x
vite-plugin-electron: ^0.28.x
vite-plugin-electron-renderer: ^0.14.x
tailwindcss: ^3.4        (仅用于 utility class，不做组件样式)
postcss: ^8.x
autoprefixer: ^10.x
```

### 字体

```
zcool-pixel (站酷像素体): 自托管 .woff2，子集化约 2MB (常用 3500 汉字)<!-- UX-R3 -->
zpix (最像素): 自托管 .woff2，仅拉丁子集约 80KB<!-- UX-R3 -->
zcool-qingke-huangyou (站酷庆科黄油体): Google Fonts CDN
silkscreen: Google Fonts CDN
```

## 附录 B：关键文件路径速查

| 文件 | 路径 |
|------|------|
| 技术方案（本文） | `docs/requirements/REQ-001/tech-design.md` |
| PRD | `docs/requirements/REQ-001/prd.md` |
| 项目架构 | `docs/architecture.md` |
| Electron 主进程 | `electron/main.ts` |
| Preload 脚本 | `electron/preload.ts` |
| React 根组件 | `src/App.tsx` |
| 设计 Token | `src/styles/tokens.css` |
| 全局噪点纹理 | `src/styles/global.css` (body::after)<!-- UX-R11 --> |
| SVG 木纹滤镜 | `src/assets/textures/wood-texture.svg`<!-- UX-R1 --> |
| 9-slice PNG 保底 | `src/assets/textures/wood-9slice.png`<!-- UX-R1 --> |
| 小星 Sprite Sheet | `src/assets/sprites/star-sprite.png`<!-- UX-R6 --> |
| Zustand Chat Store | `src/stores/chatStore.ts` |
| 摄像头 Hook | `src/hooks/useCamera.ts` |
| 模拟数据 | `src/mock/chatData.ts` |
| 挂画组件 | `src/components/Environment/HangingPainting.tsx`<!-- UX-R14 --> |

## 附录 C：UX Finding 修订对照表

<!-- 本次修订的完整变更追踪 -->

| Finding ID | 严重程度 | 修订内容 | 涉及章节 |
|------------|---------|---------|---------|
| UX-R1 | **BLOCKER** | box-shadow 同心几何环 → SVG feTurbulence + feDisplacementMap 为主方案，9-slice PNG 为保底 | 1.2, 2.2, 3.1, 5(P3-T2), 6(R1), 附录B |
| UX-R2 | **HIGH** | SVG 木纹纹理从"可选增强"改为"必需方案"，box-shadow 降级为仅提供环境光 | 1.2, 5(P3-T2) |
| UX-R3 | **HIGH** | 中文主字体改为站酷像素体，Zpix 降级为拉丁首选，增加 ZCOOL QingKe HuangYou | 1.4, 5(P1-T2), 6(R2), 附录A |
| UX-R4 | MEDIUM | 14px+ 恢复 antialiased，12-13px 保持 pixel-snap | 1.4, 5(P1-T2) |
| UX-R6 | **HIGH** | 新增 Sprite Sheet 并行方案、`'sprite'` animationType、CSS 质量最低标准 | 1.3, 2.2, 2.3, 3.1, 3.2, 5(P5-T2), 6(R4) |
| UX-R7 | MEDIUM | 眨眼从 scaleY 改为眼睑覆盖层动画 | 1.3, 1.5, 2.2, 3.1, 5(P5-T3) |
| UX-R10 | MEDIUM | FloatingStars 从 12+ DOM 节点改为单个 Canvas + requestAnimationFrame | 1.5, 2.2, 3.1, 3.2, 5(P3-T3), 6(R7) |
| UX-R11 | **HIGH** | 新增全局噪点纹理（body::after SVG 噪点 opacity 0.03）+ Phase 7 手绘感审计 | 1.6, 5(P1-T3), 5(P7-T3), 6(R8) |
| UX-R12 | MEDIUM | ToolButton 最小尺寸 40→48px | 1.8, 2.2, 3.2, 5(P6-T3) |
| UX-R13 | MEDIUM | TextInput placeholder 使用系统字体而非像素字体 | 2.2, 3.1, 3.2, 5(P6-T2) |
| UX-R14 | **HIGH** | 新增 HangingPainting 组件（右上角挂画，木框 + canvas + 绳索 + 倾斜） | 2.2, 3.1, 3.2, 5(P2-T2), 附录B |
| UX-R15 | MEDIUM | WarmLightOverlay 从均匀暖色层改为 radial-gradient 左上方向光 | 1.5, 2.2, 3.1, 5(P2-T2) |
