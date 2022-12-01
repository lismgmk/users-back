import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PureRefreshToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies.refreshToken;
  },
);
