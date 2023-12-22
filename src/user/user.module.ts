import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtAuthStrategy } from 'src/auth/strategy/jwt-strategy';

@Module({
    imports: [TypeOrmModule.forFeature([User]), BcryptModule, JwtModule],
    exports: [UserService],
    providers: [UserService, UserRepository, JwtAuthGuard, JwtAuthStrategy],
    controllers: [UserController],
})
export class UserModule {}
