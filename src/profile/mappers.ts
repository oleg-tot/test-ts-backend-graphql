import type {
  Achievement as PrismaAchievement,
  Experience as PrismaExperience,
  Link as PrismaLink,
  Profile as PrismaProfile,
  Project as PrismaProject,
  Skill as PrismaSkill,
} from '../generated/prisma/client.js'
import { Achievement } from './models/achievement.model.js'
import { Experience } from './models/experience.model.js'
import { Link } from './models/link.model.js'
import { Profile } from './models/profile.model.js'
import { Project } from './models/project.model.js'
import { Skill } from './models/skill.model.js'

export function toProfileModel(row: PrismaProfile): Profile {
  return Object.assign(new Profile(), row)
}

export function toLinkModel(row: PrismaLink): Link {
  return Object.assign(new Link(), row)
}

export function toSkillModel(row: PrismaSkill): Skill {
  return Object.assign(new Skill(), row)
}

export function toExperienceModel(row: PrismaExperience): Experience {
  return Object.assign(new Experience(), row)
}

export function toAchievementModel(row: PrismaAchievement): Achievement {
  return Object.assign(new Achievement(), row)
}

export function toProjectModel(row: PrismaProject): Project {
  return Object.assign(new Project(), row)
}
