import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        let user = await this.usersService.findOneByUserName(username);
        if (user) {
            let password = user.password;
            const isValid = this.usersService.isValidPassword(pass, password);
            if (isValid) {
                return user;
            }
        }
        return null;
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_KEY_SECRET'),
            expiresIn:
                ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
        });
        return refreshToken;
    };

    async login(user: IUser, response: Response) {
        const { _id, name, email, phoneNumber, role } = user;
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            name,
            email,
            // phoneNumber,
            role,
        };

        const refreshToken = this.createRefreshToken(payload);

        //update user token
        await this.usersService.updateUserToken(refreshToken, _id);

        //set cookie
        response.clearCookie('refreshToken');

        response.cookie('refreshToken', refreshToken, {
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
            httpOnly: true,
        });

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                // phoneNumber,
                role,
            },
        };
    }

    async registerUser(registerUserDto: RegisterUserDto) {
        let user = await this.usersService.registerUser(registerUserDto);

        return {
            _id: user?._id,
            email: user?.email,
            createdAt: user?.createdAt,
        };
    }

    refreshNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>(
                    'JWT_REFRESH_KEY_SECRET',
                ),
            });
            let user = await this.usersService.findUserByToken(refreshToken);
            if (!user) {
                throw new BadRequestException(
                    'Refresh token không hợp lệ vui lòng đăng nhập!',
                );
            } else {
                //update refresh token
                const { _id, name, email, phoneNumber, role } = user;
                const payload = {
                    sub: 'refresh token',
                    iss: 'from server',
                    _id,
                    name,
                    email,
                    // phoneNumber,
                    role,
                };

                const refreshToken = this.createRefreshToken(payload);

                //update user token
                await this.usersService.updateUserToken(
                    refreshToken,
                    _id.toString(),
                );

                //set cookie
                response.clearCookie('refreshToken');
                response.cookie('refreshToken', refreshToken, {
                    maxAge: ms(
                        this.configService.get<string>('JWT_REFRESH_EXPIRE'),
                    ),
                    httpOnly: true,
                });

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        // phoneNumber,
                        role,
                    },
                };
            }
        } catch (error) {
            throw new BadRequestException(
                'Refresh token không hợp lệ vui lòng đăng nhập!',
            );
        }
    };
}
