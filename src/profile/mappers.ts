import type { Profile as PrismaProfile } from '../generated/prisma/client.js'
import { Profile } from './models/profile.model.js'

export function toProfileModel(row: PrismaProfile): Profile {
  return Object.assign(new Profile(), row)
}
