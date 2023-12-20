import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';

dotenv.config();

export const appdataSource: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: 5432,
  username: process.env.POSTGRESQL_USERNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DATABASE,
  entities: [User],
  autoLoadEntities: true,
  synchronize: true, //첫 시작은 true, 나머지는 계속 false
  logging: true, //쿼리문 로그
  keepConnectionAlive: true, //핫 리로딩 시 연결 차단 막기
  migrationsRun: false,
};
