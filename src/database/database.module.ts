import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module.js'
import { DatabaseSeeder } from './seed/database-seeder.service.js'

@Module({
  imports: [PrismaModule],
  providers: [DatabaseSeeder],
})
export class DatabaseModule {}
