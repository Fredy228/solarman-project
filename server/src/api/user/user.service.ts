import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

import { RegisterDto } from './dto/register-user.dto';
import { AuthErrorMessage } from '../../common/messages/error/auth.message';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { HashService } from '../../libs/hash/hash.service';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { TUserPublic } from '../../common/types/user.type';
import { UserErorMessage } from '../../common/messages/error/user.message';

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
      role: Role.ADMIN,
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
        HttpStatus.UNAUTHORIZED,
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
      },
    });

    if (!user)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        UserErorMessage.NOT_FOUND,
      );

    return user;
  }
}
