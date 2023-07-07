import {
    ExecutionContext,
    SetMetadata,
    createParamDecorator,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

// custom interceptor res message - decorator("res_message")
export const RESPONSE_MESSAGE = 'responseMessage';
export const ResponseMessage = (message: string) => {
    return SetMetadata(RESPONSE_MESSAGE, message);
};
