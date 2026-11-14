import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { Achievement } from './achievement.model.js'

@ObjectType({ description: 'Опыт работы' })
export class Experience {
  @Field(() => ID)
  id!: string

  @Field()
  company!: string

  @Field()
  position!: string

  @Field(() => GraphQLISODateTime)
  startDate!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate!: Date | null

  @Field({ description: 'Работает ли специалист здесь сейчас' })
  isCurrent!: boolean

  @Field(() => String, { nullable: true })
  location!: string | null

  @Field(() => String, { nullable: true })
  summary!: string | null

  @Field(() => [Achievement])
  achievements!: Achievement[]
}
