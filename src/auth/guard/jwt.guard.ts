import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtAuthGurad implements CanActivate {
//     constructor(private readonly jwtService: JwtService) {}

//     async canActivate(context: ExecutionContext) {
//         try {
//             const req = context.switchToHttp().getRequest();
//             const accessToken = req.cookies['access_token'];
//             const user = await this.jwtService.verify(accessToken);

//             req.user = user;
//             return user;
//         } catch (error) {
//             console.error(error);
//             return false;
//         }
//     }
// }

@Injectable()
export class JwtAuthGurad extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req.cookies.access_token;
                },
            ]),
            ignoreExpiration: true,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    validate(payload: any) {
        const { id } = payload;

        return 'hello';
    }
}
