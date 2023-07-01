import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            const isValid = await this.usersService.isValidPassword(
                pass,
                user.password,
            );
            console.log(isValid);
            if (isValid === true) {
                return user;
            }
        }

        return null;
    }

    async login(user: any) {
        const payload = {
            username: user.name,
            sub: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
