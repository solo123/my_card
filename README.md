# 聚實匯 - 卡管理前端

基于设计稿实现的 Next.js + Tailwind CSS 前端系统，包含钱包、常规卡、3D 卡、3D-1 卡、账户等模块。

## 技术栈

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**

## 快速开始

```bash
# 安装依赖
npm install

# 开发
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)，默认会跳转到「我的钱包」页。

## 已实现页面

- **钱包**: 我的钱包（仪表盘）、账户明细、资金划转、转账管理
- **常规卡**: 持卡人信息、卡管理、开卡、充值记录、交易明细、退款明细、手续费明细、销卡列表
- **3D 卡 / 3D-1 卡**: 持卡人信息、卡管理、开卡（占位）
- **账户**: 实名认证（三步表单 + 企业信息）、密码设置、子账户、安全验证

## 项目结构

```
src/
├── app/
│   ├── (dashboard)/     # 后台布局下的所有页面
│   │   ├── wallet/        # 我的钱包
│   │   ├── fund-transfer/
│   │   ├── transfer-management/
│   │   ├── cardholder/
│   │   ├── card-management/
│   │   ├── open-card/     # 开卡表单
│   │   ├── recharge-record/
│   │   ├── transaction-details/
│   │   ├── refund-details/
│   │   ├── verify/        # 实名认证
│   │   └── 3d/ 3d1/       # 3D 卡相关
│   ├── layout.tsx
│   └── globals.css
└── components/
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── DashboardLayout.tsx
    ├── DataTable.tsx
    └── Pagination.tsx
```

## 设计说明

界面参考 `design_source/` 目录下的设计图，包含：

- 顶部导航：品牌「聚實匯」、主账户、用户信息
- 左侧可折叠菜单：钱包、常规卡、3D 卡、3D-1 卡、账户
- 主内容区：各业务页（表格 + 筛选 + 分页、表单、仪表盘等）

数据目前为前端占位或静态示例，后续可接入 API。
