import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name)
        private companyModel: SoftDeleteModel<CompanyDocument>,
    ) {}

    async create(createCompanyDto: CreateCompanyDto) {
        const { name, address, description } = createCompanyDto;

        let company = await this.companyModel.create({
            name,
            address,
            description,
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

    update(updateCompanyDto: UpdateCompanyDto) {
        if (!mongoose.Types.ObjectId.isValid(updateCompanyDto._id))
            return 'not found company!';

        return this.companyModel.updateOne(
            { _id: updateCompanyDto._id },
            {
                ...updateCompanyDto,
            },
        );
    }

    remove(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                return 'not found company!';

            return this.companyModel.softDelete({ _id: id });
        } catch (error) {}
    }

    restore(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user!';

            return this.companyModel.restore({ _id: id });
        } catch (error) {}
    }
}
