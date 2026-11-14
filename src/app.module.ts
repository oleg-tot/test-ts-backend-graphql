import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module.js'
import { GraphqlModule } from './graphql/graphql.module.js'
import { HealthModule } from './health/health.module.js'
import { ProfileModule } from './profile/profile.module.js'

@Module({
  imports: [GraphqlModule, DatabaseModule, ProfileModule, HealthModule],
})
export class AppModule {}
