# 道生匯 - 卡管理前端

基于设计稿实现的 Next.js + Tailwind CSS 前端系统，包含钱包、常规卡、3D 卡、3D-1 卡、账户等模块。

## 技术栈

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**（Radix UI + Tailwind，基础组件如 Button、Sheet）
- **TanStack Query**（异步数据、缓存与 Loading 状态）
- **TanStack Table**（数据表格：分页、筛选、排序、粘性列）
- **React Hook Form + Zod**（表单与校验，可接入跨境支付等校验）

## 快速开始

```bash
# 安装依赖
npm install

# 开发
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)，默认会跳转到「我的钱包」页。未登录时可访问 [http://localhost:3000/login](http://localhost:3000/login) 登录页。

## 已实现页面

- **登录**: 账号登录（手机号/邮箱 + 密码）、忘记密码（占位）
- **钱包**: 我的钱包（仪表盘）、账户明细、资金划转、转账管理
- **常规卡**: 持卡人信息、卡管理、开卡、充值记录、交易明细、退款明细、手续费明细、销卡列表
- **3D 卡 / 3D-1 卡**: 持卡人信息、卡管理、开卡（占位）
- **账户**: 实名认证（三步表单 + 企业信息）、密码设置、子账户、安全验证

## 项目结构（功能驱动）

```
src/
├── app/                  # Next.js 路由
│   ├── (dashboard)/     # 后台布局下的所有页面
│   ├── layout.tsx
│   ├── providers.tsx    # QueryClient 等全局 Provider
│   └── globals.css
├── components/           # 通用组件
│   ├── ui/               # shadcn 基础组件 (Button, Sheet)
│   ├── Header.tsx
│   ├── Sidebar.tsx      # 桌面端固定侧栏
│   ├── SidebarNavContent.tsx  # 侧栏导航（桌面 + 移动 Sheet 复用）
│   ├── DashboardLayout.tsx
│   ├── DataTable.tsx    # 基于 TanStack Table，支持粘性首/末列
│   ├── SecretText.tsx   # 敏感信息脱敏，点击眼睛图标按需拉取真实数据
│   └── Pagination.tsx
├── features/             # 核心业务模块
│   ├── cards/            # 开卡/卡片管理
│   ├── transactions/     # 流水查询
│   └── settlement/       # 结算逻辑
├── hooks/                # 全局自定义 Hook
├── lib/                  # 工具（如 cn、后续 PingPong API 封装）
└── types/                # TypeScript 接口
```

## 设计说明

- 顶部导航：品牌「道生匯」、主账户、用户信息；移动端通过菜单按钮打开左侧 Sheet 抽屉。
- 左侧菜单：桌面端为可折叠固定侧栏（`md` 及以上）；移动端为 Sheet（Drawer），保证手机端可紧急处理拒付/审核。
- 数据表格：使用 TanStack Table，支持首列（如卡号）、末列（如操作）粘性固定。
- 敏感信息：卡号、余额等可用 `SecretText` 组件默认脱敏显示，点击眼睛图标后通过 React Query 请求真实数据。

界面参考 `design_source/` 目录下的设计图。数据目前为前端占位或静态示例，后续可接入 API。
