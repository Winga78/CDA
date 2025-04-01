import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: { origin: '*' } }) // Autoriser toutes les origines
  export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer()
    server: Server;
  
    afterInit(server: Server) {
      console.log('WebSocket Server Initialized');
    }
  
    handleConnection(client: Socket) {
      console.log(`Client connecté: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client déconnecté: ${client.id}`);
    }
  
    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: { user: string; message: string }) {
        console.log(data)
      this.server.emit('message', data); // Envoi du message à tous les clients
    }
  }
  