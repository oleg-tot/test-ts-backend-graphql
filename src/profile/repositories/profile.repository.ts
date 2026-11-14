import { Injectable } from '@nestjs/common'
import type { Profile as PrismaProfile } from '../../generated/prisma/client.js'
import { PrismaService } from '../../prisma/prisma.service.js'

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPrimary(): Promise<PrismaProfile | null> {
    return this.prisma.profile.findFirst()
  }
}
