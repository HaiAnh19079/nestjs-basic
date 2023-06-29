import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
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

    findAll() {
        const users = this.userModel.find();
        return users;
    }

    findOne(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

            return this.userModel.findOne({ _id: id });
        } catch (error) {}
    }

    update(updateUserDto: UpdateUserDto) {
        return this.userModel.updateOne(
            { _id: updateUserDto._id },
            { ...updateUserDto },
        );
    }

    remove(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';
            
            return this.userModel.deleteOne({ _id: id });
        } catch (error) {}
    }
}
