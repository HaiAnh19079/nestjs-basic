import { IsEmail } from 'class-validator';

export class UpdateUserDto {
    // @IsPhoneNumber()
    phoneNumber: string;

    @IsEmail()
    email: string;

    name: string;

    role: string;

    address: string;
}
