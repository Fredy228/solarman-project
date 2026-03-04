import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileCron implements OnModuleInit {
  private readonly logger = new Logger(FileCron.name);

  constructor() {}

  async onModuleInit() {
    this.logger.log('FileCron initialized, starting scheduled tasks...');
    await this.cleanUpTempFiles();
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async cleanUpTempFiles() {
    const uploadsDir = path.resolve(process.cwd(), 'static', 'uploads');
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    const now = Date.now();

    try {
      const entries = await fs.readdir(uploadsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const filePath = path.join(uploadsDir, entry.name);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs >= twelveHoursMs) {
          await fs.unlink(filePath);
          this.logger.log(`Removed stale upload: ${entry.name}`);
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to clean uploads in ${uploadsDir}: ${error?.message ?? error}`,
      );
    }
  }
}
