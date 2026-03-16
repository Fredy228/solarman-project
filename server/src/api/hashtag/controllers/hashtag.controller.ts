import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Hashtag, Role } from '@prisma/client';
import { JoiPipe } from 'nestjs-joi';

import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Lang } from '../../../common/decorator/lang.decorator';
import { Language } from '../../../common/enums/language.enum';
import { HashtagCreateDto } from '../dto/hashtag.create.dto';
import { HashtagUpdateDto } from '../dto/hashtag.update.dto';
import { HashtagService } from '../services/hashtag.service';

@UseGuards(RolesGuard)
@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async create(
    @Body(JoiPipe) createHashtagDto: HashtagCreateDto,
    @Lang() lang: Language,
  ): Promise<Hashtag> {
    return this.hashtagService.create(createHashtagDto, lang);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getOne(
    @Param('id') id: string,
    @Lang() lang: Language,
  ): Promise<Hashtag> {
    return this.hashtagService.getOne(id, lang);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async update(
    @Param('id') id: string,
    @Body(JoiPipe) updateHashtagDto: HashtagUpdateDto,
    @Lang() lang: Language,
  ): Promise<Hashtag> {
    return this.hashtagService.update(id, updateHashtagDto, lang);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async delete(@Param('id') id: string, @Lang() lang: Language): Promise<void> {
    await this.hashtagService.delete(id, lang);
  }
}
