# 英语全科启蒙网站导航 - 项目说明文档

## 1. 项目简介

本项目是一个基于 Next.js 构建的现代化、响应式的网站导航应用。它允许管理员通过一个受密码保护的后台动态管理网站的链接、分类和基础设置。项目界面简洁、美观，并支持亮色、暗色和跟随系统的三种主题模式。

## 2. 技术栈

- **前端框架**: [Next.js](https://nextjs.org/) (使用 App Router)
- **UI 库**: [React](https://react.dev/) & [ShadCN UI](https://ui.shadcn.com/)
- **编程语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **数据库 ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **数据库**: [PostgreSQL](https://www.postgresql.org/) (通过 Vercel Postgres 或其他服务)
- **认证**: 基于 Cookie 的简单会话管理
- **AI 功能 (集成)**: [Genkit](https://firebase.google.com/docs/genkit) (用于未来扩展 AI 功能)

## 3. 核心功能

- **动态链接网格**: 主页以卡片形式展示所有网站链接，并按分类进行组织。
- **后台管理系统**:
    - 路径: `/admin`
    - 受密码保护的管理员登录页面。
    - **链接管理**: 对分类和链接进行增、删、改、查操作。
    - **网站设置**: 修改网站标题、Logo 图片地址、版权信息等。
    - **密码修改**: 在后台安全地更改管理员密码。
- **主题切换**: 支持亮色、暗色和跟随系统三种显示模式，并自动保存用户的选择。
- **响应式设计**: 兼容桌面、平板和移动设备。

## 4. 项目结构概览

```
.
├── src
│   ├── app                 # Next.js App Router 核心目录
│   │   ├── admin           # 管理后台相关页面和组件
│   │   ├── (public)        # 公共页面，如主页
│   │   ├── globals.css     # 全局 CSS 样式和主题变量
│   │   └── layout.tsx      # 根布局
│   ├── components          # 全局可复用的 React 组件
│   │   └── ui              # ShadCN UI 组件
│   ├── lib                 # 存放应用的核心逻辑
│   │   ├── actions-auth.ts # 认证相关的 Server Actions
│   │   ├── actions.ts      # 数据操作相关的 Server Actions
│   │   ├── data.ts         # 从数据库获取数据的函数
│   │   ├── db.ts           # Drizzle ORM 数据库实例
│   │   └── schema.ts       # 数据库表结构定义
│   └── ai                  # Genkit 相关文件，用于 AI 功能
│       ├── flows           # AI 工作流定义
│       └── genkit.ts       # Genkit 配置文件
├── public                  # 静态资源，如图片
└── tailwind.config.ts      # Tailwind CSS 配置文件
```

## 5. 本地开发指南

### 步骤 1: 设置环境变量

在项目根目录下创建一个名为 `.env` 的文件，并配置您的 PostgreSQL 数据库连接字符串。

```env
DATABASE_URL="postgres://..."
```

**注意**: 如果您使用的是 Vercel、Neon 或 Supabase 等云数据库服务，请将它们提供的连接字符串粘贴到此处。没有此配置，后台管理功能将无法使用。

### 步骤 2: 安装依赖

在项目根目录下打开终端，运行以下命令：

```bash
npm install
```

### 步骤 3: 运行开发服务器

```bash
npm run dev
```

现在，您可以在浏览器中访问 `http://localhost:9002` 来查看应用。

## 6. 后台管理

- **访问地址**: `http://localhost:9002/admin`
- **初始密码**: `password`

首次登录后，强烈建议您立即在“网站设置” -> “修改密码”中更改默认密码，以确保您的后台安全。
