# CLAUDE.md — 小星 Star Kids

AI 视觉对话助手。PC 桌面 App（Electron），打开摄像头像视频通话一样跟 AI 伙伴"小星"聊天。面向 6-12 岁儿童。

## 技术栈

- **桌面端**：Electron 28+ + React 18 + TypeScript + Vite + Tailwind CSS + Zustand
- **后端**：Python 3.12 + FastAPI + WebSocket + SQLite
- **AI 能力**：待定（后续接入）

## 项目结构

```
/
├── electron/              # Electron 主进程
├── src/                   # React 渲染进程
├── backend/               # Python 后端
├── docs/                  # Conductor 运行态
└── CLAUDE.md
```

## 运行方式

本项目使用 **Conductor 执行调度型运行时**。

- **启动 Conductor**：输入 `/Conductor`
- **PM 讨论**：输入 `/PM`
- **当前状态**：见 `docs/progress.md`

## 当前状态

体系就绪。第一个需求（UI 框架搭建）待录入 backlog 并由 Conductor 推进。
