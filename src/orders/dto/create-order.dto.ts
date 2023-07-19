import {
    IsString,
    IsNumber,
    IsObject,
    ValidateNested,
    IsEnum,
    IsArray,
    IsNotEmpty,
} from 'class-validator';
import { OrderStatusEnum, PaymentMethodEnum } from '../schemas/order.schema';

class SenderInformationDto {
    senderName: string;

    @IsString()
    senderAddress: string;

    @IsString()
    senderPhoneNumber: string;
}

class receiverInformationDto {
    receiverName: string;

    @IsString()
    receiverAddress: string;

    @IsString()
    receiverPhoneNumber: string;
}

class DeliveryInformationDto {
    @ValidateNested()
    @IsObject()
    senderInformation: SenderInformationDto;

    @ValidateNested()
    @IsObject()
    receiverInformation: receiverInformationDto;
}
export enum sizeEnum {
    S = 'S',
    M = 'M',
    L = 'L',
}
class ItemDetailsDto {
    @IsString()
    detailedInformation: string;

    @IsNumber()
    quantity: number;

    @IsEnum(sizeEnum)
    size: sizeEnum;

    @IsNumber()
    weight: number;

    @IsString()
    typeItem: string;

    @IsNumber()
    itemValue: number;
}

export enum serviceTypeEnum {
    SUPERCHEAP = 'SUPERCHEAP',
    SUPERSPEED = 'SUPERSPEED',
}
class ServiceInformationDto {
    @IsEnum(serviceTypeEnum)
    ServiceType: serviceTypeEnum;

    @IsString()
    preferredDeliveryTime: string;
}

export class CreateOrderDto1 {
    @ValidateNested()
    @IsObject()
    deliveryInformation: DeliveryInformationDto;

    @ValidateNested()
    @IsObject()
    itemDetails: ItemDetailsDto;

    @ValidateNested()
    @IsObject()
    serviceInformation: ServiceInformationDto;

    @IsEnum(OrderStatusEnum)
    statusOrder: OrderStatusEnum = OrderStatusEnum.PROCESSING;

    @IsEnum(PaymentMethodEnum)
    paymentmethod: PaymentMethodEnum;

    @IsNumber()
    totalOrderValue: number;

    @IsNumber()
    shippingFee: number;

    distance: number;

    totalPaymentAmount: string;
}

export class CreateOrderDto {
    senderName: string;

    @IsString()
    senderAddress: string;

    @IsString()
    senderPhoneNumber: string;

    @IsEnum(OrderStatusEnum)
    statusOrder: OrderStatusEnum = OrderStatusEnum.PROCESSING;

    receiverName: string;

    @IsString()
    receiverAddress: string;

    @IsString()
    receiverPhoneNumber: string;
    //
    @IsEnum(PaymentMethodEnum)
    paymentmethod: PaymentMethodEnum;

    @IsString()
    detailedInformation: string;

    @IsNumber()
    quantity: number;

    @IsEnum(sizeEnum)
    size: sizeEnum;

    @IsNumber()
    weight: number;

    @IsString()
    typeItem: string;

    @IsNumber()
    itemValue: number;

    //
    @IsEnum(serviceTypeEnum)
    ServiceType: serviceTypeEnum;

    @IsString()
    preferredDeliveryTime: string;

    @IsNumber()
    totalOrderValue: number;

    @IsNumber()
    shippingFee: number;

    distance: number;
    // @IsString()
    totalPaymentAmount: number;
}
