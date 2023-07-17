import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Put,
    Query,
    Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ResponseMessage('Create a new user by admin')
    create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
        return this.usersService.create(createUserDto, user);
    }

    @Get()
    @ResponseMessage('Get all users with paginate')
    findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query() query: string,
    ) {
        return this.usersService.findAll(+page, +limit, query);
    }

    @Get(':id')
    @ResponseMessage('Get a user')
    async findOne(@Param('id') id: string) {
        let user = await this.usersService.findOne(id);
        return user;
    }

    @Patch()
    @ResponseMessage('Update a user')
    async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
        const userUpdate = await this.usersService.update(updateUserDto, user);
        return userUpdate;
    }

    @Delete(':id')
    @ResponseMessage('Soft delete a user')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.usersService.remove(id, user);
    }

    @Put(':id')
    @ResponseMessage(`Restore a user's soft deleted`)
    restore(@Param('id') id: string) {
        return this.usersService.restore(id);
    }
}
