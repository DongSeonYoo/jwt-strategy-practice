import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './signup.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        await this.userService.signup(signupDto);

        return null;
    }
}
