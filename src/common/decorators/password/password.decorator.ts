import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export const HashPassword = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const password = request.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    request.body.password = hashPassword;
    return request.body;
  },
);
