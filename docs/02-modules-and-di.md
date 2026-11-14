# 02. Модули, DI и жизненный цикл

## Граф модулей

```
AppModule
├─ GraphqlModule      GraphQLModule.forRoot(...) — /graphql, сборка схемы
├─ DatabaseModule ──► PrismaModule (@Global) ◄── PrismaService
│                     └─ DatabaseSeeder
├─ ProfileModule ───► PrismaModule
│   ├─ ProfileRepository
│   ├─ ProfileService
│   ├─ ProfileResolver
│   ├─ ExperienceResolver
│   └─ ProjectResolver
└─ HealthModule ────► PrismaModule
    └─ HealthController
```

`PrismaModule` импортируется несколькими модулями, но Nest создаёт его один раз
(модули дедуплицируются по классу). Флаг `@Global()` делает **экспортированные**
провайдеры доступными во всех модулях без повторного импорта. При этом сам модуль
должен быть зарегистрирован в графе хотя бы один раз.

## DI (Dependency Injection)

- **Провайдер** — то, что регистрируется в `providers`. Токен по умолчанию — сам класс.
- Nest читает типы параметров конструктора из `design:paramtypes`
  (их эмитит `emitDecoratorMetadata`) и по типу находит провайдер:
  ```ts
  @Injectable()
  export class ProfileService {
    constructor(private readonly repository: ProfileRepository) {}
  }
  ```
- **Scope** по умолчанию `singleton`: один экземпляр на приложение
  (`PrismaService` — один клиент/пул на процесс).
- `@Injectable()` помечает класс как управляемый контейнером.
- `exports` модуля делает провайдеры доступными импортирующим модулям.

Resolvers — это обычные провайдеры с декоратором `@Resolver()`. GraphQL-модуль
находит их, сканируя граф приложения при построении схемы, поэтому `GraphqlModule`
не обязан импортировать `ProfileModule` (на текущем этапе).

## Lifecycle-хуки

| Хук | Когда |
| --- | --- |
| конструктор | при инстанцировании провайдера (`NestFactory.create`) |
| `onModuleInit` | при `app.init()` / `app.listen()` |
| `onApplicationBootstrap` | после инициализации всех модулей |
| `beforeApplicationShutdown` | при `app.close()` до закрытия соединений |
| `onApplicationShutdown` | при `app.close()` после закрытия соединений |
| `onModuleDestroy` | финальная очистка (`PrismaService.$disconnect`) |

## Путь обычного HTTP-запроса в Nest

```
HTTP -> middleware -> guards -> interceptors (до) -> pipes -> handler/controller
     -> interceptors (после) -> exception filters -> HTTP response
```

У GraphQL свой пайплайн поверх HTTP: один POST `/graphql` приходит в Apollo,
дальше Apollo исполняет GraphQL-операцию и вызывает `@Query`/`@ResolveField`.
Подробнее — в [05-graphql.md](./05-graphql.md) и [06-request-flow.md](./06-request-flow.md).
