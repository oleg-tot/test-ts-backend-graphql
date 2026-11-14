# 03. База данных: PostgreSQL, Prisma, миграции

## Инфраструктура

`docker-compose.yml` поднимает:

- `postgres` (PostgreSQL 17) — БД `business_card`, порт `5432`, healthcheck;
- `s3mock` — S3-совместимое хранилище для локальной разработки (порт `9090`,
  бакет `avatars`).

```bash
docker compose up -d
```

## Multi-file Prisma schema

```
prisma/
  schema/
    config.prisma   # generator + datasource (инфраструктура)
    enums.prisma    # LinkType, SkillCategory
    profile.prisma  # Profile
    link.prisma     # Link
    skill.prisma    # Skill
    experience.prisma
    achievement.prisma
    project.prisma  # Project + m2m со Skill
  migrations/       # SQL-миграции
```

Все `.prisma`-файлы из папки объединяются в одну логическую схему. `generator` и
`datasource` должны встречаться ровно один раз.

`datasource` **без `url`**: Prisma 7 берёт URL для CLI из `prisma.config.ts`, а в
рантайме подключение идёт через driver adapter.

## `prisma.config.ts`

```ts
export default defineConfig({
  schema: 'prisma/schema',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL ?? 'postgresql://...' },
})
```

- `schema` указывает на **папку** (multi-file schema).
- `url` нужен CLI (`prisma generate`, `migrate`, `studio`).

## `PrismaService`

```ts
@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })
  }

  async onModuleInit() { await this.$connect() }
  async onModuleDestroy() { await this.$disconnect() }
}
```

- `extends PrismaClient` — сервис сам является Prisma-клиентом: доступны
  `prisma.profile`, `$transaction`, `$queryRaw` и т.д.
- `PrismaPg` — driver adapter поверх `pg`; Prisma 7 требует adapter в конструкторе.
- `@Global()` на `PrismaModule` — один клиент на приложение.
- `$connect`/`$disconnect` привязаны к lifecycle → корректное закрытие по SIGTERM.

## Генерация клиента и миграции

```bash
yarn prisma generate            # клиент -> src/generated/prisma
yarn prisma migrate dev --name <name>  # новая миграция (dev)
yarn prisma migrate deploy      # применить существующие миграции (prod/CI)
yarn prisma studio              # GUI
yarn db:reset                   # сбросить БД и применить миграции заново
```

- `src/generated` в `.gitignore`: клиент генерируется, а не коммитится.
  После клонирования нужен `yarn prisma generate` (в Docker это делает entrypoint).
- `migrate dev` создаёт SQL и применяет его; `migrate deploy` только применяет.

## Проверка живости БД

`GET /health` (`src/health/health.controller.ts`) выполняет `SELECT 1` через
`PrismaService.$queryRaw` и возвращает `{ status: 'ok', database: 'up' }`.
