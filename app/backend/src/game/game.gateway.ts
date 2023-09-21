import {
	ConnectedSocket,
    MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway, 
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { userWinDto } from "./dto/userWinDto";
import { scoreStoreDto } from "./dto/scoreSavingDto";
import { gameService } from "./game.service";

interface User {
	user: any;
	socket: Socket;
}

const gameModes: string[] = ["BattleRoyal", "IceLand", "TheBeat", "BrighGround"];

const waitingUsers = new Map<String, User[]>([
    ["BattleRoyal", []],
    ["BlazingPong", []],
    ["ArcticPong", []],
    ["RetroPong", []]
]);

@WebSocketGateway(4343, {cors: {
	origin: "http://localhost:5173",
	credentials: true
}})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	constructor(private readonly gameservice: gameService) {}

    afterInit(server: any) {
    }

    handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {

		for (const [key, _value] of this.server.sockets.adapter.rooms) {
			if (key.includes(socket.id))
				this.server.to(key).emit("leaveGame")
		}

		gameModes.forEach((mode: string) => {
			waitingUsers?.set(mode, 
				waitingUsers.get(mode)?.filter(
					(u: User) => u.socket.id !== socket.id)
				);
		});
    }

	@SubscribeMessage('waiting')
	onWaiting(@MessageBody() roomKey: string, @ConnectedSocket() socket: Socket) {
		if (this.server.sockets.adapter.rooms.get(roomKey)?.size == 2) {
			this.server.to(roomKey).emit("startGame");
		}
	}

	@SubscribeMessage('sendUser')
	onSendUser(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
		socket.to(data.roomKey).emit("recvOppUser", data.user)
	}

	@SubscribeMessage('joinGame')
	onJoinGame(@MessageBody() roomKey: string, @ConnectedSocket() socket: Socket) {
		// if (this.server.sockets.adapter.rooms.get(roomKey)?.size < 2)
			socket.join(roomKey);
	}
  
	@SubscribeMessage('gameEnd')
	async onGameEnd(@MessageBody() roomKey: string, @ConnectedSocket() socket: Socket) {
		socket.to(roomKey).emit("leaveGame");

		socket.leave(roomKey);
	}

	@SubscribeMessage('achievement')
	async onAchievement(@MessageBody() gameData: userWinDto, @ConnectedSocket() socket: Socket) {
		await this.gameservice.userGameDataUpdate(gameData);
		await this.gameservice.addLoserStat(gameData.opponentId)
	}
	

	@SubscribeMessage('saveScore') 
	async onSaveScore(@MessageBody() score: scoreStoreDto, @ConnectedSocket() socket: Socket) {
		await this.gameservice.saveScore(score);
	}

	@SubscribeMessage('gameScore')
	onScore(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
		socket.to(body.roomKey).emit("scoreChanged", body.score);
	}

	@SubscribeMessage('changePersentage')
	onChangePersentage(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
		socket.to(body.roomKey).emit("recvPersentage", body.persentage);
	}


	@SubscribeMessage('sendEffect')
	onSendEffect(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
		socket.to(body.roomKey).emit("recieveEffect", body.effect);
	}

	@SubscribeMessage("gameMatching")
	onGameMatching(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
		const users: User[] =  waitingUsers.get(body.modeName);

		if (!users?.find((user: User) => user.user.id == body.user.id )) {
			if (users.length >= 1) {
				const oppUser: User = users[0];
				users.unshift();

				setTimeout( () => {
					socket.emit("matched", {roomKey: socket.id + oppUser.socket.id, user: oppUser.user});
					oppUser.socket.emit("matched", {roomKey: socket.id + oppUser.socket.id, user: body.user});
				}, 1000)
			} else 
				users.push({user: body.user, socket});
		}
	}

    @SubscribeMessage('game')
	onNewMessage(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
		socket.to(body.gameKey).emit("movePad", body);

		if (this.server.sockets.adapter.rooms.get(body.gameKey)?.size == 2) {
			const socketsSet: Set<string> = this.server.sockets.adapter.rooms.get(body.gameKey);
			const socketsArr: Array<string> = Array.from(socketsSet);
			const sock: Socket = this.server.sockets.sockets.get(socketsArr[0]);

			sock.emit("notHost");
		}
	}
}
