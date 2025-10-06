import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }
  refresh(req) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new HttpException('No refresh token', 401);
    }

    try {
      const decoded: any = jwt.verify(
        refreshToken,
        this.configService.get('REFRESH_SECRET'),
      );

      const newAccessToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role },
        this.configService.get('JWT_SECRET'),
        { expiresIn: '15m' },
      );

      return {
        message: 'new token generated',
        data: { accessToken: newAccessToken },
      };
    } catch (e) {
      throw new HttpException('Invalid refresh token', 403);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
