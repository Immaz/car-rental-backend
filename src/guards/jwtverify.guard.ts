import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

const jwt = require('jsonwebtoken');
@Injectable()
export class JwtverifyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    try {
      const jwt_secret = this.configService.get('JWT_SECRET');
      if (!request.headers.authorization) {
        throw new HttpException('JWT NOT FOUND!', 401);
      }
      const authtoken = request.headers.authorization.split('Bearer')[1].trim();
      const verification = jwt.verify(authtoken, jwt_secret);
      request.userId = verification.userId;
      request.role = verification.role;
      return true;
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 401);
    }
  }
}
