import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { BaseQueryGetManyDto } from '../../../common/dto/base-query-get-many.dto';
import { portfolioSchema } from '../../../common/validators/portfolio.schema';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GoodsBrandGetManyQueryDto extends BaseQueryGetManyDto {
  @JoiSchema(portfolioSchema.extract('name').optional().allow(''))
  name_like?: string;
}
