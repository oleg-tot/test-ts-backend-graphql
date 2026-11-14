import type { ProfileUncheckedCreateInput } from '../../generated/prisma/models.js'

export const SEED_PROFILE_ID = 'profile-primary'

export type SeedProfile = ProfileUncheckedCreateInput

export const seedProfile = {
  id: SEED_PROFILE_ID,
  name: 'Oleg Grunov',
} satisfies SeedProfile
