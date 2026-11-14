import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import {
  seedExperience,
  seedLinks,
  seedProfile,
  seedProjects,
  seedSkills,
} from './seed-data.js'

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
    await this.prisma.$transaction(
      async (tx) => {
        const { id: profileId, ...profile } = seedProfile

        await tx.profile.upsert({
          where: { id: profileId },
          create: { id: profileId, ...profile },
          update: profile,
        })

        for (const link of seedLinks) {
          const { id, ...data } = link
          await tx.link.upsert({
            where: { id },
            create: { id, profileId, ...data },
            update: data,
          })
        }

        for (const skill of seedSkills) {
          const { id, ...data } = skill
          await tx.skill.upsert({
            where: { id },
            create: { id, profileId, ...data },
            update: data,
          })
        }

        for (const experience of seedExperience) {
          const { id, achievements, ...data } = experience
          await tx.experience.upsert({
            where: { id },
            create: { id, profileId, ...data },
            update: data,
          })

          for (const achievement of achievements) {
            const { id: achievementId, ...achievementData } = achievement
            await tx.achievement.upsert({
              where: { id: achievementId },
              create: {
                id: achievementId,
                experienceId: id,
                ...achievementData,
              },
              update: achievementData,
            })
          }
        }

        for (const project of seedProjects) {
          const { id, skillIds, ...data } = project
          await tx.project.upsert({
            where: { id },
            create: {
              id,
              profileId,
              ...data,
              skills: { connect: skillIds.map((skillId) => ({ id: skillId })) },
            },
            update: {
              ...data,
              skills: { set: skillIds.map((skillId) => ({ id: skillId })) },
            },
          })
        }
      },
      { timeout: 30_000 },
    )
  }
}
