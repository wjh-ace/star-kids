# handoff-spec — 会话交接规范

当 Conductor session 结束时（无论是正常结束还是因 context 80% 预警触发收尾），必须按本规范在 `docs/progress.md` 的 `Latest Handoff` 段落写入交接信息。

## 4 字段模板

```markdown
## Latest Handoff

### 1. Status Summary（状态摘要）

{一句话总结当前 session 做了什么，需求推进到什么状态}

### 2. Completed Since Last Handoff（本次完成）

{本次 session 实际完成的具体事项，用列表}

### 3. Current Blocker / Decision Needed（当前阻塞/待决策）

{当前阻塞项和需要的决策。如果无阻塞，写"无"}

### 4. Next Steps for Next Session（下个 Session 的行动项）

{下一个 session 应该做的第一件事，含具体文件/命令。可操作，不可模糊}
```

## 填写原则

### 1. Status Summary

- 一句话，让下一个 session 的 Conductor 在 5 秒内理解当前状态
- 包含：需求 ID + pipeline_status + 关键进度

**好例子**：
> REQ-001 用户登录在 executing 阶段，Phase 1 和 Phase 2 已完成并通过 code-review，Phase 3（前端集成）的 Task 3.1 正在实现中。

**坏例子**：
> 我们在做登录功能。

### 2. Completed Since Last Handoff

- 列具体事项（文件、Phase、task），不列过程
- 只有真正完成的才写在这里

### 3. Current Blocker / Decision Needed

- 如果有阻塞，写明阻塞原因和需要谁做什么决策
- 如果无阻塞，写"无"
- 不要写"可能有问题"这种模糊描述

### 4. Next Steps for Next Session

- **可操作的指令**，下一个 session 的 Conductor 可以直接执行
- 包含具体文件路径和操作
- 如果当前需求接近完成，写清楚是继续推进还是需要 PM 验收

**好例子**：
> 1. 委派 Dev 完成 Task 3.2（对接后端登录 API），文件：`src/api/auth.ts`、`src/pages/Login.tsx`
> 2. 如 Task 3.2 完成，委派 Dev 做 Task 3.3（登录状态持久化）
> 3. Phase 3 完成后走 code-review，然后进入最终审查

**坏例子**：
> 继续做登录功能。

## 交接质量检查清单

- [ ] 下一个 Conductor 能否仅凭 handoff 就知道从哪开始？
- [ ] 是否引用了具体的文件路径和需求 ID？
- [ ] 阻塞项是否写明了决策人和决策点？
- [ ] Next Steps 是否是可操作的指令而非模糊的方向？
