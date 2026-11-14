import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Project } from '../models/project.model.js'
import { Skill } from '../models/skill.model.js'
import { ProfileService } from '../profile.service.js'

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly profileService: ProfileService) {}

  @ResolveField(() => [Skill])
  skills(@Parent() project: Project): Promise<Skill[]> {
    return this.profileService.getSkillsByProjectId(project.id)
  }
}
