# 多阶段构建 - 支持 ARM64 和 AMD64 架构
# 构建阶段
FROM node:20-bookworm AS builder

WORKDIR /app

# 增加 Node.js 内存限制
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 复制依赖文件
COPY package*.json ./

# 安装依赖 - 不跳过可选依赖(rollup平台相关依赖需要)
RUN npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm install --registry=https://registry.npmmirror.com 2>&1 | tail -50

# 复制源代码
COPY . .

# 构建生产版本 - 增加日志
RUN echo "Starting build..." \
    && npm run build 2>&1 \
    && echo "Build completed successfully!"

# 生产阶段 - 使用官方 nginx:alpine 镜像
FROM nginx:1.25-alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
