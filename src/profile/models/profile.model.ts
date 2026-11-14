import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'Публичный профиль специалиста' })
export class Profile {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}
