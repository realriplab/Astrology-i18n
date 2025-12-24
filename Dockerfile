# ==========================================
# 阶段 1: 构建阶段 (Builder)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat git curl

# 缓存依赖安装
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 缓存 Astro 构建
COPY . .
RUN --mount=type=cache,target=/app/.astro_cache \
    npm run build

# ==========================================
# 阶段 2: 部署阶段 (Runner - 最终镜像)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# 只安装运行上传脚本所需的最小工具
RUN npm install -g edgeone && apk add --no-cache curl

# 从构建阶段拷贝必要产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/deploy-wrapper.cjs ./deploy-wrapper.cjs

ENV CI=true
ENV PORT=3000
EXPOSE 3000

CMD ["node", "deploy-wrapper.cjs"]