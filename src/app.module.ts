import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appdataSource } from './ormconfig';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forRoot(appdataSource),
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
