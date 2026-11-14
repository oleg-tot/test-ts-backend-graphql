import { registerEnumType } from '@nestjs/graphql'
import { LinkType, SkillCategory } from '../../generated/prisma/enums.js'

registerEnumType(LinkType, {
  name: 'LinkType',
  description: 'Тип профессиональной ссылки в профиле',
})

registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Категория навыка',
})

export { LinkType, SkillCategory }
