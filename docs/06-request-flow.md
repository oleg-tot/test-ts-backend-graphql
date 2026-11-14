# 06. Путь запроса: HTTP → GraphQL → resolver → service → repository → SQL

Разберём запрос из задания:

```graphql
query {
  profile {
    name
    description
    skills { name }
    experience { company position }
    projects { name }
  }
}
```

## Шаг 1. HTTP

`POST /graphql` с JSON `{ "query": "..." }`. Маршрут смонтирован Apollo-драйвером
при старте приложения (`app.all('/graphql', expressMiddleware(...))`).

## Шаг 2. Apollo

Apollo парсит и валидирует операцию по схеме, затем исполняет её. GraphQL вызывает
резолверы **по полям**, а не одним «монолитным» методом.

## Шаг 3. Корневое поле `profile`

```
ProfileResolver.profile()
  -> ProfileService.getPrimaryProfile()
     -> ProfileRepository.findPrimary()
        -> prisma.profile.findFirst({ orderBy: { createdAt: 'asc' } })
           -> SQL: SELECT ... FROM "Profile" ORDER BY "createdAt" ASC LIMIT 1
```

Результат маппится в GraphQL-модель: `toProfileModel(row)` = `Object.assign(new Profile(), row)`.
Скалярные поля (`name`, `description`) GraphQL берёт прямо из объекта.

## Шаг 4. Вложенные поля

Для `skills`, `experience`, `projects` GraphQL вызывает соответствующие
`@ResolveField` у `ProfileResolver`. Каждый идёт в сервис → репозиторий → Prisma:

| GraphQL-поле | Resolver | Service | Repository | Prisma |
| --- | --- | --- | --- | --- |
| `profile.links` | `ProfileResolver.links` | `getLinksByProfileId` | `findLinksByProfileId` | `link.findMany` |
| `profile.skills` | `ProfileResolver.skills` | `getSkillsByProfileId` | `findSkillsByProfileId` | `skill.findMany` |
| `profile.experience` | `ProfileResolver.experience` | `getExperienceByProfileId` | `findExperienceByProfileId` | `experience.findMany` |
| `profile.projects` | `ProfileResolver.projects` | `getProjectsByProfileId` | `findProjectsByProfileId` | `project.findMany` |
| `experience.achievements` | `ExperienceResolver.achievements` | `getAchievementsByExperienceId` | `findAchievementsByExperienceId` | `achievement.findMany` |
| `project.skills` | `ProjectResolver.skills` | `getSkillsByProjectId` | `findSkillsByProjectId` | `skill.findMany` |

## Шаг 5. N+1 (текущее состояние)

`@ResolveField` вызывается **для каждого родителя**. Для сида (2 опыта, 2 проекта):

```
Profile            1 запрос
profile.skills     1
profile.experience 1
profile.projects   1
achievements       2  (по одному на Experience)
project.skills     2  (по одному на Project)
----------------------
итого              8
```

С ростом числа `Experience`/`Project` растёт и число запросов: 1 + N.

## Шаг 6. DataLoader (Stage 5, план)

Идея: собрать ключи, запрошенные в одном тике event loop, и сделать один
`WHERE ... IN (...)`.

```
BEFORE (N+1):                      AFTER (DataLoader):
for each experience:               batchFn([exp1, exp2])
  SELECT ... WHERE experienceId=$1   SELECT ... WHERE experienceId IN ($1,$2)
```

Изменения:

1. `yarn add dataloader`.
2. В репозитории — батч-методы (`findAchievementsByExperienceIds(ids)` и т.д.).
3. `src/profile/loaders/profile.loaders.ts` — фабрика DataLoader-ов; batch-функция
   возвращает массив **той же длины и в том же порядке**, что входные ключи.
4. `src/graphql/graphql-context.ts` — `interface GraphQLContext { loaders }`.
5. `GraphqlModule` → `forRootAsync` c `inject: [ProfileRepository]`; `context`
   создаёт новые loader-ы на каждый запрос.
6. Резолверы: `@Context() ctx` → `ctx.loaders.achievementsByExperienceId.load(id)`.

Результат для того же запроса: ~6 запросов вместо 8, и число не растёт с N.

Почему в `context`, а не провайдером: кэш/батчинг должны жить один запрос —
иначе утечка данных между пользователями и устаревший кэш.
