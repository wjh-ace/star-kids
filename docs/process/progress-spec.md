# progress-spec — progress.md 规范

`docs/progress.md` 是 Conductor 的**运行态入口**，记录当前 session 的工作焦点和执行进度。每次 session 结束时必须更新。

## 文档结构

`progress.md` 包含以下按顺序排列的段落：

### 1. Now（当前焦点）

当前正在处理的需求和阶段。单行，简洁。

```markdown
## Now

**REQ-001** 用户登录 — `executing` 阶段，Phase 2/3（表单验证与错误处理）
```

### 2. Next（下一步）

当前需求完成后，下一个待推进的需求（来自 backlog 的优先级排序）。

```markdown
## Next

1. **REQ-002** 用户头像上传 — `draft`，待 PM 编写 PRD
2. **REQ-003** 数据看板 — `planning`，暂停中（待 PM 确认图表选型）
```

### 3. Current Plan（当前执行计划）

当前需求（Now 中的需求）的 Phase/Task 清单。每个 task 前有 checkbox。

```markdown
## Current Plan

**需求**：REQ-001 用户登录
**方案**：[tech-design.md](docs/requirements/REQ-001/tech-design.md)

### Phase 1：数据层与模型

- [x] Task 1.1：创建 User 模型与数据库迁移 `src/models/user.ts` `migrations/001_user.sql`
- [x] Task 1.2：实现密码哈希与验证工具 `src/utils/crypto.ts`
- [ ] Task 1.3：创建 UserRepository `src/repositories/user.ts`

### Phase 2：API 层

- [ ] Task 2.1：实现 POST /api/auth/login 端点
- [ ] Task 2.2：实现 POST /api/auth/register 端点
- [ ] Task 2.3：实现 Session 中间件

### Phase 3：前端集成

- [ ] Task 3.1：创建登录页面组件
- [ ] Task 3.2：对接后端登录 API
- [ ] Task 3.3：实现登录状态持久化
```

### 规则

- Phase 顺序编号，task 使用 `Phase编号.Task编号` 格式
- 每个 task 后标注涉及的关键文件
- Conductor 在 Phase 的 code-review 通过后勾选该 Phase 的所有 task
- 如果 Phase > 5 个，Conductor 将各 Phase findings 写入 `docs/review-notes/` 而非全部内联此处

### 4. Latest Handoff（最新交接）

按 `docs/process/handoff-spec.md` 的 4 字段模板填写。Session 结束时必须更新。

## 更新时机

| 事件 | 更新内容 |
|------|---------|
| Session 开始 | Conductor 读取全部内容作为上下文 |
| 需求启动 | 设置 Now + 创建 Current Plan |
| Task 完成 | Dev 交付后记录状态（不勾选——code-review 通过后才勾选） |
| Phase 完成 | code-review 通过后勾选该 Phase 全部 task |
| 需求阻塞 | 更新 Now 段落标注阻塞 |
| Session 结束 | 更新 Now / Next / Latest Handoff |
