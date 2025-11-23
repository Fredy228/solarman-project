import { HttpStatus, Injectable } from '@nestjs/common';

import { RegisterDto } from './dto/register-user.dto';
import { AuthErrorMessage } from '../../common/messages/error/auth.message';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { HashService } from '../../libs/hash/hash.service';
import { PrismaService } from '../../libs/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly hashService: HashService,
    private readonly prisma: PrismaService,
  ) {}

  async create({ email, password, name, role }: RegisterDto) {
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
    });

    return newUser;
  }
}
