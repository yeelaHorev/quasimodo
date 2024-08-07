import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { RedisClientType, createClient } from 'redis';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket'] })
export class SocketGateway {
  constructor() {
    this.redisClient = createClient({ url: 'redis://localhost:6379' });
    console.log('SocketGateway instance created');
  }

  private readonly redisClient: RedisClientType;

  @WebSocketServer() server: Server;

  async onModuleInit() {
    await this.redisClient.connect();
  }

  @SubscribeMessage('entered-room')
  async enteredRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { nickname: string; roomId: string },
  ) {
    try {
      const { nickname, roomId } = body;

      const stringifyCurrentPlayers = await this.redisClient.get(
        `room-users-${roomId}`,
      );

      const currentPlayers: { nickname: string }[] = stringifyCurrentPlayers
        ? JSON.parse(stringifyCurrentPlayers)
        : [];

      const players = JSON.stringify([...currentPlayers, nickname]);

      if (currentPlayers.length !== 2) {
        await this.redisClient.set(`room-users-${roomId}`, players);
      }

      currentPlayers && socket.broadcast
        .to(roomId)
        .emit('entered-room', [...currentPlayers, nickname]);

      if (currentPlayers.length) {
        this.server.emit('game-state', nickname);
      }
      return [...currentPlayers, nickname];
    } catch (e) {
      console.log('e: ', e);
    }
  }



  @SubscribeMessage('create-room')
  async createRoom(client: Socket) {
    try {
      const roomCode = this.generateRoomCode();
      await this.redisClient.set(`room-id-${roomCode}`, 1);
      client.join(roomCode);
      return roomCode;
    } catch (err) {
      console.error('Error creating room:', err);
    }
  }

  @SubscribeMessage('join-room')
  async checkRoom(client: Socket, payload: { roomId: string }) {
    const roomExists = await this.redisClient.get(`room-id-${payload.roomId}`);
    if (roomExists) {
      client.join(payload.roomId);
    }
    return !!roomExists;
  }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  // @SubscribeMessage('game-state')
  // async gameState(@MessageBody() payload: { roomId: SVGFESpecularLightingElement, nickname: string }) {
  //       this.server.emit('game-state', payload.nickname);
  // }

  @SubscribeMessage('make-move')
  async makeMove(
    @MessageBody()
    payload: {
      playerName: string;
      updatedPiecesInfo: { pieces: { col: number; row: number }[] };
      selectedPieceIndex: number;
      target: { row: number; col: number };
    },
  ) {
    const { playerName, selectedPieceIndex, target } = payload;
    this.server.emit('make-move', {
      playerName,
      pieces: payload.updatedPiecesInfo,
      selectedPieceIndex,
      target,
    });
  }
}
