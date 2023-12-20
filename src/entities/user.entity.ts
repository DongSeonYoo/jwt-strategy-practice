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
  @Column({
    name: 'current_hashed_refresh_token',
    nullable: true,
  })
  currentHashedRefreshToken?: string;
}
