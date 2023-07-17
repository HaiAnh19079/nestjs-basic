import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateUserDto extends OmitType(CreateUserDto, [
    'password',
] as const) {
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
}
