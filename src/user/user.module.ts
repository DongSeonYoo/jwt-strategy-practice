import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
import { UserRepository } from './user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([User]), BcryptModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
})
export class UserModule {}
