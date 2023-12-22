import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignupDto } from './signup.dto';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { ConfigService } from '@nestjs/config';

//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0MTIzNEBuYXZlci5jb20iLCJpYXQiOjE3MDMwODIwMTQsImV4cCI6MTcwMzA4MjAzNH0.Y7Ww2xN4hsckTVrWP9YNgRI_AkRv-oq_s-p_uYQfjqU",
// "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzAzMDgyMDE0LCJleHAiOjE3MDMwODM4MTR9.Shv5AWpxpf06lyoJyxANMB0F6pu5JIT0XeC9JFdP8z0"
@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
        private readonly configService: ConfigService,
    ) {}

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.findOneById(userId);

        // user의 토큰 값이 null일 경우 (refreshToken이 없을 경우)
        if (!user.currentHashedRefreshToken) {
            return null;
        }

        // 유저 테이블 내에 정의된 암호화된 refresh_token값과 요청 시 body에 담아준 refresh_token값 비교
        const isRefreshTokenMatching = await this.bcryptService.compare(
            refreshToken,
            user.currentHashedRefreshToken,
        );

        // 만약 isRefreshTokenMatching이 true라면 user 객체를 반환
        if (isRefreshTokenMatching) {
            return user;
        }
    }

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

        if (result) {
            throw new BadRequestException('이미 존재하는 이메일임미다');
        }

        return true;
    }

    // 리프레시 토큰을 받아 데이터베이스에 저장한다
    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const hashedRefreshToken = await this.refreshTokenHash(refreshToken);
        const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();

        await this.userRepository.updateRefreshToken(
            userId,
            hashedRefreshToken,
            currentRefreshTokenExp,
        );
    }

    // 데이터베이스에 저장할 리프레시 토큰을 암호화한다
    async refreshTokenHash(refreshToken: string) {
        const hashedRefreshToken = await this.bcryptService.hash(refreshToken);

        return hashedRefreshToken;
    }

    async getCurrentRefreshTokenExp() {
        // 현재 시간을 가져옴
        const currentDate = new Date();

        // date형식으로 db에 저장하기 위해 문자열을 숫자로 변환
        const refreshTokenExp = new Date(
            currentDate.getTime() +
                parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRES_TIME')),
        );

        return refreshTokenExp;
    }

    async getUserProfileByIdx(userIdx: number) {
        return this.userRepository.findOneByUserId(userIdx);
    }
}
