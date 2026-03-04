import { Module } from '@nestjs/common';

import { FileCron } from './file.cron';
import { FileService } from './file.service';

@Module({
  providers: [FileService, FileCron],
  exports: [FileService],
})
export class FileModule {}
