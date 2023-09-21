import {
    Controller, Get,
    Headers, Param,
    ParseIntPipe,
    Req,
    UseGuards
} from '@nestjs/common';
import {ChatGatewayService} from "./userchat.service";
import {UserService} from "../user/user.service";
import { Request } from 'express';
import { JwtGuard } from 'src/auth/jwt/jwtGuard';

@Controller('chat')

@UseGuards(JwtGuard) 
export class chatController {
    constructor(
        private chatService: ChatGatewayService,
        private userRepository: UserService
    ) {
    }

    @Get(':id') // receiver id
    async getMessages(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ) 
    {
        const user = await this.userRepository.getUserFromJwt(req.cookies['access_token']);
        return await this.chatService.loadMessage(user, id)
    }

}
