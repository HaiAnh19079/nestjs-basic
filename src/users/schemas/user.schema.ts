import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Order } from 'src/orders/schemas/order.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    phoneNumber: string;

    @Prop({ required: true, select: true })
    password: string;

    @Prop({ type: Array })
    address: [
        {
            address_value: string;
            address_active: boolean;
        },
    ];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] })
    orders: Order[];

    @Prop({ type: String, default: 'User' })
    role: string;

    @Prop()
    refreshToken: string;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
        phoneNumber: string;
        name: string;
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
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
