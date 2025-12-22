import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../libs/prisma/prisma.service';
import { defaultGlobalParam } from './data/default-global-param';

@Injectable()
export class GlobalParamService implements OnModuleInit {
  private readonly logger = new Logger(GlobalParamService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const defaultParamsArray = Object.entries(defaultGlobalParam);

      const existingParams = await this.prisma.globalParam.findMany({
        where: {
          name: { in: defaultParamsArray.map(([key]) => key) },
        },
        select: { name: true },
      });

      const existingNames = new Set(existingParams.map((p) => p.name));

      const dataToCreate = defaultParamsArray
        .filter(([key]) => !existingNames.has(key))
        .map(
          ([key, value]): Prisma.GlobalParamCreateManyInput => ({
            name: key,
            value: value.value as Prisma.InputJsonValue,
            description: value.description,
            title: value.title,
          }),
        );

      if (dataToCreate.length > 0) {
        await this.prisma.globalParam.createMany({
          data: dataToCreate,
        });
      }
      this.logger.log('Global parameters initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing Global Params', error.stack);
    }
  }
}
