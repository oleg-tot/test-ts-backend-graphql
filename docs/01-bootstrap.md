# 01. Bootstrap: как собирается и стартует приложение

## Сборка

```bash
yarn build      # nest build -> tsc -> dist/
yarn start:dev  # nest start --watch (сборка + перезапуск)
yarn start:prod # node dist/main.js
```

`nest build` вызывает TypeScript-компилятор и кладёт результат в `dist/`.
Проект — **ESM** (`"type": "module"` в `package.json`), поэтому:

- относительные импорты пишутся с `.js`, хотя исходники `.ts`:
  ```ts
  import { AppModule } from './app.module.js'
  ```
  `tsc` не переписывает спецификаторы; в `dist` остаётся `./app.module.js`, и Node
  находит этот файл. Node ESM не подставляет расширения сам.
- `await` на верхнем уровне (`top-level await`) допустим.

`tsconfig.json`: `module`/`moduleResolution: nodenext`, `experimentalDecorators`,
`emitDecoratorMetadata` (нужны Nest для DI), `sourceMap: true` (отладка в `.ts`).

## `src/main.ts` — по шагам

```ts
import 'reflect-metadata'
import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule)
  app.enableShutdownHooks()
  await app.listen(process.env.PORT || 3000)
}

await bootstrap()
```

1. **`import 'reflect-metadata'`** — регистрирует API `Reflect.metadata`, через которое
   Nest читает типы конструкторов. Должен выполниться до старта Nest.
2. **`import 'dotenv/config'`** — загружает `.env` в `process.env`. Существующие
   переменные окружения не перезаписываются: `PORT=9000 node dist/main.js` сильнее `.env`.
3. **`NestFactory.create(AppModule)`** — сканирует граф модулей, создаёт DI-контейнер
   и **инстанцирует провайдеры** (конструкторы выполняются, например `PrismaService`
   создаёт `PrismaPg`-адаптер). Lifecycle-хуки на этом шаге ещё **не** вызываются.
4. **`app.enableShutdownHooks()`** — подписывает Nest на `SIGTERM`/`SIGINT`. По сигналу
   вызывается `app.close()` → `beforeApplicationShutdown` → `onApplicationShutdown` →
   `onModuleDestroy` (в нашем случае `PrismaService.$disconnect()`). После этого Nest
   повторно шлёт сигнал процессу, поэтому `exit code = 143` (`128 + 15`) — это норма,
   а не падение.
5. **`app.listen(port)`** — первый вызов `init()`:
   - `onModuleInit` у провайдеров (`PrismaService` делает `$connect`, GraphQL-модуль
     строит схему и монтирует `/graphql`);
   - `onApplicationBootstrap` (`DatabaseSeeder` выполняет сид);
   - затем HTTP-адаптер (Express) начинает слушать порт.

## Порядок старта (упрощённо)

```
node dist/main.js
  -> import 'reflect-metadata'
  -> import 'dotenv/config'
  -> NestFactory.create(AppModule)
       -> скан модулей
       -> инстанцирование провайдеров (конструкторы)
  -> enableShutdownHooks()
  -> app.listen(PORT)
       -> onModuleInit: PrismaService.$connect, GraphQL schema build + /graphql
       -> onApplicationBootstrap: DatabaseSeeder
       -> HTTP listen
```

Ошибки на этапе инстанцирования (например, `DATABASE_URL is not set`) падают до
старта сервера. Ошибки подключения к БД всплывают на `onModuleInit`/`onApplicationBootstrap`
(например, `P1001`, если Postgres не запущен).
