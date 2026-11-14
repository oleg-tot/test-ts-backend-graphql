import { Injectable } from '@nestjs/common'
import type {
  Achievement as PrismaAchievement,
  Experience as PrismaExperience,
  Link as PrismaLink,
  Profile as PrismaProfile,
  Project as PrismaProject,
  Skill as PrismaSkill,
} from '../../generated/prisma/client.js'
import { PrismaService } from '../../prisma/prisma.service.js'

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPrimary(): Promise<PrismaProfile | null> {
    return this.prisma.profile.findFirst({
      orderBy: { createdAt: 'asc' },
    })
  }

  findLinksByProfileId(profileId: string): Promise<PrismaLink[]> {
    return this.prisma.link.findMany({
      where: { profileId },
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
    })
  }

  findSkillsByProfileId(profileId: string): Promise<PrismaSkill[]> {
    return this.prisma.skill.findMany({
      where: { profileId },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
  }

  findExperienceByProfileId(profileId: string): Promise<PrismaExperience[]> {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    })
  }

  findProjectsByProfileId(profileId: string): Promise<PrismaProject[]> {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
  }

  findAchievementsByExperienceId(
    experienceId: string,
  ): Promise<PrismaAchievement[]> {
    return this.prisma.achievement.findMany({
      where: { experienceId },
      orderBy: [{ order: 'asc' }],
    })
  }

  findSkillsByProjectId(projectId: string): Promise<PrismaSkill[]> {
    return this.prisma.skill.findMany({
      where: { projects: { some: { id: projectId } } },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
  }
}
