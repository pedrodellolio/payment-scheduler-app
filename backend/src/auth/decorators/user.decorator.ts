import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Types.ObjectId => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.userId;
  },
);
