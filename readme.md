# Image Community Platform

一个基于 Node.js 和 Express 的图片分享社区平台，支持用户注册、登录、图片上传和分享功能。

## 项目介绍

这是一个图片分享社区系统的后端服务，提供了完整的用户认证系统和图片管理功能。用户可以注册账号、上传图片、设置图片可见性，并浏览其他用户分享的图片。

### 主要功能

- 用户系统
  - 用户注册和登录
  - JWT 身份验证
  - 密码加密存储

- 图片管理
  - 图片上传
  - 图片可见性设置（公开/私有）
  - 图片列表展示

- 社区功能
  - 浏览公开图片
  - 用户互动
  - 图片分享

## 技术栈

- 后端框架：Express.js
- 数据库：MySQL
- 身份验证：JWT (jsonwebtoken)
- 密码加密：bcryptjs
- 文件上传：multer
- 包管理器：pnpm

## 运行环境要求

- Node.js >= 14.0.0
- MySQL >= 5.7
- pnpm >= 6.0.0

## 安装和运行

1 克隆项目

```bash
git clone [项目地址]
cd image-community
```

2 安装依赖

```bash
pnpm install
```

3 配置数据库

- 创建 MySQL 数据库
- 在 `server.js` 中配置数据库连接信息：

```javascript
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database',
})
```

4 运行项目

```bash
pnpm start
```

项目将在 <http://localhost:3001> 运行

## 项目结构

```text
├── server.js          # 主服务器文件
├── router/            # 路由文件
│   ├── login.js       # 登录相关路由
│   ├── user.js        # 用户相关路由
│   ├── community.js   # 社区相关路由
│   └── dashboard.js   # 仪表盘路由
├── middleware/        # 中间件
│   └── tokenCheck.js  # token 验证中间件
├── utils/            # 工具函数
├── uploads/          # 上传文件存储目录
└── public/           # 静态资源目录
```

## API 接口

### 用户相关

- POST /login/register - 用户注册
- POST /login/login - 用户登录

### 图片相关

- POST /addImage - 上传图片
- GET /getImage - 获取图片
- GET /community/list - 获取社区图片列表

## 安全特性

- JWT token 验证
- 密码加密存储
- 跨域安全处理
- 文件上传安全控制
