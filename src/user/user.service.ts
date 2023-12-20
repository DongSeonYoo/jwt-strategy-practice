import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './user.repository';
import { SignupDto } from './signup.dto';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
    ) {}

    async signup(dto: SignupDto) {
        const { email, password } = dto;

        await this.isExistEmail(email);

        const hashedPassword = await this.bcryptService.hash(password);

        const user = dto.toEntity(hashedPassword);

        await this.userRepository.signup(user);
    }

    async findOneById(id: number) {
        const user = await this.userRepository.findOneByUserId(id);

        if (!user) {
            throw new NotFoundException('해당하는 유저가 없음니다');
        }

        return user;
    }

    async findUserByEmail(email: string) {
        const result = await this.userRepository.findUserByEmail(email);

        if (!result) {
            return false;
        }

        return result;
    }

    async isExistEmail(email: string) {
        const result = await this.userRepository.findUserByEmail(email);

        if (!result) {
            throw new BadRequestException('이미 존재하는 이메일임미다');
        }

        return true;
    }
}
