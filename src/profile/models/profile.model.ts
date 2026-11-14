import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Experience } from './experience.model.js'
import { Link } from './link.model.js'
import { Project } from './project.model.js'
import { Skill } from './skill.model.js'

@ObjectType({ description: 'Публичный профиль специалиста' })
export class Profile {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  headline!: string

  @Field()
  description!: string

  @Field(() => String, { nullable: true })
  location!: string | null

  @Field(() => String, { nullable: true })
  email!: string | null

  @Field(() => String, { nullable: true })
  avatarUrl!: string | null

  @Field(() => [Link])
  links!: Link[]

  @Field(() => [Skill])
  skills!: Skill[]

  @Field(() => [Experience])
  experience!: Experience[]

  @Field(() => [Project])
  projects!: Project[]
}
