import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('/login')
    @UseGuards(LocalAuthGuard)
    @ResponseMessage('User login')
    handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Get('/account')
    @ResponseMessage('Get account information')
    handleGetAccount(@User() user: IUser) {
        return { user };
    }

    @Public()
    @ResponseMessage('Register a new user')
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.registerUser(registerUserDto);
    }

    @Public()
    @Get('/refresh')
    @ResponseMessage('Refresh Token')
    handleRefreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = req.cookies['refreshToken'];
        return this.authService.refreshNewToken(refreshToken, response);
    }
}
