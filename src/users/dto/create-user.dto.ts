import { Type } from 'class-transformer';
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from 'class-validator';

class AddressDto {
    @IsString()
    address_value: string;

    @IsString()
    address_active: string;
}
export class CreateUserDto {
    @IsNotEmpty({ message: 'Name không được để trống!' })
    name: string;

    @IsNotEmpty({ message: 'Email không được để trống!' })
    email: string;

    @IsNotEmpty({ message: 'PhoneNumber không được để trống!' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'Password không được để trống!' })
    password: string;

    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => AddressDto)
    // address: AddressDto[];

    @IsNotEmpty({ message: 'Role không được để trống!' })
    role: string;
}

export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name không được để trống!' })
    name: string;

    @IsEmail()
    @IsNotEmpty({ message: 'Email không được để trống!' })
    email: string;

    @IsNotEmpty({ message: 'PhoneNumber không được để trống!' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'Password không được để trống!' })
    password: string;

    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => AddressDto)
    // address: AddressDto[];
}
