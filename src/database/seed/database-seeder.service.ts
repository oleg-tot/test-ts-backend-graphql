import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import { seedProfile } from './seed-data.js'

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name)

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.SEED_ON_STARTUP === 'false') {
      this.logger.log('Seed skipped (SEED_ON_STARTUP=false)')
      return
    }

    await this.seed()
    this.logger.log('Database seeded')
  }

  private async seed(): Promise<void> {
    const { id, name } = seedProfile

    await this.prisma.profile.upsert({
      where: { id },
      create: { id, name },
      update: { name },
    })
  }
}
