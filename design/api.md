# 道生匯 - 卡台前端 API 接口文档

本文档描述道生匯卡管理前端系统所需的后端 API 接口，供前后端联调与后端实现参考。  
约定：除特别说明外，请求均为 JSON，响应为 JSON；分页统一采用 `page`（从 1 开始）、`pageSize`；列表响应统一包含 `list`、`total`。

---

## 一、通用约定

### 1.1 基础 URL

- 开发环境：`/api` 或由环境变量配置的 `NEXT_PUBLIC_API_BASE`
- 生产环境：由部署配置

### 1.2 认证方式

- 登录后使用 **JWT**：请求头 `Authorization: Bearer <accessToken>`
- 刷新令牌使用 **refreshToken**（登录响应中返回），调用 `POST /api/auth/refresh` 时在请求头携带 `Authorization: Bearer <refreshToken>`
- 除登录、忘记密码、发送重置链接等公开接口外，其余接口均需认证；未认证建议返回 `401`

### 1.3 统一响应结构

**成功：**

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**失败：**

```json
{
  "code": 400,
  "message": "错误描述",
  "data": null
}
```

**分页列表 data 结构：**

```json
{
  "list": [ ... ],
  "total": 100
}
```

### 1.4 通用查询参数（列表类接口）

| 参数       | 类型   | 说明           |
| ---------- | ------ | -------------- |
| page       | number | 页码，从 1 开始 |
| pageSize   | number | 每页条数，默认 10 |

---

## 二、认证 (Auth)

### 2.1 登录

- **接口**: `POST /api/auth/login`
- **说明**: 手机号/邮箱 + 密码登录
- **请求体**:

```json
{
  "account": "手机号或邮箱",
  "password": "密码"
}
```

- **响应 data**:

```json
{
  "token": "JWT access token",
  "refreshToken": "JWT refresh token",
  "expiresIn": 7200,
  "user": {
    "id": 1,
    "mobile": "手机号",
    "email": "邮箱",
    "realName": "真实姓名",
    "avatar": "头像 URL（可选）"
  }
}
```

### 2.2 登出

- **接口**: `POST /api/auth/logout`
- **说明**: 需携带 access token；JWT 无状态下服务端可不维护黑名单，客户端删除本地 `token` / `refreshToken` 即可

### 2.3 忘记密码 - 发送重置链接

- **接口**: `POST /api/auth/forgot-password`
- **请求体**:

```json
{
  "email": "注册邮箱"
}
```

- **响应 data**: 可为 `{ "sent": true }` 或简单成功信息（不暴露邮箱是否存在）

### 2.4 刷新 Token（可选）

- **接口**: `POST /api/auth/refresh`
- **请求头**: `Authorization: Bearer <refreshToken>` 或按现有方案
- **响应 data**:

```json
{
  "token": "新的 access token",
  "refreshToken": "新的 refresh token（轮换签发）",
  "expiresIn": 7200
}
```

### 2.5 获取当前用户信息

- **接口**: `GET /api/auth/me`
- **说明**: 用于顶栏展示主账户、头像等
- **响应 data**:

```json
{
  "id": 1,
  "mobile": "手机号",
  "email": "邮箱",
  "realName": "真实姓名",
  "avatar": "头像 URL（可选）"
}
```

---

## 三、钱包 (Wallet)

### 3.1 我的钱包概览

- **接口**: `GET /api/wallet/overview`
- **说明**: 仪表盘用：主账户钱包余额、冻结、充值/消费/提理汇总、卡消费统计、各卡包余额及拒付率/退款率等
- **响应 data**:

```json
{
  "walletAccountId": "32683826",
  "maskedCardNumber": "6666 **** **** 8888",
  "balance": "55.70",
  "frozenAmount": "0.00",
  "totalRecharge": "77250.00",
  "totalConsume": "0.00",
  "totalWithdraw": "0.00",
  "cardStats": [
    {
      "cardType": "regular",
      "label": "常规卡",
      "balance": "8910.00",
      "transferIn": "0.00",
      "consume": "0.00",
      "refund": "0.00",
      "disputeRate": "0%",
      "disputeCount": "0",
      "disputeTotal": "6791",
      "refundRate": "0%",
      "refundAmountRate": "0%"
    }
  ]
}
```

- `cardStats` 可包含 `regular`、`3d`、`3d1` 三种卡类型，前端按「常规卡/3D卡/3D-1卡」展示。

### 3.2 账户明细

- **接口**: `GET /api/wallet/account-details`
- **参数**: `page`, `pageSize`, 可选 `startDate`, `endDate`, `type`（收入/支出/全部）
- **响应 data**: 分页结构；list 项建议包含：`id`, `type`, `amount`, `balanceAfter`, `remark`, `createdAt`

### 3.3 资金划转

- **列表**: `GET /api/wallet/fund-transfers`
- **参数**: `page`, `pageSize`, 可选 `startDate`, `endDate`, `status`
- **响应 list 项**: `id`, `initiator`, `recipient`, `amount`, `fee`, `actual`, `status`, `reviewer`, `reviewTime`, `createTime`

- **新增划转**: `POST /api/wallet/fund-transfers`
- **请求体**: `recipientAccount`, `amount`, `remark` 等（按业务定义）

### 3.4 转账管理

- **接口**: `GET /api/wallet/transfer-management`
- **参数**: `page`, `pageSize`, 可选 `realName`, `account`, `paymentStatus`, `startDate`, `endDate`
- **响应 list 项**: `id`, `realName`, `account`, `amount`, `rate`, `type`, `paymentStatus`, `approvalTime`, `paymentTime`, `updateTime`

---

## 四、常规卡 (Cards - Regular)

以下接口均针对「常规卡」；3D 卡、3D-1 卡可复用同一套接口并通过 `cardType=3d` / `cardType=3d1` 区分，或使用独立路径如 `/api/cards/3d/...`。

### 4.1 持卡人列表

- **接口**: `GET /api/cards/cardholders`
- **参数**: `page`, `pageSize`, 可选 `subAccount`, `firstName`, `lastName`
- **响应 list 项**: `id`, `subAccount`, `firstName`, `lastName`, `countryCode`, `state`, `city`, `address`, `zip`, `remark`

### 4.2 持卡人新建

- **接口**: `POST /api/cards/cardholders`
- **请求体**: `subAccount`, `firstName`, `lastName`, `countryCode`, `state`, `city`, `address`, `zip`, `remark`（均为必填字符串，`remark` 可为空串）
- **响应 data**: 单条持卡人对象（同列表项）

### 4.3 持卡人详情

- **接口**: `GET /api/cards/cardholders/:id`
- **响应 data**: 单条持卡人对象

### 4.4 持卡人编辑

- **接口**: `PUT /api/cards/cardholders/:id`
- **请求体**: 与列表项字段一致（可部分更新）

### 4.5 持卡人删除

- **接口**: `DELETE /api/cards/cardholders/:id`
- **响应 data**: 如 `{ "ok": true, "id": 123 }`

### 4.6 卡管理 - 卡片列表（分页+筛选）

- **接口**: `GET /api/cards/list`
- **参数**: `page`, `pageSize`, 可选 `cardNumber`（支持模糊）, `balanceMin`, `status`
- **响应 list 项**:

```json
{
  "id": 1566,
  "subAccount": "",
  "effectiveDate": "2026/02/23",
  "expireDate": "2026/05/23",
  "balance": "916.07",
  "rechargeAmount": "-",
  "alias": "点击设置别名",
  "cardholder": "Sheri",
  "status": "active"
}
```

- 前端表格中「卡片余额」可脱敏展示，点击眼睛再拉取真实余额（见 4.8）。

### 4.8 敏感信息 - 卡余额（按需拉取）

- **接口**: `GET /api/cards/:cardId/balance`
- **说明**: 用于 SecretText 组件点击「显示」时请求真实余额；建议短时缓存（如 30s）或一次性展示后前端缓存
- **响应 data**: `{ "balance": "916.07", "currency": "USD" }`

### 4.9 敏感信息 - CVV（按需拉取）

- **接口**: `GET /api/cards/:cardId/cvv`
- **说明**: 点击「查看CVV密码」时调用；建议一次性返回或短时有效
- **响应 data**: `{ "cvv": "123" }` 或脱敏展示规则由后端定

### 4.10 卡别名设置

- **接口**: `PATCH /api/cards/:cardId`
- **请求体**: `{ "alias": "新别名" }`

### 4.11 开卡

- **接口**: `POST /api/cards/open`
- **请求体**（与开卡表单一致）:

```json
{
  "validityStart": "2026-03-08",
  "validityEnd": "2026-06-08",
  "rechargeAmount": "1000.00",
  "scope": "广告投放",
  "region": "香港",
  "cardPrefix": "49109000",
  "cardType": "visa"
}
```

- **响应 data**: `{ "cardId": 1567, "status": "pending" }` 或直接返回卡信息（视流程而定）

### 4.12 充值记录

- **接口**: `GET /api/cards/recharge-records`
- **参数**: `page`, `pageSize`, 可选 `cardNumber`, `startDate`, `endDate`, `status`
- **响应 list 项**: `id`, `subAccount`, `cardNumber`（可脱敏）, `requestId`, `orderNo`, `status`, `amount`, `createTime`

### 4.13 交易明细

- **接口**: `GET /api/cards/transactions`
- **参数**: `page`, `pageSize`, 可选 `cardNumber`, `transactionType`, `status`, `startDate`, `endDate`
- **响应 list 项**: `id`, `subAccount`, `cardNumber`, `transactionTime`, `currency`, `amount`, `baseCurrency`, `baseAmount`, `description`, `merchant`, `mcc`, `type`, `status`

### 4.14 退款明细

- **接口**: `GET /api/cards/refund-details`
- **参数**: `page`, `pageSize`, 可选 `cardNumber`, `billDateStart`, `billDateEnd`, `createStart`, `createEnd`
- **响应 list 项**: `id`, `subAccount`, `recordNo`, `cardNumber`, `cardId`, `billDate`, `txCurrency`, `txAmount`, `billCurrency`, `billAmount`, `fee`, `createTime`, `updateTime`

### 4.15 手续费明细

- **接口**: `GET /api/cards/fee-details`
- **参数**: `page`, `pageSize`, 可选 `cardNumber`, `startDate`, `endDate`
- **响应 list 项**: 按业务定义（如 `id`, `cardNumber`, `feeType`, `amount`, `createdAt`）

### 4.16 销卡列表

- **接口**: `GET /api/cards/cancelled`
- **参数**: `page`, `pageSize`, 可选 `cardNumber`, `cancelStart`, `cancelEnd`
- **响应 list 项**: 与卡管理列表类似，增加 `cancelledAt`、销卡原因等

### 4.17 卡操作 - 详情 / 更多 / 删除（占位）

- **卡详情**: `GET /api/cards/:cardId` — 返回单卡完整信息（可脱敏策略与列表一致）
- **删除/销卡**: `POST /api/cards/:cardId/cancel` 或 `DELETE /api/cards/:cardId` — 请求体可含 `reason`

---

## 五、3D 卡 / 3D-1 卡

- 若后端按卡类型区分，可采用：
  - `GET /api/cards/list?cardType=3d`、`cardType=3d1`，或
  - `GET /api/cards/3d/list`、`GET /api/cards/3d1/list`
- 持卡人、开卡、充值记录、交易明细、退款明细等可同样通过 `cardType` 或路径区分，字段与常规卡保持一致或做少量扩展。

---

## 六、账户 (Account)

### 6.1 实名认证 - 提交企业信息

- **接口**: `POST /api/account/verify`
- **说明**: 三步表单（企业基本信息、法人代表、证件验证）可一次提交或分步提交（由后端设计）
- **请求体**（示例）:

```json
{
  "step": 1,
  "enterpriseType": "有限责任公司",
  "businessLicenseUrl": "上传后的文件 URL",
  "registrationAddress": "企业注册地",
  "legalPersonName": "法人姓名",
  "idType": "id_card",
  "idNumber": "证件号",
  "idFrontUrl": "证件正面 URL",
  "idBackUrl": "证件背面 URL"
}
```

- **响应 data**: `{ "nextStep": 2 }` 或 `{ "verified": true }`

### 6.2 密码设置 / 修改密码

- **接口**: `PUT /api/account/password`
- **请求体**: `{ "oldPassword": "...", "newPassword": "..." }`

### 6.3 子账户列表

- **接口**: `GET /api/account/sub-accounts`
- **参数**: `page`, `pageSize`
- **响应 list 项**: `id`, `account`, `role`, `realName`, `createdAt`, `status`

### 6.4 安全验证（如二次验证开关、设备列表）

- **接口**: `GET /api/account/security` — 返回当前安全设置
- **接口**: `POST /api/account/security/2fa` — 开启/关闭双因素等（按业务定义）

---

## 七、公告 (Announcements)

### 7.1 公告列表

- **接口**: `GET /api/announcements`
- **参数**: `page`, `pageSize`（可选，若仅需最新几条可固定 pageSize=10）
- **响应 list 项**: `id`, `title`, `summary`, `content`, `publishedAt`

### 7.2 公告详情

- **接口**: `GET /api/announcements/:id`
- **响应 data**: `id`, `title`, `content`, `publishedAt`

---

## 八、接口汇总表

| 模块     | 方法 | 路径 | 说明 |
|----------|------|------|------|
| 认证     | POST | /api/auth/login | 登录 |
| 认证     | POST | /api/auth/logout | 登出 |
| 认证     | POST | /api/auth/forgot-password | 忘记密码-发送重置链接 |
| 认证     | GET  | /api/auth/me | 当前用户信息 |
| 钱包     | GET  | /api/wallet/overview | 我的钱包概览 |
| 钱包     | GET  | /api/wallet/account-details | 账户明细 |
| 钱包     | GET  | /api/wallet/fund-transfers | 资金划转列表 |
| 钱包     | POST | /api/wallet/fund-transfers | 新增资金划转 |
| 钱包     | GET  | /api/wallet/transfer-management | 转账管理列表 |
| 常规卡   | GET  | /api/cards/cardholders | 持卡人列表 |
| 常规卡   | POST | /api/cards/cardholders | 持卡人新建 |
| 常规卡   | GET  | /api/cards/cardholders/:id | 持卡人详情 |
| 常规卡   | PUT  | /api/cards/cardholders/:id | 持卡人编辑 |
| 常规卡   | DELETE | /api/cards/cardholders/:id | 持卡人删除 |
| 常规卡   | GET  | /api/cards/list | 卡管理列表 |
| 常规卡   | GET  | /api/cards/:cardId/balance | 卡余额（敏感） |
| 常规卡   | GET  | /api/cards/:cardId/cvv | CVV（敏感） |
| 常规卡   | PATCH| /api/cards/:cardId | 卡别名等更新 |
| 常规卡   | POST | /api/cards/open | 开卡 |
| 常规卡   | GET  | /api/cards/recharge-records | 充值记录 |
| 常规卡   | GET  | /api/cards/transactions | 交易明细 |
| 常规卡   | GET  | /api/cards/refund-details | 退款明细 |
| 常规卡   | GET  | /api/cards/fee-details | 手续费明细 |
| 常规卡   | GET  | /api/cards/cancelled | 销卡列表 |
| 常规卡   | GET  | /api/cards/:cardId | 卡详情 |
| 常规卡   | POST | /api/cards/:cardId/cancel | 销卡 |
| 账户     | POST | /api/account/verify | 实名认证提交 |
| 账户     | PUT  | /api/account/password | 修改密码 |
| 账户     | GET  | /api/account/sub-accounts | 子账户列表 |
| 账户     | GET  | /api/account/security | 安全设置 |
| 公告     | GET  | /api/announcements | 公告列表 |
| 公告     | GET  | /api/announcements/:id | 公告详情 |

---

## 九、前端对接说明

1. **敏感信息**：卡号、余额、CVV 等在前端默认脱敏；真实数据仅通过「按需拉取」接口在用户点击展示时请求（可配合 `SecretText` 与 React Query）。
2. **分页**：列表页统一使用 `page`、`pageSize`，前端表格与 `Pagination` 组件据此传参。
3. **筛选**：各列表的筛选条件与上述「参数」一致，前端将表单与查询参数同步即可。
4. **错误码**：建议 401 跳转登录页，403 提示无权限，4xx/5xx 展示 `message`。
5. **文件上传**：实名认证中的营业执照、证件照等，需先调用上传接口（如 `POST /api/upload`）获取 URL，再将 URL 填入提交表单。

以上接口与当前前端页面（钱包、常规卡、3D/3D-1 卡、账户、公告、登录等）一一对应，可按需增删字段或拆分接口以适配实际后端实现。
