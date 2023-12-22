import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGurad } from 'src/auth/guard/jwt.guard';

@Module({
    imports: [TypeOrmModule.forFeature([User]), BcryptModule, JwtModule],
    exports: [UserService],
    providers: [UserService, UserRepository, JwtAuthGurad],
    controllers: [UserController],
})
export class UserModule {}
