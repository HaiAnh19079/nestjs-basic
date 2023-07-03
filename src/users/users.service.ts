import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,
    ) {}

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
        return this.userModel.find();
    }

    findOne(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

            return this.userModel.findOne({ _id: id });
        } catch (error) {}
    }

    async findOneByUserName(userName: string) {
        return await this.userModel.findOne({ email: userName });
    }

    isValidPassword(password: string, hash: string) {
        return compareSync(password, hash);
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

            return this.userModel.softDelete({ _id: id });
        } catch (error) {}
    }
}
