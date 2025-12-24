# ==========================================
# 阶段 1: 构建阶段 (Builder)
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

# 安装构建所需的系统依赖
RUN apk add --no-cache libc6-compat git

# 1. 利用缓存安装依赖
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 2. 拷贝源码并执行 Astro 构建
COPY . .
RUN npm run build

# ==========================================
# 阶段 2: 运行与增量上传阶段 (Runner)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

# 1. 安装上传工具 EdgeOne CLI 以及基础工具
# 虽然 package.json 有，但在 Runner 阶段全局安装是最稳妥的调用方式
RUN npm install -g edgeone && apk add --no-cache curl

# 2. 从构建阶段拷贝必要产物
# 提示：EdgeOne 部署规范要求目录中包含 package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/deploy-wrapper.cjs ./deploy-wrapper.cjs

# 3. 环境配置
ENV CI=true
ENV PORT=3000
EXPOSE 3000

# 启动监控脚本执行增量上传
CMD ["node", "deploy-wrapper.cjs"]