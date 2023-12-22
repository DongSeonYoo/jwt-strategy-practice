import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-strategy',
) {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.refresh_token;
                },
            ]),
            secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: Payload) {
        const refreshToken = req.cookies['refresh_token'];
        const user: User = await this.userService.getUserIfRefreshTokenMatches(
            refreshToken,
            payload.id,
        );
        return user;
    }
}
