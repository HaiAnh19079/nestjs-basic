import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    getHashPassword = (password: string) => {
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        return hash;
    };

    async create(createUserDto: CreateUserDto) {
        const passwordHash = this.getHashPassword(createUserDto.password);
        const { name, email, phoneNumber } = createUserDto;

        let user = await this.userModel.create({
            name,
            email,
            phoneNumber,
            password: passwordHash,
        });

        return user;
    }

    async findAll() {
        const users = await this.userModel.find();
        return users;
    }

    findOne(id: string) {
        console.log('id', id);
        const user = this.userModel.findOne({ _id: id });

        // console.log('user', user);
        return user;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
