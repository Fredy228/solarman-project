import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async createHash(data: string): Promise<string> {
    const rounds = this.configService.get<number>('SALT_ROUNDS');
    const salt = await bcrypt.genSalt(rounds);
    return bcrypt.hash(data, salt);
  }

  async compareHash(candidate: string, hash: string): Promise<boolean> {
    return bcrypt.compare(candidate, hash);
  }
}
