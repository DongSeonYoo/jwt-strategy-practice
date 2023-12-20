import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_TIME'),
                },
            }),
            inject: [ConfigService],
        }),
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, BcryptService, UserRepository, ConfigService],
})
export class AuthModule {}
