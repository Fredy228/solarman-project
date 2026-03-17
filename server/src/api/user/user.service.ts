import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, type Prisma, type User } from '@prisma/client';

import { AuthErrorMessage } from '../../common/messages/error/auth.message';
import { UserErorMessage } from '../../common/messages/error/user.message';
import { TUserPublic } from '../../common/types/user.type';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { generatePrismaDateFilter } from '../../helpers/prisma/generate-prisma-date-filter';
import { generatePrismaPaginateOption } from '../../helpers/prisma/generate-prisma-paginate-option';
import { HashService } from '../../libs/hash/hash.service';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { RegisterDto } from './dto/register-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserGetManyQueryDto } from './dto/user-get-many.query.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly hashService: HashService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.get<string>('DEFAULT_ADMIN_EMAIL');
    const adminPass = this.configService.get<string>('DEFAULT_ADMIN_PASS');

    if (!adminEmail || !adminPass) return;

    const existUser = await this.prisma.user.findFirst({
      where: {
        email: adminEmail,
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (existUser) return;

    this.create({
      email: adminEmail,
      password: adminPass,
      name: 'Admin',
      role: Role.TECHNICIAN,
    })
      .then(() => this.logger.log('Successful created admin'))
      .catch((err) => this.logger.error('Error create admin', err));
  }

  async create({
    email,
    password,
    name,
    role,
  }: RegisterDto): Promise<TUserPublic> {
    const existUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (existUser)
      throw new CustomHttpExceptionUtil(
        HttpStatus.BAD_REQUEST,
        AuthErrorMessage.REGISTER_USER_EXIST,
      );

    const hashPass = await this.hashService.createHash(password);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashPass,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return newUser;
  }

  async findUserById(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        UserErorMessage.NOT_FOUND,
      );

    return user;
  }

  async getAll(query: UserGetManyQueryDto) {
    const {
      _start,
      _end,
      _sort,
      _order,
      createdAt,
      createdAt_gte,
      createdAt_lte,
      updatedAt,
      updatedAt_gte,
      updatedAt_lte,
      ...filters
    } = query;

    const whereOption: Prisma.UserWhereInput = {
      email: {
        contains: filters.email_like,
        mode: 'insensitive',
      },
      name: {
        contains: filters.name_like,
        mode: 'insensitive',
      },
      phone: {
        contains: filters.phone_like,
        mode: 'default',
      },
      role: filters.role,
      isBlocked: filters.isBlocked,
      createdAt: generatePrismaDateFilter({
        date: createdAt,
        date_gte: createdAt_gte,
        date_lte: createdAt_lte,
      }),
      updatedAt: generatePrismaDateFilter({
        date: updatedAt,
        date_gte: updatedAt_gte,
        date_lte: updatedAt_lte,
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isBlocked: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({
        where: whereOption,
      }),
    ]);

    return { data, total };
  }

  async updateUser(userId: string, body: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(userId);

    const updateData: Prisma.UserUpdateInput = {
      ...body,
    };

    if (body.password) {
      const hashPass = await this.hashService.createHash(body.password);
      updateData.password = hashPass;
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateData,
    });
  }

  async deleteById(id: string) {
    await this.findUserById(id);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
