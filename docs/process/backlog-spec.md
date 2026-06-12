# backlog-spec — backlog.csv 规范

`docs/backlog.csv` 是全项目需求的**状态真相源**。所有需求必须在 backlog 中有一条对应行。

## CSV 列定义

| 列名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 唯一标识符，格式：`REQ-{NNN}`（如 REQ-001），按创建顺序递增 |
| `name` | string | 是 | 需求的简短名称（中文或英文，不超过 50 字） |
| `description` | string | 是 | 需求的单行概述 |
| `pipeline_status` | enum | 是 | 当前所处阶段：`draft` / `designing` / `planning` / `executing` / `acceptance` / `done` |
| `复杂度` | enum | 是 | `S` / `M` / `L`（见下方定义） |
| `阻塞原因` | string | 否 | 若需求被阻塞，填写具体原因和决策点；解除后清空 |
| `文档` | string | 否 | PRD/需求文档所在目录路径，如 `docs/requirements/REQ-001/`；planning 阶段前必填 |
| `version` | string | 是 | 需求所属版本号，如 `v1.0`、`v1.1` |
| `priority` | string | 是 | 优先级：`P0`（阻塞发布）/ `P1`（高优先）/ `P2`（常规）/ `P3`（低优先） |
| `created_date` | date | 是 | 创建日期，格式 `YYYY-MM-DD` |
| `updated_date` | date | 是 | 最后更新日期，格式 `YYYY-MM-DD` |

## 枚举值规范

### pipeline_status

```
draft → designing → planning → executing → acceptance → done
```

- `draft`：需求已录入，尚未开始产品设计
- `designing`：PM 正在编写 PRD/讨论需求
- `planning`：Conductor 正在进行技术准备（架构设计、任务拆解）
- `executing`：Dev 正在实现
- `acceptance`：等待 PM 验收（必须暂停）
- `done`：已完成

### 复杂度

| 等级 | 定义 | pipeline 路径 |
|------|------|-------------|
| **S** | 单文件小改动，无架构影响，无 UI 变更 | `draft → executing → acceptance → done`（跳过 designing/planning） |
| **M** | 2-3 个文件的改动，可能有 UI 变更，不涉及架构 | 完整路径 |
| **L** | 跨模块改动，涉及架构决策或破坏性变更 | 完整路径 + 架构合规审查 |

## 操作规范

- **读取**：Conductor 在 Session 开始时读取，关注 `pipeline_status` 不为 `draft` 或 `done` 的条目
- **写入**：推进 pipeline 时更新 `pipeline_status` 和 `阻塞原因`；PM 更新需求和文档列
- **阻塞**：填写 `阻塞原因` 时保持 `pipeline_status` 不变
- **幂等**：同一条目不重复创建，通过 `id` 唯一约束

## 示例

```csv
id,name,description,pipeline_status,复杂度,阻塞原因,文档,version,priority,created_date,updated_date
REQ-001,用户登录,实现邮箱+密码登录功能,planning,M,,docs/requirements/REQ-001/,v1.0,P0,2026-06-10,2026-06-12
REQ-002,用户头像上传,支持用户上传和裁剪头像,draft,S,,,v1.0,P1,2026-06-11,2026-06-11
REQ-003,数据看板,后台管理的数据可视化看板,planning,L,需PM确认图表类型选型,scope_tradeoff,docs/requirements/REQ-003/,v1.0,P1,2026-06-09,2026-06-12
```
