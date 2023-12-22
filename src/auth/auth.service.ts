import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async refresh(refreshTokenDto: RefreshTokenDto) {
        const { refresh_token } = refreshTokenDto;

        const decodedRefreshToken: Payload = this.jwtService.verify(refresh_token, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        });

        const userId = decodedRefreshToken.id;
        const user = await this.userService.getUserIfRefreshTokenMatches(
            refresh_token,
            userId,
        );
        if (!user) {
            throw new UnauthorizedException('user가 없음미다');
        }

        const accessToken = await this.generateAccessToken(user);
        return accessToken;
    }

    async validateUser(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException('아이디 또는 비밀번호가 올바르지 않습니다');
        }

        const passwordMatch = await this.bcryptService.compare(password, user.password);
        if (!passwordMatch) {
            throw new BadRequestException('아이디 또는 비밀번호가 올바르지 않습니다');
        }

        return user;
    }

    /**
     *
     * @param user 유저 정보를 바탕으로 accesToken을 생성한다
     */
    async generateAccessToken(user: User) {
        const payload: Payload = {
            id: user.id,
            email: user.email,
        };
        return this.jwtService.signAsync(payload);
    }

    /**
     *
     * @param user 유저 정보를 바탕으로 refreshToken을 생성한다
     */
    async generateRefreshToken(user: User) {
        return this.jwtService.signAsync(
            { id: user.id },
            {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_TIME'),
            },
        );
    }
}
