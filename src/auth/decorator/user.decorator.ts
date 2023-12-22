import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

export const UserDecorator = createParamDecorator(
    (data, context: ExecutionContext): User => {
        const req = context.switchToHttp().getRequest();

        return req.user;
    },
);
