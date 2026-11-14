# 04. Сид: автоподготовка и заполнение БД

## Когда запускается

`DatabaseModule` регистрирует `DatabaseSeeder` (`src/database/seed/database-seeder.service.ts`),
который реализует `OnApplicationBootstrap`. Сид выполняется при каждом старте
приложения, после инициализации модулей и до начала приёма HTTP-запросов.

```
app.listen()
  -> onModuleInit (PrismaService.$connect, GraphQL schema)
  -> onApplicationBootstrap (DatabaseSeeder.seed)
  -> HTTP listen
```

## Данные

`src/database/seed/seed-data.ts` содержит:

- `seedProfile`, `seedLinks`, `seedSkills`, `seedExperience`, `seedProjects`;
- **фиксированные ID** (`profile-primary`, `skill-typescript`, …);
- типы выведены из Prisma (`*UncheckedCreateInput`) + `satisfies`, поэтому
  изменение схемы ломает компиляцию, а не рантайм.

## Алгоритм

```ts
await prisma.$transaction(async (tx) => {
  profile.upsert(...)                 // профиль
  for (link) tx.link.upsert(...)      // ссылки
  for (skill) tx.skill.upsert(...)    // навыки
  for (experience) {
    tx.experience.upsert(...)
    for (achievement) tx.achievement.upsert(...)
  }
  for (project) {
    tx.project.upsert({ create: { skills: { connect } }, update: { skills: { set } } })
  }
}, { timeout: 30_000 })
```

- **`upsert` по стабильному ID** — идемпотентность: повторный запуск не дублирует
  и не сбрасывает данные, а обновляет их.
- **`$transaction`** — атомарность: либо весь сид, либо ничего.
- **m2m `Skill ↔ Project`** — на create `connect`, на update `set` (заменяет набор
  связей на актуальный).
- **`profileId`** подставляет сидер, поэтому в `seed-data` его нет
  (`Omit<..., 'profileId'>`).

## Идемпотентность и ограничения

- Второй запуск даёт те же количества записей.
- Если из `seed-data` удалить сущность, её строка в БД **не удалится**
  (upsert не чистит «лишнее»).
- Автоматический сид рассчитан на один инстанс. Для нескольких — отдельный job
  или advisory lock.
- `SEED_ON_STARTUP=false` отключает сид (тесты/прод с управлением данными извне).

## Порядок с миграциями

Сид требует актуальной схемы, поэтому миграции применяются до старта приложения
(`prisma migrate deploy` в Docker-entrypoint, `prestart:*` локально).
