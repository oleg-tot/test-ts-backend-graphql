import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { SkillCategory } from './enums.js'

@ObjectType({ description: 'Профессиональный навык' })
export class Skill {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => SkillCategory)
  category!: SkillCategory

  @Field(() => Int, { description: 'Уровень владения от 1 до 5' })
  level!: number
}
