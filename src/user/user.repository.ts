import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOneByUserId(userId: number) {
        return this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
    }

    async findUserByEmail(email: string) {
        return this.userRepository.findOne({
            where: {
                email,
            },
        });
    }

    async signup(user: User) {
        return this.userRepository
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(user)
            .execute();
    }

    /**
     * @param userId 유저 아이디
     * @param refreshToken 리프레시 토큰
     * @param tokenExp 리프레시 토큰 만료일
     */
    async updateRefreshToken(userId: number, refreshToken: string, tokenExp: Date) {
        return this.userRepository.update(userId, {
            currentHashedRefreshToken: refreshToken,
            currentRefreshTokenExp: tokenExp,
        });
    }
}
