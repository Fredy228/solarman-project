import { Global, Module } from '@nestjs/common';

import { BlocklistService } from './blocklist.service';

@Global()
@Module({
  providers: [BlocklistService],
  exports: [BlocklistService],
})
export class BlocklistModule {}
