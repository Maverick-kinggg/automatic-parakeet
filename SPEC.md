# PROJECT_SPEC.md
此文件由 AI 在首次生成时自动创建，记录系统功能、数据模型和接口协议。
面向对象：用户（确认需求）+ AI（执行时的业务约束）
注意：技术栈选型、代码规范、框架约束等内容由 system prompt 负责，不在此文件中描述。
生成时间：2026-05-10 11:36

## 1. 项目基本信息

| 字段 | 值 |
|---|---|
| 项目名称 | 图纸云档 - 企业图纸数字化管理平台 |
| 需求摘要 | 支持图纸上传、在线预览、分类管理、安全下载的企业级图纸管理系统 |
| 开发模式 | 全栈应用（前端 + 后端服务 + 数据库） |
| 创建时间 | 2026-05-10 |
| 最后更新 | 2026-05-10 |

---

## 2. 产品设计方案

### 2.1 项目概述

「图纸云档」企业图纸数字化管理平台
专为企业打造的图纸全生命周期管理系统，支持在线预览、版本管理、分类归档和安全下载

**整体调性**

- **配色**：科技蓝 `hsl(210, 84%, 54%)` + 专业灰 `hsl(215, 16%, 47%)`，传递专业可靠的技术感
- **字体**：Inter + 思源黑体，确保技术文档的可读性和现代感
- **氛围**：高效、专业、秩序井然
- **节奏/密度**：中等偏紧凑的信息密度，表格行高 48px，卡片内边距 16px

**设计宪法**

_默认原则（所有项目必须遵守）：_

1. **精致感底线** — 视觉呈现必须达到专业产品级标准，禁止粗糙拼凑
2. **像素对齐** — 所有元素必须严格对齐到网格系统，禁止肉眼可见的偏移
3. **系统化圆角** — 同层级元素使用统一的圆角规格（卡片 8px、按钮 6px、标签 4px）
4. **留白有节奏** — 相邻模块间距遵循递进关系（8/16/24/32/48px）

_项目特定原则：_

5. **文件优先** — 图纸缩略图和文件名始终处于视觉焦点，操作按钮次之
6. **预览即时** — 点击图纸后 3 秒内必须展示预览内容，加载状态清晰可见
7. **安全可控** — 删除、批量操作等危险动作必须有二次确认和明确提示
8. **层级清晰** — 图纸分类树、列表、详情三层结构导航路径明确

### 2.2 模块结构与页面路由

### 仪表盘 `/`

- **页面类型**：Dashboard
- **核心功能**：数据统计概览、最近访问图纸、快捷上传入口、分类统计
- **数据维度**：图纸总数、今日上传数、存储空间用量、热门分类 Top5、最近访问记录
- **主要交互**：点击统计卡片跳转对应列表；拖拽上传区域；最近访问快捷入口

### 图纸管理 `/drawings`

- **页面类型**：列表页 + 详情页
- **核心功能**：图纸列表展示、多条件筛选、关键字搜索、批量操作、上传新建
- **数据维度**：图纸名称、编号、版本号、分类、文件大小、格式、上传者、上传时间、下载次数
- **主要交互**：点击行打开预览抽屉；复选框多选；浮动上传按钮；筛选栏展开收起
- **状态定义**：草稿/已发布/已归档/已废弃，用 Badge 颜色区分

### 分类管理 `/categories`

- **页面类型**：树形列表页
- **核心功能**：分类树展示、新建/编辑分类、拖拽排序、分类统计
- **数据维度**：分类名称、编码、父级分类、排序号、包含图纸数量
- **主要交互**：树节点展开收起；右键菜单操作；拖拽调整顺序

### 下载记录 `/downloads`

- **页面类型**：列表页
- **核心功能**：下载历史查询、导出记录、统计图表
- **数据维度**：图纸名称、下载人、下载时间、IP 地址、操作类型
- **主要交互**：时间范围筛选；导出 Excel；点击图纸名称跳转预览

### 2.3 信息架构与导航体系

### 整体布局

- **模式**：侧边栏 + 顶部栏（Sidebar 贴边式）
- **侧边栏**：header 区域包含 logo 和"图纸云档"名称；footer 区域包含当前用户头像、姓名、账号
- **顶部栏**：左侧面包屑导航、全局搜索框、右侧上传按钮和用户菜单
- **内容区**：最大宽度 1440px，左右内边距 24px

### 主导航结构

| 导航项 | 图标 | 路由 | 可见条件 |
|--------|------|------|----------|
| 仪表盘 | LayoutDashboard | / | 全部 |
| 图纸管理 | FileText | /drawings | 全部 |
| 分类管理 | FolderTree | /categories | 管理员 |
| 下载记录 | Download | /downloads | 全部 |

### 响应式策略

- **桌面**（≥1280）：完整侧边栏（240px）+ 双栏布局
- **平板**（768–1279）：侧边栏自动收起为图标条（64px）
- **手机**（<768）：底部 Tab 导航，隐藏部分次要功能

### 2.4 设计系统定义

### 视觉 DNA

1. **文件卡片母题**
   - **类型**：形态 + 阴影
   - **形式描述**：图纸卡片采用 4:3 宽高比，左上角显示文件格式标签（PDF/DWG），右下角显示版本号徽章
   - **出现位置**：仪表盘最近访问、图纸列表网格视图
   - **品牌含义**：专业档案管理，秩序感和可追溯性

2. **蓝色聚焦环**
   - **类型**：色彩 + 交互反馈
   - **形式描述**：所有可交互元素获得焦点时显示 2px 蓝色光环 `ring-2 ring-blue-500`
   - **出现位置**：按钮、输入框、可点击卡片
   - **品牌含义**：清晰的操作反馈，降低误操作

### 色彩系统

```css
/* 主色 */
--primary: hsl(210, 84%, 54%);       /* #2563eb */
--primary-hover: hsl(210, 84%, 45%);
--primary-light: hsl(210, 84%, 95%);

/* 语义色 */
--success: hsl(142, 71%, 45%);
--warning: hsl(38, 92%, 50%);
--danger: hsl(0, 84%, 60%);
--info: hsl(210, 84%, 54%);

/* 中性色阶 */
--bg-primary: hsl(0, 0%, 98%);       /* #fafafa */
--bg-card: hsl(0, 0%, 100%);         /* #ffffff */
--border: hsl(215, 16%, 90%);        /* #e5e7eb */
--text-primary: hsl(215, 28%, 17%);  /* #1f2937 */
--text-secondary: hsl(215, 16%, 47%); /* #6b7280 */
```

### 字体与排版

- **字体栈**：`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "思源黑体", sans-serif`
- **字号层级**：
  - 标题：24px (KPI 数字 32px tabular-nums)
  - 副标题：16px
  - 正文：14px
  - 辅助文字：12px
- **行高**：标题 1.3，正文 1.6

### 间距、圆角、阴影

- **圆角**：卡片 8px、按钮/输入框 6px、Tag/Badge4px
- **阴影**：
  - 卡片：`shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
  - 悬浮：`shadow-md` (0 4px 6px rgba(0,0,0,0.1))
  - 弹窗/抽屉：`shadow-xl` (0 10px 15px rgba(0,0,0,0.1))
- **卡片内边距**：默认 16px，紧凑模式 12px

### 布局

- **侧边栏**：背景 `bg-card`，宽度展开 240px/收起 64px，贴边无圆角，1px 右边框
- **顶部栏**：高度 56px，背景 `bg-card`，底部 1px 边框
- **内容区最大宽度**：1440px，内边距 24px
- **布局风格**：浅灰根背景 `bg-slate-50`，白色卡片，清晰分隔

### 组件规格

- **按钮**：高度 36px（小 32px，大 40px），padding-x 16px
- **输入框**：高度 36px，focus ring 2px blue-500
- **表格**：行高 48px，表头背景 slate-50，hover 行 bg-slate-50
- **Tag/Badge**：padding 4px 8px，字体 12px

### 图标

- **图标库**：Lucide React
- **关键映射**：
  - 仪表盘：`LayoutDashboard`
  - 图纸：`FileText`, `FileImage`
  - 分类：`FolderTree`, `Folder`
  - 下载：`Download`
  - 上传：`UploadCloud`
  - 预览：`Eye`
  - 删除：`Trash2`

### 信息密度

- **判断**：中等偏紧凑（B 端工具效率优先）
- **具体参数**：表格行高 48px，卡片 padding 16px，正文字号 14px，列表模式每屏展示 15-20 条

### 2.5 交互模式与组件清单

### shadcn 组件（18 个）

`button`, `card`, `table`, `dialog`, `form`, `input`, `select`, `badge`, `dropdown-menu`, `tabs`, `skeleton`, `toast`, `sheet`, `alert-dialog`, `checkbox`, `scroll-area`, `separator`, `tooltip`

### 第三方库

- `@tanstack/react-table`（高级表格功能）
- `react-dropzone`（拖拽上传）
- `react-pdf`（PDF 在线预览）
- `date-fns`（日期处理）
- `zustand`（状态管理）

### 特殊交互说明

- **图纸预览抽屉**：从右侧滑出，宽度 80%，支持键盘左右键切换图纸
- **拖拽上传**：整个内容区可作为 drop zone，拖入文件自动弹出上传对话框
- **批量操作工具栏**：选中多个图纸后，列表顶部浮现操作栏（下载/移动/删除）
- **分类树拖拽**：支持拖拽分类节点调整层级和顺序

### 2.6 状态与边界设计

- **空状态**：插画（空文件夹图标）+ 文案"暂无图纸，点击上方上传或拖拽文件到此处" + 主操作按钮"上传图纸"
- **加载态**：列表用表格骨架屏（3 行），预览用整体骨架 + Spinner，按钮加载用 spinner + 禁用状态
- **错误态**：Toast 错误提示（红色）+ 重试按钮 + 错误详情可展开
- **空数据**：筛选无结果时显示"未找到匹配的图纸，尝试调整筛选条件" + 清空筛选按钮
- **上传进度**：进度条对话框，显示文件名、进度百分比、剩余时间、取消按钮
- **预览失败**：显示错误占位图 + "无法预览此格式，可直接下载查看" + 下载按钮

---

## 3. 前端技术设计

### 3.1 技术栈

- **Language**: TypeScript 5 (strict mode)
- **Framework**: React 18 (functional components + hooks)
- **UI Library**: shadcn/ui (pre-installed in `src/components/ui/`)
- **Styling**: Tailwind CSS v3
- **Build Tool**: Vite 7
- **State Management**: Zustand
- **Routing**: React Router v7

### 3.2 目录结构

```
src/
├── app.tsx                     # 应用入口和路由配置
├── main.tsx                    # React 渲染入口
├── app.css                     # 全局样式和 CSS 变量
├── components/
│   ├── ui/                     # shadcn 基础组件
│   ├── layout/
│   │   ├── AppSidebar.tsx      # 侧边栏布局
│   │   └── TopBar.tsx          # 顶部导航栏
│   ├── drawings/
│   │   ├── DrawingList.tsx     # 图纸列表组件
│   │   ├── DrawingCard.tsx     # 图纸卡片组件
│   │   ├── DrawingPreview.tsx  # 图纸预览组件
│   │   ├── DrawingUpload.tsx   # 图纸上传组件
│   │   └── DrawingFilters.tsx  # 图纸筛选组件
│   ├── categories/
│   │   ├── CategoryTree.tsx    # 分类树组件
│   │   └── CategoryForm.tsx    # 分类表单组件
│   └── dashboard/
│       ├── StatsCard.tsx       # 统计卡片组件
│       └── RecentDrawings.tsx  # 最近访问组件
├── pages/
│   ├── Dashboard.tsx           # 仪表盘页面
│   ├── Drawings.tsx            # 图纸管理页面
│   ├── Categories.tsx          # 分类管理页面
│   ├── Downloads.tsx           # 下载记录页面
│   └── NotFound.tsx            # 404 页面
├── hooks/
│   ├── useDrawings.ts          # 图纸数据钩子
│   ├── useCategories.ts        # 分类数据钩子
│   └── useUpload.ts            # 上传进度钩子
├── stores/
│   ├── drawingStore.ts         # 图纸状态管理
│   └── categoryStore.ts        # 分类状态管理
├── lib/
│   ├── api.ts                  # API 请求封装
│   └── utils.ts                # 工具函数
└── types/
    └── database.ts             # 数据库类型定义
```

### 3.3 核心组件设计

#### AppSidebar.tsx
- 使用 shadcn `Sidebar` 组件
- 包含应用 Logo、名称、主导航菜单
- Footer 显示当前用户信息
- 支持收起/展开状态

#### DrawingList.tsx
- 使用 `@tanstack/react-table` 实现高级表格
- 支持列表/网格视图切换
- 集成筛选、排序、分页功能
- 复选框多选 + 批量操作工具栏

#### DrawingPreview.tsx
- 使用 shadcn `Sheet` 组件实现抽屉
- 集成 `react-pdf` 预览 PDF 文件
- 支持键盘左右键切换图纸
- 显示图纸详细信息和元数据

#### DrawingUpload.tsx
- 使用 `react-dropzone` 实现拖拽上传
- 支持多文件同时上传
- 显示上传进度和取消操作
- 上传表单包含分类选择、版本号等字段

### 3.4 状态管理

#### drawingStore.ts
```typescript
interface DrawingState {
  drawings: Drawing[];
  selectedDrawing: Drawing | null;
  filters: DrawingFilters;
  isLoading: boolean;
  
  // Actions
  fetchDrawings: () => Promise<void>;
  selectDrawing: (drawing: Drawing) => void;
  setFilters: (filters: DrawingFilters) => void;
  uploadDrawing: (file: File, metadata: DrawingMetadata) => Promise<void>;
  deleteDrawing: (id: string) => Promise<void>;
}
```

### 3.5 路由配置

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'drawings', element: <Drawings /> },
      { path: 'categories', element: <Categories /> },
      { path: 'downloads', element: <Downloads /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
```

---

## 4. 鉴权策略 [LOCKED]

AUTH_STRATEGY: dingtalk-platform

依赖钉钉平台访问控制，不生成登录页，不使用 supabase.auth.* 相关 API

---

## 5. 数据模型 [LOCKED after first deploy]

### 5.1 表清单

| 表名（物理名） | 显示名 | 用途 |
|---|---|---|
| drawings | 图纸表 | 存储图纸文件的基本信息和元数据 |
| drawing_categories | 图纸分类表 | 存储图纸的分类层级结构 |
| drawing_versions | 图纸版本表 | 存储同一图纸的不同版本记录 |
| download_records | 下载记录表 | 记录图纸的下载历史 |

### 5.2 表结构详情

#### 图纸表（drawings）

用途：存储图纸文件的核心信息，包括文件名、格式、大小、存储路径、状态等

核心字段：
- id: SERIAL PRIMARY KEY  主键
- corp_id: VARCHAR(128)  企业 ID，用于数据隔离
- emp_id: VARCHAR(128)  上传者员工 ID
- name: VARCHAR(256) NOT NULL  图纸名称
- code: VARCHAR(64)  图纸编号（唯一标识）
- category_id: INTEGER  关联分类 ID
- file_path: VARCHAR(512) NOT NULL  文件存储路径
- file_name: VARCHAR(256) NOT NULL  原始文件名
- file_size: BIGINT  文件大小（字节）
- file_format: VARCHAR(16)  文件格式（PDF/DWG/DXF 等）
- version: VARCHAR(32) DEFAULT 'v1.0'  版本号
- status: VARCHAR(16) DEFAULT 'published'  状态：draft/published/archived/obsolete
- description: TEXT  图纸描述
- download_count: INTEGER DEFAULT 0  下载次数
- thumbnail_path: VARCHAR(512)  缩略图路径
- is_deleted: CHAR(1) DEFAULT 'n'  软删除标记
- created_at: TIMESTAMP DEFAULT NOW()  创建时间
- updated_at: TIMESTAMP DEFAULT NOW()  更新时间

关联关系：
- 关联 `drawing_categories` 表：多对一（一个分类包含多个图纸）
- 关联 `drawing_versions` 表：一对多（一个图纸有多个版本）
- 关联 `download_records` 表：一对多（一个图纸有多条下载记录）

#### 图纸分类表（drawing_categories）

用途：存储图纸的分类体系，支持多级树形结构

核心字段：
- id: SERIAL PRIMARY KEY  主键
- corp_id: VARCHAR(128)  企业 ID
- emp_id: VARCHAR(128)  创建人员工 ID
- name: VARCHAR(128) NOT NULL  分类名称
- code: VARCHAR(64)  分类编码
- parent_id: INTEGER  父级分类 ID（NULL 表示顶级分类）
- sort_order: INTEGER DEFAULT 0  排序号
- description: TEXT  分类描述
- drawing_count: INTEGER DEFAULT 0  包含的图纸数量
- is_deleted: CHAR(1) DEFAULT 'n'  软删除标记
- created_at: TIMESTAMP DEFAULT NOW()  创建时间
- updated_at: TIMESTAMP DEFAULT NOW()  更新时间

关联关系：
- 自关联：一对多（父分类包含多个子分类）
- 关联 `drawings` 表：一对多（一个分类包含多个图纸）

#### 图纸版本表（drawing_versions）

用途：记录同一图纸的历史版本，支持版本追溯和对比

核心字段：
- id: SERIAL PRIMARY KEY  主键
- corp_id: VARCHAR(128)  企业 ID
- emp_id: VARCHAR(128)  版本创建人员工 ID
- drawing_id: INTEGER NOT NULL  关联图纸 ID
- version: VARCHAR(32) NOT NULL  版本号（如 v1.0, v2.0）
- file_path: VARCHAR(512) NOT NULL  版本文件路径
- file_name: VARCHAR(256) NOT NULL  版本文件名
- file_size: BIGINT  文件大小
- change_description: TEXT  变更说明
- is_current: CHAR(1) DEFAULT 'n'  是否为当前版本
- is_deleted: CHAR(1) DEFAULT 'n'  软删除标记
- created_at: TIMESTAMP DEFAULT NOW()  创建时间
- updated_at: TIMESTAMP DEFAULT NOW()  更新时间

关联关系：
- 关联 `drawings` 表：多对一（多个版本属于一个图纸）

#### 下载记录表（download_records）

用途：记录每次图纸下载的详细信息，用于审计和统计

核心字段：
- id: SERIAL PRIMARY KEY  主键
- corp_id: VARCHAR(128)  企业 ID
- emp_id: VARCHAR(128) NOT NULL  下载人员工 ID
- drawing_id: INTEGER NOT NULL  关联图纸 ID
- download_time: TIMESTAMP DEFAULT NOW()  下载时间
- ip_address: VARCHAR(64)  下载 IP 地址
- user_agent: TEXT  用户代理
- is_deleted: CHAR(1) DEFAULT 'n'  软删除标记
- created_at: TIMESTAMP DEFAULT NOW()  创建时间
- updated_at: TIMESTAMP DEFAULT NOW()  更新时间

关联关系：
- 关联 `drawings` 表：多对一（多条记录对应一个图纸）

---

## 6. API 接口协议 [LOCKED]

### 6.1 统一响应格式

成功：`{ success: true, data: T }`
失败：`{ success: false, error: string }`

### 6.2 接口标注规范

@NeedLogin：需要有效的用户身份，前端必须携带 Authorization header
无标注：公开接口，前端仍需携带 token（由 apiFetch 统一注入）

### 6.3 接口清单

#### 仪表盘 相关

页面路径：`/`

获取统计数据 @NeedLogin
GET `/api/dashboard/stats`
Response:
  total_drawings: INTEGER  图纸总数
  today_uploads: INTEGER  今日上传数
  storage_used: BIGINT  存储空间用量（字节）
  top_categories: ARRAY[{category_id, category_name, count}]  热门分类 Top5

获取最近访问 @NeedLogin
GET `/api/dashboard/recent`
Query Params:
  limit: INTEGER DEFAULT 10
Response:
  drawings: ARRAY<Drawing>  最近访问的图纸列表

#### 图纸管理 相关

页面路径：`/drawings`

获取图纸列表 @NeedLogin
GET `/api/drawings?category_id=&keyword=&status=&page=&limit=`
Query Params:
  category_id: INTEGER  分类 ID 筛选
  keyword: VARCHAR  关键字搜索（名称/编号）
  status: VARCHAR  状态筛选
  page: INTEGER DEFAULT 1  页码
  limit: INTEGER DEFAULT 20  每页数量
Response:
  list: ARRAY<Drawing>  图纸列表
  total: INTEGER  总记录数
  page: INTEGER  当前页码
  limit: INTEGER  每页数量

获取图纸详情 @NeedLogin
GET `/api/drawings/:id`
Path Params:
  id: INTEGER  图纸 ID
Response:
  drawing: Drawing  图纸详细信息

创建图纸 @NeedLogin
POST `/api/drawings`
Request Body:
  name: VARCHAR(256)  图纸名称
  code: VARCHAR(64)  图纸编号
  category_id: INTEGER  分类 ID
  file_path: VARCHAR(512)  文件路径
  file_name: VARCHAR(256)  文件名
  file_size: BIGINT  文件大小
  file_format: VARCHAR(16)  文件格式
  version: VARCHAR(32)  版本号
  description: TEXT  描述
Response:
  drawing: Drawing  创建的图纸信息

更新图纸 @NeedLogin
PUT `/api/drawings/:id`
Path Params:
  id: INTEGER  图纸 ID
Request Body:
  name: VARCHAR(256)  图纸名称
  code: VARCHAR(64)  图纸编号
  category_id: INTEGER  分类 ID
  status: VARCHAR(16)  状态
  description: TEXT  描述
  version: VARCHAR(32)  版本号
Response:
  drawing: Drawing  更新后的图纸信息

删除图纸 @NeedLogin
DELETE `/api/drawings/:id`
Path Params:
  id: INTEGER  图纸 ID
Response:
  success: BOOLEAN

批量删除图纸 @NeedLogin
DELETE `/api/drawings/batch`
Request Body:
  ids: ARRAY<INTEGER>  图纸 ID 列表
Response:
  success: BOOLEAN

获取文件下载链接 @NeedLogin
GET `/api/drawings/:id/download`
Path Params:
  id: INTEGER  图纸 ID
Response:
  download_url: VARCHAR  临时下载链接（有效期 1 小时）

#### 分类管理 相关

页面路径：`/categories`

获取分类树 @NeedLogin
GET `/api/categories/tree`
Response:
  categories: ARRAY<CategoryNode>  树形结构的分类列表

获取分类列表 @NeedLogin
GET `/api/categories`
Response:
  categories: ARRAY<Category>  扁平分类列表

创建分类 @NeedLogin
POST `/api/categories`
Request Body:
  name: VARCHAR(128)  分类名称
  code: VARCHAR(64)  分类编码
  parent_id: INTEGER  父级分类 ID
  sort_order: INTEGER  排序号
  description: TEXT  描述
Response:
  category: Category  创建的分类信息

更新分类 @NeedLogin
PUT `/api/categories/:id`
Path Params:
  id: INTEGER  分类 ID
Request Body:
  name: VARCHAR(128)  分类名称
  code: VARCHAR(64)  分类编码
  parent_id: INTEGER  父级分类 ID
  sort_order: INTEGER  排序号
  description: TEXT  描述
Response:
  category: Category  更新后的分类信息

删除分类 @NeedLogin
DELETE `/api/categories/:id`
Path Params:
  id: INTEGER  分类 ID
Response:
  success: BOOLEAN

#### 下载记录 相关

页面路径：`/downloads`

获取下载记录列表 @NeedLogin
GET `/api/downloads?drawing_id=&start_date=&end_date=&page=&limit=`
Query Params:
  drawing_id: INTEGER  图纸 ID 筛选
  start_date: DATE  开始日期
  end_date: DATE  结束日期
  page: INTEGER DEFAULT 1  页码
  limit: INTEGER DEFAULT 20  每页数量
Response:
  list: ARRAY<DownloadRecord>  下载记录列表
  total: INTEGER  总记录数
  page: INTEGER  当前页码
  limit: INTEGER  每页数量

导出下载记录 @NeedLogin
GET `/api/downloads/export?start_date=&end_date=`
Query Params:
  start_date: DATE  开始日期
  end_date: DATE  结束日期
Response:
  file_url: VARCHAR  Excel 文件下载链接

---

## 7. 业务组件清单

| 组件名 | 文件路径 | 来源 | 关联页面 | 功能说明 |
|---|---|---|---|---|
| AppSidebar | src/components/layout/AppSidebar.tsx | 自研 | 全局 | 侧边栏导航布局 |
| TopBar | src/components/layout/TopBar.tsx | 自研 | 全局 | 顶部导航栏 |
| DrawingList | src/components/drawings/DrawingList.tsx | 自研 | 图纸管理 | 图纸列表表格/网格视图 |
| DrawingCard | src/components/drawings/DrawingCard.tsx | 自研 | 图纸管理/仪表盘 | 图纸卡片展示组件 |
| DrawingPreview | src/components/drawings/DrawingPreview.tsx | 自研 | 图纸管理 | 图纸预览抽屉 |
| DrawingUpload | src/components/drawings/DrawingUpload.tsx | 自研 | 图纸管理 | 图纸上传对话框 |
| DrawingFilters | src/components/drawings/DrawingFilters.tsx | 自研 | 图纸管理 | 图纸筛选工具栏 |
| CategoryTree | src/components/categories/CategoryTree.tsx | 自研 | 分类管理 | 分类树形展示组件 |
| CategoryForm | src/components/categories/CategoryForm.tsx | 自研 | 分类管理 | 分类新建/编辑表单 |
| StatsCard | src/components/dashboard/StatsCard.tsx | 自研 | 仪表盘 | 数据统计卡片 |
| RecentDrawings | src/components/dashboard/RecentDrawings.tsx | 自研 | 仪表盘 | 最近访问图纸列表 |

---

## 8. 迭代变更记录

| 时间 | 变更类型 | 变更内容 | 变更原因 |
|---|---|---|---|
| 2026-05-10 | 初始化 | 首次生成 | 用户需求：搭建图纸管理系统，支持图纸的在线预览和下载 |
