import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LinkType } from './enums.js'

@ObjectType({ description: 'Ссылка на профессиональный ресурс' })
export class Link {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string

  @Field()
  url!: string

  @Field(() => LinkType)
  type!: LinkType
}
