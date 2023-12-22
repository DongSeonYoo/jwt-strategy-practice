import { Exclude, Expose } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_tb' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ length: 255 })
    email: string;

    @Column({ name: 'first_name', length: 100 })
    firstName: string;

    @Column({ name: 'last_name', length: 100 })
    lastName: string;

    @Column({ default: 'GUEST' })
    role: string;

    @CreateDateColumn({ name: 'created_at', select: false })
    createdAt?: Date;

    @CreateDateColumn({ name: 'updated_at', select: false })
    updatedAt?: Date;

    // refresh token 저장
    @Exclude()
    @Column({
        name: 'current_hashed_refresh_token',
        nullable: true,
    })
    currentHashedRefreshToken?: string;

    // refresh token의 만료 시간 저장
    @Exclude()
    @Column({ type: 'timestamp with time zone', nullable: true })
    currentRefreshTokenExp?: Date;
}
