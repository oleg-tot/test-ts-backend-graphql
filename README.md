# Digital Business Card API (simplified)

Minimal NestJS + Prisma + GraphQL example: a single `Profile` with two fields.

## Stack

- TypeScript, ESM, Node.js 24
- NestJS 12
- Prisma 7 + PostgreSQL 17 (`@prisma/adapter-pg`)
- GraphQL (Apollo, code-first)

## Run

```bash
cp .env.example .env
yarn install
docker compose up -d
yarn prisma migrate deploy
yarn start:dev
```

## API

`POST /graphql` — Apollo Sandbox at `http://localhost:8422/graphql`.

```graphql
query {
  profile {
    id
    name
  }
}
```

The database is seeded on startup by `DatabaseSeeder`; disable with
`SEED_ON_STARTUP=false`.
