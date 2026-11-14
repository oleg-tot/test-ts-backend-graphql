import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'Достижение на конкретном месте работы' })
export class Achievement {
  @Field(() => ID)
  id!: string

  @Field()
  description!: string
}
