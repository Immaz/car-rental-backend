import {
  Injectable,
  HttpException,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Users } from './entities/users.entity';
import { CreateUserDto, LoginDto, updatePassDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/services/email.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import express from 'express';

const generateHash = async (plaintext: string): Promise<string> => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plaintext, saltRounds);
  return hash;
};

@Injectable()
export class UsersService {
  allowedroles: { [key: string]: string[] };

  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async activateUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new HttpException('User not found', 404);
    user.active = true;
    return this.userRepository.save(user);
  }

  async create(user_dto: CreateUserDto) {
    try {
      user_dto.password = await generateHash(user_dto.password);
      user_dto.active = false;

      const user: any = this.userRepository.create(user_dto);
      const savedUser = await this.userRepository.save(user);

      await this.emailService.sendConfirmMail(savedUser.email, savedUser.id);

      return savedUser;
    } catch (e) {
      if ((e.code as string).trim() === '23505') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(e, 200);
    }
  }

  async getIdbyEmail(email: string): Promise<number | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user?.id;
  }

  async updatePassword(dto: updatePassDto): Promise<number> {
    const hash = await generateHash(dto.password);
    const result = await this.userRepository.update(dto.userId, {
      password: hash,
    });
    return result.affected || 0;
  }

  async getUsers() {
    try {
      const users = await this.userRepository.find({
        order: { id: 'ASC' },
      });
      return users;
    } catch (e) {
      throw new HttpException(e.message || e, 401);
    }
  }

  async getUser(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async patchUser(userId: number, body: Partial<Users>): Promise<any> {
    await this.userRepository.update(userId, body);
    return this.getUser(userId);
  }

  async deleteUser(user_id: number) {
    await this.userRepository.delete(user_id);
    return this.userRepository.find();
  }

  async getRoles(authHeader: string): Promise<string[]> {
    const authToken = authHeader.split('Bearer')[1].trim();
    const { userId, role } = jwt.verify(
      authToken,
      this.configService.get('JWT_SECRET'),
    ) as {
      userId: number;
      role: string;
    };
    const allowedRoles = this.allowedroles[role];
    return allowedRoles;
  }

  async authenticate(dto: LoginDto, @Res() res: express.Response) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new HttpException('User Not Found', 404);
    if (!user.active) throw new HttpException('User Not Active', 403);

    const auth = await bcrypt.compare(dto.password, user.password);

    if (!auth) throw new HttpException('Login Failed', 401);

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: '15m',
      },
    );
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      this.configService.get('REFRESH_SECRET'),
      {
        expiresIn: '3d',
      },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, //http
      sameSite: 'strict', //CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    });
    return {
      accessToken: token,
      expiresIn: 3600,
      userId: user.id,
      role: user.role,
      name: user.first_name + ' ' + user.last_name,
    };
  }
}
