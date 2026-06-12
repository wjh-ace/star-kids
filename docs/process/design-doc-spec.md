# design-doc-spec — 设计文档规范

本规范定义了项目中各类设计文档的结构和最小内容要求。

## 文档类型

| 文档 | 路径 | 作者 | 用途 |
|------|------|------|------|
| `prd.md` | `docs/requirements/{REQ-ID}/prd.md` | PM | 产品需求文档 |
| `tech-design.md` | `docs/requirements/{REQ-ID}/tech-design.md` | Architect | 技术方案设计 |
| `acceptance.md` | `docs/requirements/{REQ-ID}/acceptance.md` | Conductor | 验收包（质量门控证据） |

---

## prd.md 规范

### 最小结构

```markdown
# {需求名称} — PRD

## 背景与动机
{为什么要做这个需求，解决什么问题}

## 用户故事
- 作为 {角色}，我希望 {功能}，以便 {价值}

## 功能描述
{详细的功能说明，包括交互流程、状态变化、边界条件}

## 成功标准
{验收条件列表，可量化}
- [ ] {条件 1}
- [ ] {条件 2}

## 非功能需求
- 性能：{如适用}
- 安全：{如适用}
- 兼容性：{如适用}

## Scope 边界
- 做什么：{明确包含}
- 不做什么：{明确排除}
```

### 质量标准
- 成功标准必须可测试（不能是"用户体验好"这类主观描述）
- Scope 边界必须明确——宁可多写"不做什么"，不要留模糊地带

---

## tech-design.md 规范

### 最小结构

```markdown
# {需求名称} — 技术方案

## 方案概述
{一段话概述技术方案的核心思路}

## 涉及模块
| 模块/文件 | 变更类型 | 说明 |
|-----------|---------|------|
| src/auth/login.ts | 新增 | 登录接口实现 |

## 数据流 / 调用链
{描述关键的数据流或调用链变化}

## 关键决策与 Trade-off
| 决策点 | 选项 A | 选项 B | 选择 | 理由 |
|--------|--------|--------|------|------|

## impact_scope

| 字段 | 值 | 说明 |
|------|-----|------|
| ux_surface | yes/no | {如 yes，描述涉及的用户可见变更} |
| product_contract_change | yes/no | {如 yes，描述需要改动的产品承诺} |
| structural_change | yes/no | {如 yes，描述涉及的架构变更} |
| scope_tradeoff | yes/no | {如 yes，描述需要 PM 做的取舍决策} |

## 技术风险
| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|

## Phase / Task 建议
{Architect 对执行计划的建议，供 Conductor 参考}
```

### impact_scope 填写说明

**这是 Conductor 做暂停判断的核心输入，必须认真填写。**

- `ux_surface: yes` → 触发 UX Evaluator 审查（不因其暂停，但增加审查步骤）
- `product_contract_change: yes` → **必须暂停等 PM 确认**
- `structural_change: yes` → 不自动暂停，但会触发 architecture-guard 审查
- `scope_tradeoff: yes` → **必须暂停等 PM 决策**

---

## acceptance.md 规范

### 时机
Conductor 在所有 Phase 完成、最终审查硬门槛检查通过后创建/更新。

### 最小结构

```markdown
# {需求名称} — 验收包

## 交付物清单
| 交付物 | 路径 | 状态 |
|--------|------|------|
| {Phase 1 变更} | {文件列表} | ✅ |

## Quality Gate（硬门槛）

| # | 门槛项 | 结果 | 证据来源 |
|---|--------|------|----------|
| 1 | 功能完整 | ✅ PASS / ❌ FAIL | Current Plan 所有 task 已完成 |
| 2 | 代码质量 | ✅ PASS / ❌ FAIL | code-reviewer 报告（{日期}）：0 CRITICAL, 0 HIGH |
| 3 | 架构合规 | ✅ PASS / ❌ FAIL / N/A | architecture-guard 报告（{日期}）：0 blocker |
| 4 | 类型安全 | ✅ PASS / ❌ FAIL | tsc --noEmit：通过 |
| 5 | 测试通过 | ✅ PASS / ❌ FAIL | pytest/npm test：{N} passed |
| 6 | 体验质量 | ✅ PASS / ❌ FAIL / N/A | UX Evaluator 报告（{日期}）：0 blocker |

## 已知限制（软门槛）

{非 blocker 的 findings 列表，包括 MEDIUM/LOW code-review findings、测试补强建议、可接受限制}

| 来源 | 严重度 | 描述 |
|------|--------|------|
| code-review | MEDIUM | formatDate 与 formatDateStr 功能重复 |
```

### quality gate 填写规则
- 每项必须引用明确的证据来源（文件名、日期、关键数据）
- "N/A" 仅用于不适用于当前需求的项（如 S 级需求可能不需要架构合规审查）
- 软门槛项必须全部列出——它们是 PM 验收决策的重要参考
