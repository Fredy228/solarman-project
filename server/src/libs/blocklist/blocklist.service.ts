import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlocklistService implements OnModuleInit {
  private readonly logger = new Logger(BlocklistService.name);
  private readonly blockedIds = new Set<string>();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const blocked = await this.prisma.user.findMany({
      where: { isBlocked: true },
      select: { id: true },
    });
    blocked.forEach(({ id }) => this.blockedIds.add(id));
    this.logger.log(`Blocklist loaded: ${this.blockedIds.size} user(s)`);
  }

  isBlocked(userId: string): boolean {
    return this.blockedIds.has(userId);
  }

  async block(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: true },
    });
    await this.prisma.userDevice.deleteMany({ where: { userId } });
    this.blockedIds.add(userId);
    this.logger.log(`User ${userId} blocked and all devices invalidated`);
  }

  async unblock(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: false },
    });
    this.blockedIds.delete(userId);
    this.logger.log(`User ${userId} unblocked`);
  }
}
