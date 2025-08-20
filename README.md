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
$ npx prisma generate #更新生成客户端
```

详细开发文档（ https://www.prisma.io/docs/getting-started ）

## 目录结构

nest-project/
├── prisma/ # 数据库模型和迁移模块
│ ├── migrations/ # 数据库迁移文件
│ └── schema.prisma # Prisma 模式文件
├── src/
│ ├── common/ # 公共模块
│ │ ├── strategies/ #策略
│ │ │ └── jwt.strategy.ts #jwt鉴权策略
│ │ ├── guards/ #策略守卫
│ │ │ └── jwt-auth.guard.ts #jwt鉴权策略守卫
│ │ ├── decorators/ #装饰器
│ │ │ └── password/ #密码加密装饰器
│ │ ├── filters/ # 过滤器
│ │ │ └── http-exception.filter.ts # 全局错误过滤器
│ │ ├── interceptors/ # 拦截器
│ │ │ └── response.interceptor.ts # 全局响应拦截
│ │ ├── interfaces/ # 接口
│ │ │ ├── response.interface.ts # 默认响应接口
│ │ │ └── axios.interface.ts # axios 接口
│ │ ├── plugins/ # 插件
│ │ │ ├── plugin.loader.ts # 自动导入根文件
│ │ │ └── swagger.plugin.ts # Swagger 插件
│ │ └── providers/ # 提供器
│ │ ├── config/ # 全局 env 配置
│ │ │ └── config.service.ts # 配置服务
│ │ ├── prisma/ # 数据库服务
│ │ │ ├── prisma.module.ts # 数据库模块
│ │ │ └── prisma.service.ts # 数据库服务
│ │ ├── logger/ # Winston 日志
│ │ │ ├── creatDailyRotateTransport.ts # 日志配置
│ │ │ └── logger.service.ts # 日志服务
│ │ └── axios/ # axios 服务（bff层）
│ │ │ ├── axios.service.ts # axios 服务
│ │ │ └── axios.module.ts # axios 模块
│ ├── modules/ # 应用模块
│ │ └── auth/ #鉴权模块
│ ├── app.controller.ts # 应用控制器
│ ├── app.modules.ts #应用主模块
│ ├── app.service.ts # 应用服务
│ ├── main.ts # 应用入口文件
│ ├── test/ # 测试文件
│ ├── app.e2e-spec.ts # 应用端到端测试
│ └── jest-e2e.json # Jest 端到端配置
├── .env # 环境变量文件
├── .env.development # 开发环境变量文件
├── .env.production # 生产环境变量文件
├── .gitignore # Git 忽略文件
├── .prettierrc # Prettier 配置文件
├── eslint.config.js # ESLint 配置文件
├── nest-cli.json # Nest CLI 配置文件
├── package.json # 项目依赖和脚本
├── pnpm-lock.yaml # pnpm 锁文件
├── tsconfig.build.json # TypeScript 构建配置文件
├── tsconfig.json # TypeScript 配置文件
└── README.md # 项目说明文档
