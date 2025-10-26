import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpException,
  Res,
  Patch,
  Get,
  Delete,
  Param,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  checkMailDto,
  CreateUserDto,
  EditUserDto,
  LoginDto,
  updatePassDto,
} from './dto/user.dto';
import { UsersService } from './users.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import express from 'express';
import { EmailService } from '../services/email.service';
import { Users } from './entities/users.entity';
import { JwtverifyGuard } from 'src/guards/jwtverify.guard';

@UseInterceptors(AnyFilesInterceptor())
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private emailService: EmailService,
  ) {}

  @Get('/verifyuser/:userId')
  async verify(@Param('userId') userId: any, @Res() res: express.Response) {
    const user = await this.userService.activateUser(userId);
    if (user) {
      res.redirect('http://localhost:3000/');
    } else {
      throw new HttpException('Something went wrong', 200);
    }
  }
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: express.Response) {
    const data = await this.userService.authenticate(dto, res);
    console.log(data);
    return {
      message: 'Login Success',
      data,
    };
  }

  @Post('/checkmail')
  async checkMail(@Body() dto: checkMailDto) {
    const userId = await this.userService.getIdbyEmail(dto.email);
    if (!userId) {
      throw new HttpException('Email not found', 200);
    }
    let message = await this.emailService.sendConfirmMail(dto.email, userId);
    return {
      message: message,
    };
  }
  @Patch()
  async updatePassword(@Body() dto: updatePassDto) {
    const modifiedCount = await this.userService.updatePassword(dto);
    return {
      message: `Update Record Count : ${modifiedCount}`,
    };
  }

  @Post()
  async create(@Body() dto: CreateUserDto, @Res() res: express.Response) {
    if (dto) {
      try {
        const created_user = await this.userService.create(dto);
        const responseObj = {
          status: 'success',
          status_code: 200,
          message: 'User Created',
          data: { userId: created_user?.id },
        };
        return responseObj;
      } catch (e) {
        throw new HttpException(e, 200);
      }
    }
  }

  @UseGuards(JwtverifyGuard)
  @Get()
  async getUsers(@Headers('Authorization') auth: string, @Request() req: any) {
    const token = auth.split('Bearer')[1].trim();
    if (req.role === 'admin') {
      const users = await this.userService.getUsers();
      return {
        message: 'Users',
        data: users,
      };
    } else {
      throw new HttpException('Action not allowed', 403);
    }
  }

  @UseGuards(JwtverifyGuard)
  @Get(':userId')
  async getUser(@Param('userId') userId: number) {
    const user = await this.userService.getUser(userId);
    return {
      data: { user },
      status_code: 200,
    };
  }

  @UseGuards(JwtverifyGuard)
  @Patch(':userId/edit')
  async patchUser(@Param('userId') userId: any, @Body() body: EditUserDto) {
    const user = await this.userService.patchUser(userId, body);
    return {
      data: { user },
      status_code: 200,
    };
  }

  @UseGuards(JwtverifyGuard)
  @Delete(':userId/delete')
  async deleteUser(@Param('userId') userId: any) {
    const users = await this.userService.deleteUser(userId);
    return {
      message: 'User Deleted',
      status_code: 200,
    };
  }

  @UseGuards(JwtverifyGuard)
  @Get('/getroles')
  async getRoles(@Headers('Authorization') auth: string) {
    const roles = await this.userService.getRoles(auth);
    return {
      data: { roles },
      status_code: 200,
    };
  }
}
