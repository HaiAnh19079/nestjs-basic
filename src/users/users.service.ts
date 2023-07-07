import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

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

    async findAll(page: number, limit1: number, query: string) {
        const { filter, skip, limit, projection, population } = aqp(query);
        let { sort }: { sort: any } = aqp(query);
        delete filter.page;
        delete filter.limit;

        let offset = (+page - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.userModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        if (isEmpty(sort)) {
            sort = '-updatedAt';
        }
        const result = await this.userModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
            .populate(population)
            .exec();

        return {
            meta: {
                current: page, //trang hiện tại
                pageSize: limit, //số lượng bản ghi đã lấy
                pages: totalPages, //tổng số trang với điều kiện query
                total: totalItems, // tổng số phần tử (số bản ghi)
            },
            result, //kết quả query
        };
    }

    findOne(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

            return this.userModel.findOne({ _id: id });
        } catch (error) {}
    }

    findOneByUserName(userName: string) {
        return this.userModel.findOne({ email: userName });
    }

    isValidPassword(password: string, hash: string) {
        return compareSync(password, hash);
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return this.userModel.updateOne({ _id: id }, { ...updateUserDto });
    }

    remove(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

            return this.userModel.softDelete({ _id: id });
        } catch (error) {}
    }
    restore(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

            return this.userModel.restore({ _id: id });
        } catch (error) {}
    }
}
