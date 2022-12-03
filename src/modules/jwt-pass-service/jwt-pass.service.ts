import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class JwtPassService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async verifyJwt(token: string): Promise<string> {
    try {
      const secret = this.configService.get<string>('SECRET');
      const tokenId = await this.jwtService.verify(token, {
        publicKey: secret,
      });

      return tokenId;
    } catch (e) {
      console.log(e);
    }
  }
  async decodeJwt(token: string): Promise<{ id: string }> {
    const decodeToken = (await this.jwtService.decode(token, {
      complete: true,
    })) as { payload: { id: string } };
    return decodeToken.payload;
  }

  async createPassBcrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);
    return pass;
  }
  async checkPassBcrypt(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async createJwt(id: string, expiresIn: string): Promise<string> {
    const secret = this.configService.get<string>('SECRET');
    const payload = { id };
    return this.jwtService.sign(payload, { secret, expiresIn });
  }
}
