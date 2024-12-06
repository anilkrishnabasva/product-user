import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async register(@Body() createUserDto: {username: string; password: string; role: string}) {
        return this.userService.create(createUserDto.username, createUserDto.password, createUserDto.role);
    }
}