# Digital Business Card API

Backend for a personal digital business card built with NestJS, Prisma and
GraphQL. The API exposes a profile together with its skills, work experience and
projects.

## Documentation

A detailed walkthrough of how the application works (from `main.ts` to SQL) is in
[docs/](./docs/README.md).

## Stack

- TypeScript, ESM, Node.js 24
- NestJS 12
- Prisma 7 with the `@prisma/adapter-pg` driver adapter
- PostgreSQL 17
- GraphQL (Apollo, code-first) via `@nestjs/graphql`
- S3-compatible object storage (AWS SDK v3; `adobe/s3mock` locally)
- Docker / Docker Compose
- Oxlint + Prettier

## Project structure

```
prisma/
  schema/                 # multi-file Prisma schema
    config.prisma         # generator + datasource only
    *.prisma              # one file per model
  migrations/             # SQL migrations
src/
  prisma/                 # global PrismaModule + PrismaService
  database/               # database seeding
    seed/seed-data.ts
    seed/database-seeder.service.ts
  graphql/                # GraphQL transport configuration
```

## Architecture decisions

- **Multi-file Prisma schema.** `config.prisma` holds only `generator` and
  `datasource`; models are split into one file per entity. This keeps the
  infrastructure configuration separate from the domain contract and avoids a
  single growing `schema.prisma`.
- **Prisma driver adapter.** The datasource has no `url` in the schema: the CLI
  reads it from `prisma.config.ts`, and the runtime uses `PrismaPg` inside
  `PrismaService`. `PrismaModule` is `@Global`, so a single `PrismaClient`
  instance is shared across the application and closed on shutdown.
- **Separation of responsibilities.** Database seeding lives in
  `src/database`, Prisma access lives in `src/prisma`, and GraphQL transport
  configuration lives in `src/graphql`. The domain layer (repository, service,
  resolvers, mappers, DataLoaders) is built on top of these modules.

## Data model

- `Profile` 1–N `Link`, `Skill`, `Experience`, `Project`
- `Experience` 1–N `Achievement`
- `Skill` N–M `Project` through the implicit `_ProjectToSkill` join table

All child relations use `onDelete: Cascade` and an index on the foreign key.

## Seeding

The database is prepared automatically when the application starts
(`OnApplicationBootstrap`).

- **Deterministic IDs.** Seed entities use stable readable IDs
  (`profile-primary`, `skill-typescript`, `project-business-card`, …). This makes
  relations explicit and allows `connect`/`set` without capturing generated IDs.
- **Idempotent `upsert`.** Every entity is upserted by its stable ID inside a
  single transaction. Restarting the application neither duplicates rows nor
  resets them to an inconsistent state, and the seed also repairs a partially
  applied run.
- **Why not `createMany`.** It does not support nested relations, and implicit
  many-to-many links (`_ProjectToSkill`) cannot be written through it.
- **Ordering with migrations.** Migrations are applied before the application
  starts (`prisma migrate deploy` in the Docker entrypoint); the seed relies on
  the schema being up to date.
- **Disabling.** Set `SEED_ON_STARTUP=false` to skip seeding (for example in
  tests or production deployments that manage data separately).

Trade-offs: the seed does not delete rows removed from `seed-data.ts`, and it
assumes a single application instance starts at a time. For multi-instance
deployments the seed should run as a separate job or behind a database advisory
lock.

## Running locally

Requirements: Node.js 24, Yarn 4, Docker.

```bash
cp .env.example .env
yarn install
docker compose up -d
yarn prisma migrate deploy
yarn start:dev
```

Create a new migration after changing the schema:

```bash
yarn prisma migrate dev --name <name>
```

## Docker Compose

- `postgres` — PostgreSQL 17, database `business_card`, exposed on `5432`.
- `s3mock` — S3-compatible storage on `9090` with the `avatars` bucket.

## Environment variables

| Variable            | Description                              |
| ------------------- | ---------------------------------------- |
| `DATABASE_URL`      | PostgreSQL connection string             |
| `PORT`              | HTTP port                                |
| `NODE_ENV`          | Node environment                         |
| `SEED_ON_STARTUP`   | `false` disables automatic seeding       |
| `S3_ENDPOINT`       | S3 endpoint URL                          |
| `S3_REGION`         | S3 region                                |
| `S3_BUCKET`         | Bucket for uploaded files                |
| `S3_ACCESS_KEY`     | S3 access key                            |
| `S3_SECRET_KEY`     | S3 secret key                            |
| `S3_FORCE_PATH_STYLE` | `true` for local S3-compatible storage |

## Scripts

| Script | Description |
| --- | --- |
| `yarn build` | Compile the application |
| `yarn start:dev` | Start in watch mode |
| `yarn start:prod` | Run the compiled application |
| `yarn lint` | Run Oxlint |
| `yarn format` / `yarn format:check` | Format / verify formatting |
| `yarn prisma:generate` | Generate Prisma Client |
| `yarn prisma:migrate` | Apply migrations |
| `yarn prisma:studio` | Open Prisma Studio |
| `yarn db:reset` | Reset the database and re-apply migrations |
