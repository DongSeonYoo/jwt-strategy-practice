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

    async isExistEmail(email: string) {
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
}
