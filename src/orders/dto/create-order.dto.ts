import {
    IsString,
    IsNumber,
    IsObject,
    ValidateNested,
    IsEnum,
    IsArray,
    IsNotEmpty,
} from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

class SenderInformationDto {
    @IsNotEmpty()
    @IsString()
    senderAddress: string;

    @IsString()
    senderPhoneNumber: string;
}

class RecipientInformationDto {
    @IsNotEmpty()
    @IsString()
    recipientAddress: string;

    @IsString()
    recipientPhoneNumber: string;
}

class DeliveryInformationDto {
    @ValidateNested()
    @IsObject()
    senderInformation: SenderInformationDto;

    @ValidateNested()
    @IsObject()
    recipientInformation: RecipientInformationDto;
}

class ItemDetailsDto {
    @IsString()
    detailedInformation: string;

    @IsNumber()
    quantity: number;

    @IsString()
    size: string;

    @IsString()
    weight: string;

    @IsString()
    typeItem: string;

    @IsString()
    itemValue: string;
}

class ServiceInformationDto {
    @IsString()
    ServiceType: string;

    @IsString()
    preferredDeliveryTime: string;
}

class PaymentDto {
    @IsString()
    paymentMethod: string;
}

export class CreateOrderDto {
    @ValidateNested()
    @IsObject()
    deliveryInformation: DeliveryInformationDto;

    @ValidateNested()
    @IsObject()
    itemDetails: ItemDetailsDto;

    @ValidateNested()
    @IsObject()
    serviceInformation: ServiceInformationDto;

    @IsEnum(OrderStatus)
    statusOrder: OrderStatus = OrderStatus.PROCESSING;

    @ValidateNested()
    @IsObject()
    payment: PaymentDto;

    @IsString()
    totalOrderValue: string;

    @IsString()
    shippingFee: string;

    // @IsString()
    totalPaymentAmount: string;
}
