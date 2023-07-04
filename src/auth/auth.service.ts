import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';

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

    async login(user: IUser) {
        const { _id, name, email, phoneNumber, role } = user;
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            name,
            email,
            phoneNumber,
            role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            phoneNumber,
            role,
        };
    }
}
