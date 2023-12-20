import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
    async hash(plainPassword: string) {
        const salt = 10;

        return await hash(plainPassword, salt);
    }

    async compare(plainPassword: string, hashedPassword: string) {
        return compare(plainPassword, hashedPassword);
    }
}
