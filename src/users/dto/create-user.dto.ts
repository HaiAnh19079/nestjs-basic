import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    // @IsPhoneNumber()
    phoneNumber: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    name: string;

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'password too weak',
    // })
    password: string;
}
