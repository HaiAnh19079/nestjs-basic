import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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

    async registerUser(registerUserDto: RegisterUserDto) {
        let user = await this.usersService.registerUser(registerUserDto);

        return {
            _id: user?._id,
            email: user?.email,
            createdAt: user?.createdAt,
        };
    }
}
