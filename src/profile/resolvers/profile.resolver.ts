import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Experience } from '../models/experience.model.js'
import { Link } from '../models/link.model.js'
import { Profile } from '../models/profile.model.js'
import { Project } from '../models/project.model.js'
import { Skill } from '../models/skill.model.js'
import { ProfileService } from '../profile.service.js'

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, {
    nullable: true,
    description: 'Возвращает основной профиль специалиста',
  })
  profile(): Promise<Profile | null> {
    return this.profileService.getPrimaryProfile()
  }

  @ResolveField(() => [Link])
  links(@Parent() profile: Profile): Promise<Link[]> {
    return this.profileService.getLinksByProfileId(profile.id)
  }

  @ResolveField(() => [Skill])
  skills(@Parent() profile: Profile): Promise<Skill[]> {
    return this.profileService.getSkillsByProfileId(profile.id)
  }

  @ResolveField(() => [Experience])
  experience(@Parent() profile: Profile): Promise<Experience[]> {
    return this.profileService.getExperienceByProfileId(profile.id)
  }

  @ResolveField(() => [Project])
  projects(@Parent() profile: Profile): Promise<Project[]> {
    return this.profileService.getProjectsByProfileId(profile.id)
  }
}
