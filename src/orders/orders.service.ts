import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name)
        private orderModel: SoftDeleteModel<OrderDocument>,
    ) {}
    convertToVietnameseCurrency(number: number): string {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        return formatter.format(number);
    }

    addVietnameseCurrencies(...numbers: number[]): string {
        const sum = numbers.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0,
        );
        return this.convertToVietnameseCurrency(sum);
    }

    parseCurrencyString(currencyString: string): number | null {
        const numberString = currencyString.replace(/[.,]/g, '');
        const number = parseFloat(numberString);
        return isNaN(number) ? null : number;
    }
    async create(createOrderDto: CreateOrderDto, user: IUser) {
        const {
            senderAddress,
            senderPhoneNumber,
            receiverAddress,
            receiverPhoneNumber,
            detailedInformation,
            quantity,
            size,
            weight,
            typeItem,
            itemValue,
            ServiceType,
            preferredDeliveryTime,
            paymentmethod,
            shippingFee,
            statusOrder,
            totalOrderValue,
            totalPaymentAmount,
            distance,
        } = createOrderDto;

        let order = await this.orderModel.create({
            deliveryInformation: {
                senderInformation: {
                    senderAddress,
                    senderPhoneNumber,
                },
                receiverInformation: {
                    receiverAddress,
                    receiverPhoneNumber,
                },
            },
            itemDetails: {
                detailedInformation, //description about the items
                quantity,
                size,
                weight,
                typeItem,
                itemValue,
            },
            serviceInformation: {
                ServiceType,
                preferredDeliveryTime,
            },
            paymentmethod,
            totalOrderValue: totalOrderValue,
            shippingFee: shippingFee,
            statusOrder,
            distance,

            createdBy: {
                _id: user._id,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
            totalPaymentAmount: totalPaymentAmount,
        });
        return order;
    }

    async findAll(pageCurrent: number, limit: number, qs: string) {
        const { filter, projection, population } = aqp(qs);
        let { sort }: { sort: any } = aqp(qs);
        delete filter.page;
        delete filter.limit;
        if (filter.senderPhoneNumber) {
            filter['deliveryInformation.senderInformation.senderPhoneNumber'] =
                filter.senderPhoneNumber;

            delete filter.senderPhoneNumber;
        }

        let page = pageCurrent ? pageCurrent : 1;
        let offset = (+page - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.orderModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        if (isEmpty(sort)) {
            sort = '-createdAt';
        }
        const result = await this.orderModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
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

    findOne(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return 'Error id!';

            return this.orderModel.findOne({ _id: id });
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return `This action updates a #${id} order`;
    }

    remove(id: number) {
        return `This action removes a #${id} order`;
    }
}
