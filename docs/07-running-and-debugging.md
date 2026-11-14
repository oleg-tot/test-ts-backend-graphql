# 07. Запуск, отладка, troubleshooting

## Требования

- Node.js 24, Yarn 4, Docker.

## Первый запуск

```bash
cp .env.example .env
yarn install
docker compose up -d          # postgres + s3mock
yarn prisma generate
yarn prisma migrate deploy
yarn start:dev
```

- GraphQL: `http://localhost:<PORT>/graphql` (Apollo Sandbox).
- Health: `http://localhost:<PORT>/health`.

## Переменные окружения

| Переменная | Назначение |
| --- | --- |
| `DATABASE_URL` | строка подключения PostgreSQL |
| `PORT` | HTTP-порт |
| `NODE_ENV` | окружение (`test` → схема в памяти) |
| `SEED_ON_STARTUP` | `false` отключает сид |
| `S3_ENDPOINT` / `S3_REGION` / `S3_BUCKET` | S3-хранилище |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` / `S3_FORCE_PATH_STYLE` | доступ к S3 |

## Скрипты

| Скрипт | Что делает |
| --- | --- |
| `yarn build` | компиляция в `dist/` |
| `yarn start:dev` | watch-режим |
| `yarn start:debug` | watch + inspector на `9229` |
| `yarn start:prod` | `node dist/main.js` |
| `yarn prisma:generate` / `prisma:migrate` / `prisma:studio` | Prisma |
| `yarn db:reset` | пересоздать БД |
| `yarn lint` / `format` / `format:check` | качество кода |

## Отладка в VS Code

В `.vscode/launch.json` два конфига:

1. **Nest: build + debug** — сборка и запуск `dist/main.js` с отладчиком.
   Подходит для кода, который выполняется на старте (`main.ts`, сид).
2. **Nest: attach (yarn start:debug)** — сначала в терминале `yarn start:debug`,
   затем `F5`; VS Code подключается к inspector на `9229` и переподключается при watch.

Важно:

- `debugger;` останавливает выполнение только если отладчик **уже подключён**.
  `--inspect` (без `-brk`) не ставит процесс на паузу, поэтому `debugger` в
  `bootstrap` можно проскочить — для раннего кода используй launch-конфиг.
- Breakpoints в `.ts` работают благодаря `sourceMap: true`.

## Troubleshooting

| Симптом | Причина / решение |
| --- | --- |
| `EADDRINUSE` | порт занят другим `node dist/main.js`; найти и остановить процесс |
| `P1001: Can't reach database server` | Postgres не запущен: `docker compose up -d`, дождаться healthy |
| Prisma Client не найден | `yarn prisma generate` (папка `src/generated` не коммитится) |
| `Query root type must be provided` | нет ни одного `@Query` в схеме |
| Breakpoint серый | процесс не пересобран/не подключён; проверь `start:debug` и 9229 |
| `debugger` не срабатывает | не подключён отладчик или код выполнился до attach |
| Сид не выполнился | `SEED_ON_STARTUP=false` или ошибка БД (смотри лог `DatabaseSeeder`) |
| Порт/БД «изменены», но не применяются | `.env` не перезаписывает существующие переменные окружения; проверь экспорт |
