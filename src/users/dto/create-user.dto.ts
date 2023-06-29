import { IsEmail, IsNotEmpty, IsPhoneNumber, Min } from 'class-validator';

export class CreateUserDto {
    @IsPhoneNumber()
    phoneNumber: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    name: string;

    @IsNotEmpty()
    @Min(6)
    password: string;
}
