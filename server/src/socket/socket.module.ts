import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
    controllers: [],
    providers: [SocketGateway],
    exports: [SocketGateway]
})
export class SocketModule { }
