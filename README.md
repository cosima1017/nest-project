## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Technology stack

- NestJS: 用于构建 TypeScript 应用程序的框架。
- Prisma: 用于数据库操作和模型定义的 ORM。
- Swagger: 用于生成 API 文档和测试的框架。
- Winston: 用于日志记录和格式化的库。

## Git 提交规范

- feat: 新功能
- fix: 修复问题
- refactor: 重构代码
- style: 代码格式调整
- perf: 性能优化
- revert: 回滚
- test: 添加测试
- docs: 更新文档
- chore: 表示维护任务，如更新依赖项、配置文件等
- ci: 表示持续集成任务
- build: 用于提交影响构建系统的更改

## Prisma

```bash
# init
$ npm i  prisma @prisma/client
$ npx prisma
# 连接上数据库的情况下
$ npx db pull #拉取数据库相关模型
$ prisma generate #更新生成客户端
```

详细开发文档（ https://www.prisma.io/docs/getting-started ）
