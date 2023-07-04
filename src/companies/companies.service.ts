import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name)
        private companyModel: SoftDeleteModel<CompanyDocument>,
    ) {}

    async create(createCompanyDto: CreateCompanyDto, user: IUser) {
        const { name, address, description } = createCompanyDto;

        let company = await this.companyModel.create({
            name,
            address,
            description,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return company;
    }

    findAll() {
        return this.companyModel.find();
    }

    findOne(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'Error id!';

            return this.companyModel.findOne({ _id: id });
        } catch (error) {
            throw new Error(error);
        }
    }

    update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) return 'not found company!';

        return this.companyModel.updateOne(
            { _id: id },
            {
                ...updateCompanyDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
    }

    async remove(id: string, user: IUser) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                return 'not found company!';
            await this.companyModel.updateOne(
                { _id: id },
                {
                    deletedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            );

            return this.companyModel.softDelete({
                _id: id,
            });
        } catch (error) {}
    }

    async restore(id: string, user: IUser) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

            await this.companyModel.updateOne(
                { _id: id },
                {
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            );
            return this.companyModel.restore({
                _id: id,
            });
        } catch (error) {}
    }
}
