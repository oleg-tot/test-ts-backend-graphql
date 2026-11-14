# Документация проекта

Разбор того, как устроен и работает backend цифровой визитки: от `main.ts` до SQL-запроса.

Порядок чтения:

1. [01-bootstrap.md](./01-bootstrap.md) — как собирается и стартует приложение.
2. [02-modules-and-di.md](./02-modules-and-di.md) — модули, DI, жизненный цикл.
3. [03-database.md](./03-database.md) — PostgreSQL, Prisma, миграции, `PrismaService`.
4. [04-seeding.md](./04-seeding.md) — автоподготовка и заполнение БД.
5. [05-graphql.md](./05-graphql.md) — GraphQL-слой, code-first, схема.
6. [06-request-flow.md](./06-request-flow.md) — путь запроса: HTTP → resolver → service → repository → SQL.
7. [07-running-and-debugging.md](./07-running-and-debugging.md) — запуск, отладка, troubleshooting.

Статус: этапы 1–4 реализованы. DataLoader (Stage 5) и Docker-образ приложения (Stage 6) описаны как план и помечены в тексте.
