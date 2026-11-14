import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module.js'
import { ProfileRepository } from './repositories/profile.repository.js'
import { ExperienceResolver } from './resolvers/experience.resolver.js'
import { ProfileResolver } from './resolvers/profile.resolver.js'
import { ProjectResolver } from './resolvers/project.resolver.js'
import { ProfileService } from './profile.service.js'

@Module({
  imports: [PrismaModule],
  providers: [
    ProfileService,
    ProfileRepository,
    ProfileResolver,
    ExperienceResolver,
    ProjectResolver,
  ],
})
export class ProfileModule {}
