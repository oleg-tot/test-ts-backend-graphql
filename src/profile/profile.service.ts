import { Injectable } from '@nestjs/common'
import {
  toAchievementModel,
  toExperienceModel,
  toLinkModel,
  toProfileModel,
  toProjectModel,
  toSkillModel,
} from './mappers.js'
import type { Achievement } from './models/achievement.model.js'
import type { Experience } from './models/experience.model.js'
import type { Link } from './models/link.model.js'
import type { Profile } from './models/profile.model.js'
import type { Project } from './models/project.model.js'
import type { Skill } from './models/skill.model.js'
import { ProfileRepository } from './repositories/profile.repository.js'

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getPrimaryProfile(): Promise<Profile | null> {
    const row = await this.repository.findPrimary()

    return row ? toProfileModel(row) : null
  }

  async getLinksByProfileId(profileId: string): Promise<Link[]> {
    const rows = await this.repository.findLinksByProfileId(profileId)

    return rows.map(toLinkModel)
  }

  async getSkillsByProfileId(profileId: string): Promise<Skill[]> {
    const rows = await this.repository.findSkillsByProfileId(profileId)

    return rows.map(toSkillModel)
  }

  async getExperienceByProfileId(profileId: string): Promise<Experience[]> {
    const rows = await this.repository.findExperienceByProfileId(profileId)

    return rows.map(toExperienceModel)
  }

  async getProjectsByProfileId(profileId: string): Promise<Project[]> {
    const rows = await this.repository.findProjectsByProfileId(profileId)

    return rows.map(toProjectModel)
  }

  async getAchievementsByExperienceId(
    experienceId: string,
  ): Promise<Achievement[]> {
    const rows =
      await this.repository.findAchievementsByExperienceId(experienceId)

    return rows.map(toAchievementModel)
  }

  async getSkillsByProjectId(projectId: string): Promise<Skill[]> {
    const rows = await this.repository.findSkillsByProjectId(projectId)

    return rows.map(toSkillModel)
  }
}
