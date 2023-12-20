import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto);
        const accessToken = await this.authService.generateAccessToken(user);
        const refreshToken = await this.authService.generateRefreshToken(user);

        return {
            accessToken,
            refreshToken,
        };
    }
}
