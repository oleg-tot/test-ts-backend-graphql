# 05. GraphQL-слой

## Конфигурация

`src/graphql/graphql.module.ts`:

```ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: process.env.NODE_ENV === 'test'
    ? true
    : join(process.cwd(), 'schema.gql'),
  sortSchema: true,
  graphiql: false,
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  context: () => ({}),
})
```

- `driver: ApolloDriver` — `@nestjs/graphql` строит схему, Apollo Server 5 её исполняет.
- `autoSchemaFile` — **code-first**: Nest сканирует декораторы и генерирует SDL.
  - строка/путь → пишет `schema.gql` на диск;
  - `true` → только в памяти (используем в тестах, чтобы не писать файлы).
- `sortSchema: true` — детерминированный порядок в `schema.gql` (стабильный diff).
- `graphiql`/`playground` выключены; вместо них Apollo Sandbox
  (`ApolloServerPluginLandingPageLocalDefault`).
- `context` — функция, вызываемая **на каждый запрос**. Сейчас возвращает пустой
  объект; на Stage 5 здесь будут создаваться DataLoader-ы.

## Схема строится на старте

Во время `onModuleInit` GraphQL-модуль:

1. сканирует граф приложения и находит `@Query`/`@ResolveField`;
2. генерирует `GraphQLSchema` (поэтому при отсутствии хотя бы одного `@Query`
   приложение падает с `Query root type must be provided`);
3. пишет `schema.gql` (если путь задан);
4. монтирует `/graphql`.

`@nestjs/graphql` не требует, чтобы `GraphqlModule` импортировал модуль с
резолверами — схема собирается по всему графу приложения.

## Модели и маппинг

- `src/profile/models/*.model.ts` — классы с `@ObjectType`/`@Field`.
  TypeScript-типы сами по себе не дают рантайм-метаданных, поэтому нужны декораторы.
- Скалярные поля приходят из маппера (`Object.assign(new Profile(), row)`),
  вложенные — из `@ResolveField` (см. [06-request-flow.md](./06-request-flow.md)).
- Enum’ы регистрируются через `registerEnumType` (`src/profile/models/enums.ts`).

## Резолверы

- `@Query(() => Profile, { nullable: true }) profile()` — корневой запрос.
- `@ResolveField(() => [Skill]) skills(@Parent() profile)` — вложенное поле.
  Prisma **не** отдаёт связи автоматически: без `@ResolveField` поле было бы `null`.

## Пример запроса

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

Ответ (сокращённо):

```json
{
  "data": {
    "profile": {
      "name": "Oleg Grunov",
      "description": "...",
      "skills": [{ "name": "TypeScript" }, { "name": "JavaScript" }],
      "experience": [{ "company": "Freelance / Contract", "position": "Senior Frontend Developer" }],
      "projects": [{ "name": "Digital Business Card API" }]
    }
  }
}
```

Apollo Sandbox: `http://localhost:<PORT>/graphql`.
