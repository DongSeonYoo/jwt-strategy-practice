import { IsNotEmpty } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class SignupDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    toEntity(hashedPassword: string): User {
        const user = new User();
        user.username = this.username;
        user.email = this.email;
        user.password = hashedPassword;
        user.firstName = this.firstName;
        user.lastName = this.lastName;

        return user;
    }
}
