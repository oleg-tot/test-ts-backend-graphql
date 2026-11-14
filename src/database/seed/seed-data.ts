import { LinkType, SkillCategory } from '../../generated/prisma/enums.js'
import type {
  AchievementUncheckedCreateInput,
  ExperienceUncheckedCreateInput,
  LinkUncheckedCreateInput,
  ProfileUncheckedCreateInput,
  ProjectUncheckedCreateInput,
  SkillUncheckedCreateInput,
} from '../../generated/prisma/models.js'

export const SEED_PROFILE_ID = 'profile-primary'

export type SeedProfile = ProfileUncheckedCreateInput

export type SeedLink = Omit<LinkUncheckedCreateInput, 'profileId'> & {
  id: string
}

export type SeedSkill = Omit<SkillUncheckedCreateInput, 'profileId'> & {
  id: string
}

export type SeedAchievement = Omit<
  AchievementUncheckedCreateInput,
  'experienceId'
> & {
  id: string
}

export type SeedExperience = Omit<
  ExperienceUncheckedCreateInput,
  'profileId' | 'achievements'
> & {
  id: string
  achievements: SeedAchievement[]
}

export type SeedProject = Omit<
  ProjectUncheckedCreateInput,
  'profileId' | 'skills'
> & {
  id: string
  skillIds: string[]
}

export const seedProfile = {
  id: SEED_PROFILE_ID,
  name: 'Oleg Grunov',
  headline: 'Senior Frontend Engineer · Vue.js / TypeScript',
  description:
    'Frontend developer with 10 years of experience building production web applications. Focused on TypeScript, Vue.js and clean architecture, with hands-on Node.js and GraphQL on the backend.',
  location: 'Remote',
  email: null,
  avatarUrl: null,
} satisfies SeedProfile

export const seedLinks = [
  {
    id: 'link-github',
    label: 'GitHub',
    url: 'https://github.com/',
    type: LinkType.GITHUB,
    order: 0,
  },
  {
    id: 'link-linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/',
    type: LinkType.LINKEDIN,
    order: 1,
  },
  {
    id: 'link-website',
    label: 'Website',
    url: 'https://example.com',
    type: LinkType.WEBSITE,
    order: 2,
  },
  {
    id: 'link-telegram',
    label: 'Telegram',
    url: 'https://t.me/',
    type: LinkType.TELEGRAM,
    order: 3,
  },
] satisfies SeedLink[]

export const seedSkills = [
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    category: SkillCategory.LANGUAGE,
    level: 5,
    order: 0,
  },
  {
    id: 'skill-javascript',
    name: 'JavaScript',
    category: SkillCategory.LANGUAGE,
    level: 5,
    order: 1,
  },
  {
    id: 'skill-vue',
    name: 'Vue.js',
    category: SkillCategory.FRAMEWORK,
    level: 5,
    order: 2,
  },
  {
    id: 'skill-nodejs',
    name: 'Node.js',
    category: SkillCategory.FRAMEWORK,
    level: 4,
    order: 3,
  },
  {
    id: 'skill-nestjs',
    name: 'NestJS',
    category: SkillCategory.FRAMEWORK,
    level: 4,
    order: 4,
  },
  {
    id: 'skill-graphql',
    name: 'GraphQL',
    category: SkillCategory.FRAMEWORK,
    level: 4,
    order: 5,
  },
  {
    id: 'skill-prisma',
    name: 'Prisma',
    category: SkillCategory.TOOLING,
    level: 4,
    order: 6,
  },
  {
    id: 'skill-postgresql',
    name: 'PostgreSQL',
    category: SkillCategory.DATABASE,
    level: 4,
    order: 7,
  },
  {
    id: 'skill-docker',
    name: 'Docker',
    category: SkillCategory.DEVOPS,
    level: 3,
    order: 8,
  },
  {
    id: 'skill-git',
    name: 'Git',
    category: SkillCategory.TOOLING,
    level: 5,
    order: 9,
  },
] satisfies SeedSkill[]

export const seedExperience = [
  {
    id: 'experience-freelance',
    company: 'Freelance / Contract',
    position: 'Senior Frontend Developer',
    startDate: new Date('2018-01-01'),
    endDate: null,
    isCurrent: true,
    location: 'Remote',
    summary:
      'Building and maintaining Vue.js + TypeScript applications, designing frontend architecture and collaborating on Node.js/GraphQL backends.',
    order: 0,
    achievements: [
      {
        id: 'achievement-freelance-1',
        description:
          'Led migration of a large Vue 2 codebase to Vue 3 and TypeScript.',
        order: 0,
      },
      {
        id: 'achievement-freelance-2',
        description:
          'Introduced shared component library and reduced UI duplication.',
        order: 1,
      },
    ],
  },
  {
    id: 'experience-studio',
    company: 'Web Studio',
    position: 'Frontend Developer',
    startDate: new Date('2014-06-01'),
    endDate: new Date('2017-12-31'),
    isCurrent: false,
    location: null,
    summary: 'Delivered responsive web applications and internal dashboards.',
    order: 1,
    achievements: [
      {
        id: 'achievement-studio-1',
        description: 'Built reusable UI toolkit used across client projects.',
        order: 0,
      },
    ],
  },
] satisfies SeedExperience[]

export const seedProjects = [
  {
    id: 'project-business-card',
    name: 'Digital Business Card API',
    description:
      'NestJS + Prisma + GraphQL backend exposing a profile with skills, experience and projects. Includes DataLoader-based relation loading.',
    url: null,
    repositoryUrl: 'https://github.com/',
    startDate: new Date('2026-11-01'),
    endDate: null,
    featured: true,
    order: 0,
    skillIds: [
      'skill-typescript',
      'skill-nodejs',
      'skill-nestjs',
      'skill-graphql',
      'skill-prisma',
      'skill-postgresql',
      'skill-docker',
    ],
  },
  {
    id: 'project-admin-dashboard',
    name: 'Admin Dashboard',
    description:
      'Vue.js + TypeScript dashboard with role-based access and data tables.',
    url: 'https://example.com',
    repositoryUrl: 'https://github.com/',
    startDate: new Date('2021-03-01'),
    endDate: null,
    featured: false,
    order: 1,
    skillIds: ['skill-typescript', 'skill-vue', 'skill-javascript'],
  },
] satisfies SeedProject[]
