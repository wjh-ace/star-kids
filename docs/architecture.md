# Architecture — 小星 Star Kids

AI 视觉对话助手。PC 桌面 App（Electron），打开摄像头像视频通话一样跟 AI 伙伴"小星"聊天。面向 6-12 岁儿童。

## 技术栈

### 桌面端
- **框架**：Electron 28+
- **渲染进程**：React 18 + TypeScript + Vite
- **UI**：Tailwind CSS
- **状态管理**：Zustand（轻量，适合单窗口应用）
- **摄像头/麦克风**：Web API `getUserMedia` + Web Audio API

### 后端
- **运行时**：Python 3.12
- **框架**：FastAPI + Uvicorn
- **实时通信**：WebSocket（Socket.IO 或原生 ws）
- **数据库**：SQLite（本地优先，儿童数据不离开设备）/ PostgreSQL（如需要云端功能）
- **ORM**：SQLAlchemy 2.0 + Alembic

### AI 能力（后续接入）
- **视觉理解**：待定（端云混合：本地轻量检测 + 云端大模型深度理解）
- **语音识别 STT**：待定（Whisper 或云端 API）
- **语音合成 TTS**：待定（需支持儿童友好的自然语音）
- **大模型 LLM**：待定（Claude API 或 GPT-4o 等，需视觉能力）

## 目录结构

```
/
├── electron/                # Electron 主进程
│   ├── main.ts             # 窗口管理、IPC
│   └── preload.ts          # contextBridge 安全暴露 API
├── src/                    # React 渲染进程
│   ├── components/
│   │   ├── CameraView/     # 摄像头实时画面 + 小星浮层
│   │   ├── ChatArea/       # 对话气泡区
│   │   ├── StarAvatar/     # 小星角色组件
│   │   └── ControlBar/     # 控制栏（打字/语音/挂断）
│   ├── hooks/
│   │   ├── useCamera.ts    # 摄像头 hook
│   │   ├── useMicrophone.ts # 麦克风 hook
│   │   └── useChat.ts      # 对话状态 hook
│   ├── stores/             # Zustand stores
│   └── App.tsx
├── backend/                # Python 后端
│   ├── main.py             # FastAPI 入口
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── ai/                 # AI 能力模块（后续）
├── docs/                   # Conductor 运行态
└── CLAUDE.md
```

## 架构约定

### 桌面端
- **安全**：渲染进程不直接访问 Node.js API，所有系统能力通过 `contextBridge` 暴露
- **摄像头/麦克风**：通过浏览器 API 获取，在渲染进程中处理
- **IPC 通信**：渲染进程 ↔ Electron 主进程 ↔ 后端，干净分层

### 后端
- **REST API**：管理类接口（配置、历史记录等）
- **WebSocket**：实时对话流（音频帧、视频帧、AI 响应流）
- **数据库**：本地 SQLite 优先，儿童隐私数据不出设备

### 跨层约定
- 前端不直接调后端 HTTP 端口，统一通过 Electron IPC 中转（安全 + 端口管理）
- 后端服务随 Electron 应用一起启动/关闭

## 架构约束（不可违反）

- 儿童数据默认本地存储，不上传云端（除非明确开启云端功能且家长同意）
- 摄像头/麦克风权限必须显式请求，提供关闭按钮
- 所有 AI 调用必须可降级（云端不可用时给出本地降级体验）
- 渲染进程不直接访问 Node.js / 文件系统 / 系统 shell
