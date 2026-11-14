import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { Skill } from './skill.model.js'

@ObjectType({ description: 'Проект или pet-project' })
export class Project {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => String, { nullable: true })
  description!: string | null

  @Field(() => String, { nullable: true })
  url!: string | null

  @Field(() => String, { nullable: true })
  repositoryUrl!: string | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate!: Date | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate!: Date | null

  @Field()
  featured!: boolean

  @Field(() => [Skill])
  skills!: Skill[]
}
