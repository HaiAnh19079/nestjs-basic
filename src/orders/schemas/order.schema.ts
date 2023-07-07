import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
    PROCESSING = 'Đang xử lý',
    CONFIRMED = 'Đã xác nhận',
    ON_THE_WAY = 'Đang trên đường',
    DELIVERED = 'Đã giao hàng',
    FAILED = 'không thành công',
    CANCELLED = 'Hủy',
}
@Schema({ timestamps: true })
export class Order {
    @Prop({ type: Object })
    deliveryInformation: {
        senderInformation: {
            senderAddress: string;
            senderPhoneNumber: string;
        };
        recipientInformation: {
            recipientAddress: string;
            recipientPhoneNumber: string;
        };
    };

    @Prop({ type: Object })
    itemDetails: {
        detailedInformation: string; //description about the items
        quantity: number;
        size: string;
        weight: string;
        typeItem: string;
        itemValue: string; // estimated value of the items
    };

    @Prop({ type: Object })
    serviceInformation: {
        ServiceType: string; // for example, express delivery, economy delivery,...
        preferredDeliveryTime: string; // the requested delivery time to the recipient's address
    };

    @Prop({ type: Object })
    payment: {
        paymentMethod: string; // for example,Thẻ Tín dụng/Ghi nợ ,Thanh toán khi nhận hàng,Chuyển khoản ngân hàng
    };

    @Prop({ type: Object })
    shipper: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        phoneNumber: string;
    };

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PROCESSING })
    statusOrder: OrderStatus;

    @Prop()
    totalOrderValue: string;

    @Prop()
    shippingFee: string;

    @Prop()
    totalPaymentAmount: string;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        phoneNumber: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        phoneNumber: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        phoneNumber: string;
    };

    @Prop()
    canceledResult: string;

    @Prop()
    createAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
