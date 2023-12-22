import {
    Body,
    Controller,
    Post,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto);
        const accessToken = await this.authService.generateAccessToken(user);
        const refreshToken = await this.authService.generateRefreshToken(user);
        await this.userService.setCurrentRefreshToken(refreshToken, user.id);

        return {
            accessToken,
            refreshToken,
        };
    }

    @Post('refresh')
    async refresh(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
            const newAccessToken = await this.authService.refresh(refreshTokenDto);
            res.setHeader('Authorization', 'Bearer' + newAccessToken);
            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
            });
            res.send({ newAccessToken });
        } catch (error) {
            throw new UnauthorizedException('refresh token 이 유효하지 않읍니다');
        }
    }
}
