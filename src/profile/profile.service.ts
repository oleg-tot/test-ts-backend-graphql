import { Injectable } from '@nestjs/common'
import { toProfileModel } from './mappers.js'
import type { Profile } from './models/profile.model.js'
import { ProfileRepository } from './repositories/profile.repository.js'

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getPrimaryProfile(): Promise<Profile | null> {
    const row = await this.repository.findPrimary()

    return row ? toProfileModel(row) : null
  }
}
