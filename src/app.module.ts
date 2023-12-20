import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appdataSource } from './ormconfig';
import { UserModule } from './user/user.module';
import { BcryptModule } from './common/bcrypt/bcrypt.module';

@Module({
    imports: [AuthModule, TypeOrmModule.forRoot(appdataSource), UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
