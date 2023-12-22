import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './signup.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { request } from 'express';
import { User } from 'src/entities/user.entity';
import { UserDecorator } from 'src/auth/decorator/user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        await this.userService.signup(signupDto);

        return null;
    }

    // 본인 프로필 조회
    @Get()
    @UseGuards(JwtAuthGuard)
    getUserProfileByIdx(@UserDecorator() user: User) {
        return this.userService.getUserProfileByIdx(user.id);
    }
}
