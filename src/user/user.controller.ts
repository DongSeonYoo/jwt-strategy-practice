import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './signup.dto';
import { JwtAuthGurad } from 'src/auth/guard/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        await this.userService.signup(signupDto);

        return null;
    }

    @Get(':userIdx')
    // @UseGuards(JwtAuthGurad)
    @UseGuards(AuthGuard('jwt'))
    getUserProfileByIdx(@Param('userIdx', new ParseIntPipe()) userIdx: number) {
        return this.userService.getUserProfileByIdx(userIdx);
    }
}
