# 使用官方 Node.js 镜像作为基础镜像
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm i -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# 安装依赖
RUN pnpm install

# 全局安装所需的命令行工具
RUN npm i -g @nestjs/cli cross-env

# 生成 Prisma 客户端
RUN npx prisma generate

# 复制项目源代码
COPY . .

# 构建项目 - 直接使用nest命令而不是pnpm脚本
RUN NODE_ENV=production nest build

# 使用官方的 Node.js 运行时镜像作为生产环境
FROM node:20-alpine

# 安装pnpm
RUN npm i -g pnpm

WORKDIR /app

# 从构建阶段复制构建好的文件
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/generated ./generated

RUN pnpm store import
# 安装生产依赖
RUN pnpm install --prod
# COPY .env ./
# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main"]