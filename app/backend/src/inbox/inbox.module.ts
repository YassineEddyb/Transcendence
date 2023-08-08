import {Module, ValidationPipe} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ChatGatewayService} from 'src/chat/userchat.service';
import {InboxController} from './inbox.controller';
import {InboxService} from './inbox.service';
import {User} from 'src/databases/user.entity'
import {ChatGateway} from 'src/chat/userchat.gateway';
import {JwtService} from '@nestjs/jwt';
import {User_chat} from 'src/databases/userchat.entity';
import {Message} from 'src/databases/message.entity';
import {Inbox_user} from 'src/databases/inbox_user.entity';
import {APP_PIPE} from "@nestjs/core";
import {UserService} from "../user/user.service";
import { Achievement } from 'src/databases/achievement/achievement.entity';
import {Stats} from "../databases/stats.entity";
import { Match_history } from 'src/databases/match_history.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, User_chat, Message, Inbox_user, Achievement, Stats, Match_history])],
	controllers: [InboxController],
	providers: [
		InboxService, ChatGatewayService, JwtService,
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
		UserService
	],
})
export class InboxModule {
}
