# 🍓 草莓鲜果商城

基于 Vue 3 + Vite + Pinia 构建的现代化草莓电商前端项目。

## 快速开始

```bash
# 使用 Docker Compose 构建并运行（推荐）
docker compose up --build -d

# 或者本地开发运行
cd frontend-admin
npm install
npm run dev
```

访问地址：http://localhost:8083

## 测试账号

| 用户名 | 密码 | 昵称 |
|--------|------|------|
| admin | 123456 | 草莓爱好者 |

## 功能页面

1. **首页** - Banner、商品列表、热销推荐
2. **商品详情页** - 商品信息、规格选择、加入购物车/立即购买
3. **购物车页** - 商品管理、数量调整、结算
4. **个人中心页** - 用户信息、订单统计、最近订单、登录/登出

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: SCSS + CSS Variables
- **部署**: Docker + Nginx

## 项目结构

```
├── docker-compose.yml          # Docker 编排配置
├── .gitignore
└── frontend-admin/             # 前端项目
    ├── Dockerfile              # Docker 构建文件
    ├── nginx.conf              # Nginx 配置
    ├── package.json            # 项目依赖
    ├── vite.config.js          # Vite 配置
    ├── index.html              # 入口 HTML
    ├── public/                 # 公共资源
    │   └── favicon.svg
    └── src/
        ├── main.js             # 应用入口
        ├── App.vue             # 根组件
        ├── assets/
        │   └── styles/
        │       └── main.scss   # 全局样式
        ├── components/
        │   ├── common/         # 通用组件
        │   │   ├── Button.vue
        │   │   ├── Icon.vue
        │   │   ├── ProductCard.vue
        │   │   ├── ProductImage.vue
        │   │   ├── Stepper.vue
        │   │   └── Toast.vue
        │   └── layout/         # 布局组件
        │       ├── AppHeader.vue
        │       ├── AppSidebar.vue
        │       └── AppTabBar.vue
        ├── img/                # 商品图片
        │   ├── baixue.webp
        │   ├── dandong.webp
        │   ├── hongyan.webp
        │   ├── naiyou.webp
        │   └── youji.webp
        ├── router/
        │   └── index.js        # 路由配置
        ├── stores/             # Pinia 状态管理
        │   ├── cart.js         # 购物车
        │   ├── order.js        # 订单
        │   ├── product.js      # 商品
        │   ├── toast.js        # 提示
        │   └── user.js         # 用户
        └── views/              # 页面视图
            ├── Home.vue
            ├── ProductDetail.vue
            ├── Cart.vue
            └── Profile.vue
```
