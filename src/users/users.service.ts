import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { IUser } from './users.interface';
import { User as UserDecorator } from 'src/decorator/customize';

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

    async doesUserExists(email: string): Promise<any> {
        const user = await this.userModel.find({
            userName: email,
        });
        if (user.length === 0) {
            return false;
        }
        return true;
    }

    isValidPassword(password: string, hash: string) {
        return compareSync(password, hash);
    }

    findUserByToken = async (refreshToken: string) => {
        return await this.userModel.findOne({ refreshToken });
    };

    findOneByUserName(userName: string) {
        return this.userModel.findOne({ email: userName });
    }

    updateUserToken = async (refreshToken: string, _id: string) => {
        return await this.userModel.updateOne({ _id: _id }, { refreshToken });
    };

    async create(createUserDto: CreateUserDto, @UserDecorator() user: IUser) {
        const { name, email, phoneNumber, password } = createUserDto;
        const passwordHash = this.getHashPassword(password);

        if (await this.doesUserExists(email)) {
            throw new BadRequestException(`Email : ${email} already exists!`);
        }

        let userCreate = await this.userModel.create({
            name,
            email,
            phoneNumber,
            password: passwordHash,
            createdBy: {
                _id: user._id,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
        });
        return userCreate;
    }

    async registerUser(registerUserDto: RegisterUserDto) {
        const { name, email, password, phoneNumber } = registerUserDto;
        const passwordHash = this.getHashPassword(password);

        if (!(await this.doesUserExists(email))) {
            throw new BadRequestException(`Email : ${email} already exists!`);
        }

        let userRegister = await this.userModel.create({
            name,
            email,
            phoneNumber,
            password: passwordHash,
            role: 'User',
        });
        return userRegister;
    }

    async findAll(pageCurrent: number, limit: number, query: string) {
        const { filter, skip, projection, population } = aqp(query);
        let { sort }: { sort: any } = aqp(query);
        delete filter.page;
        delete filter.limit;

        let page = pageCurrent ? pageCurrent : 1;
        let offset = (+page - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.userModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        if (isEmpty(sort)) {
            sort = '-createdAt';
        }
        const result = await this.userModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
            .select('-password')
            .populate(population)
            .exec();

        return {
            meta: {
                current: page, //trang hiện tại
                pageSize: limit || defaultLimit, //số lượng bản ghi đã lấy
                pages: totalPages, //tổng số trang với điều kiện query
                total: totalItems, // tổng số phần tử (số bản ghi)
            },
            result, //kết quả query
        };
    }

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

        return await this.userModel.findOne({ _id: id }).select('-password');
    }

    async update(updateUserDto: UpdateUserDto, user: IUser) {
        let userUpdate = await this.userModel.updateOne(
            { _id: updateUserDto._id },
            {
                ...updateUserDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                },
            },
        );
        return userUpdate;
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

        await this.userModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                },
            },
        );

        return this.userModel.softDelete({ _id: id });
    }

    restore(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

            return this.userModel.restore({ _id: id });
        } catch (error) {}
    }
}
