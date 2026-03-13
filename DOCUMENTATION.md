# Nova Digital Goods Platform - 开发者使用文档

Nova 是一个专为高端数字资产（软件、激活码、会员服务）设计的电商平台模板。它采用了 **Express + Vite + React** 的全栈架构，具备极简主义的视觉设计和流畅的交互体验。

---

## 1. 技术栈 (Tech Stack)

- **前端 (Frontend)**: React 19, Vite 6, Tailwind CSS 4, Framer Motion (Motion)
- **后端 (Backend)**: Node.js, Express 4, JWT (JSON Web Tokens)
- **安全 (Security)**: Bcrypt.js (密码加密), Helmet (安全响应头), Express Rate Limit (防暴力破解)
- **图标 (Icons)**: Lucide React
- **字体 (Typography)**: Inter (Sans), Playfair Display (Serif), Outfit (Display)

---

## 2. 项目结构 (Project Structure)

```text
├── server.ts              # 后端 Express 服务器入口，包含 API 路由
├── src/
│   ├── App.tsx            # 前端主入口，包含路由配置、Context 和所有页面组件
│   ├── main.tsx           # React 挂载点
│   ├── index.css          # 全局样式与 Tailwind 配置
│   └── types.ts           # TypeScript 类型定义
├── index.html             # HTML 模板
├── package.json           # 依赖与脚本配置
└── .env.example           # 环境变量模板
```

---

## 3. 前端路由 (Frontend Routes)

应用使用 `react-router-dom` 进行客户端路由管理。

| 路径 | 说明 | 访问权限 |
| :--- | :--- | :--- |
| `/` | 首页 / 精品店 (Boutique) | 公开 |
| `/product/:id` | 商品详情页 | 公开 |
| `/login` | 登录页面 | 公开 |
| `/signup` | 注册页面 | 公开 |
| `/order-lookup` | 订单快速查询 (免登录) | 公开 |
| `/dashboard` | 用户控制中心 (Dashboard) | 需登录 |
| `/news` | 品牌日志 (Journal) | 公开 |

### Dashboard 子标签页 (Tabs)
在 `/dashboard` 路径下，通过状态切换显示以下内容：
- **Overview (概览)**: 账户统计与最近活动。
- **Orders (我的订单)**: 历史购买记录与数字密钥。
- **Wallet (我的钱包)**: 余额充值与消费记录。
- **API (API 对接)**: 开发者集成密钥管理。
- **Security (安全中心)**: 修改密码与二步验证。
- **Profile (个人资料)**: 修改显示名称与账户设置。

---

## 4. 后端 API 接口 (Backend API)

所有 API 接口均以 `/api` 开头。

### 身份验证 (Authentication)

#### `POST /api/auth/signup`
- **功能**: 用户注册。
- **参数**: `{ email, password, name }`
- **返回**: 用户对象 (不含密码)，并在 Cookie 中设置 JWT。

#### `POST /api/auth/login`
- **功能**: 用户登录。
- **参数**: `{ email, password }`
- **返回**: 用户对象，并在 Cookie 中设置 JWT。

#### `POST /api/auth/logout`
- **功能**: 退出登录。
- **返回**: 清除 Cookie 中的 JWT。

#### `GET /api/auth/me`
- **功能**: 获取当前登录用户信息。
- **权限**: 需要有效的 JWT Cookie。

#### `PATCH /api/auth/profile`
- **功能**: 更新用户个人资料。
- **参数**: `{ name }`
- **权限**: 需要有效的 JWT Cookie。

### 业务逻辑 (Business)

#### `POST /api/order-lookup`
- **功能**: 根据订单 ID 和 凭据查询订单状态。
- **参数**: `{ orderId, email, password }`
- **说明**: 允许访客通过购买时使用的邮箱或临时密码查询数字商品。

---

## 5. 核心 Context 与 Hooks

### `AuthContext`
管理全局登录状态。
- `user`: 当前用户信息。
- `login(email, password)`: 执行登录。
- `signup(email, password, name)`: 执行注册。
- `logout()`: 清除状态并跳转。
- `updateProfile(name)`: 更新用户信息。

### `CartContext`
管理购物车逻辑。
- `cart`: 购物车商品列表。
- `addToCart(product)`: 添加商品。
- `removeFromCart(id)`: 移除商品。
- `clearCart()`: 清空购物车。

---

## 6. 环境变量 (Environment Variables)

在生产环境中，请在 `.env` 文件中配置以下变量：

```env
# JWT 签名密钥 (必须修改)
JWT_SECRET=your_super_secret_key_here

# 生产环境标识
NODE_ENV=production
```

---

## 7. 开发与部署 (Development & Deployment)

### 本地开发
```bash
npm install
npm run dev
```
服务器将运行在 `http://localhost:3000`。

### 生产构建
```bash
npm run build
npm run start
```
构建产物将存放在 `dist/` 目录中，`server.ts` 会自动处理静态资源托管。

---

## 8. 生产环境优化建议

1. **数据库迁移**: 目前 `server.ts` 使用内存数组存储数据，重启服务器会丢失。请接入 **MongoDB** 或 **PostgreSQL**。
2. **图片托管**: 目前使用 Unsplash 链接，建议迁移到 **Cloudinary** 或 **AWS S3**。
3. **支付集成**: 建议在后端接入 **Stripe SDK** 处理 `/api/checkout` 逻辑。
4. **HTTPS**: 生产环境必须配置 SSL 证书，以保护 JWT Cookie 的安全。
