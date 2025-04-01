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

    @SubscribeMessage('joinRoom')
    handleJoinRoom(socket: Socket, room: string) {
        socket.join(room);
        console.log(`Client ${socket.id} a rejoint la room ${room}`);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(socket: Socket, room: string) {
        socket.leave(room);
        console.log(`Client ${socket.id} a quitté la room ${room}`);
    }

    @SubscribeMessage('disconnectUser')
    handleDisconnectUser(socket: Socket) {
    console.log(`Déconnexion forcée du client: ${socket.id}`);
    socket.disconnect(true); // Déconnecte le client côté serveur
    }

  
    @SubscribeMessage('message')
    handleMessage(socket: Socket, @MessageBody() data: { room : string , user: any; message: string }) {
      console.log(`Message reçu dans la room ${data.room}: ${data.message}`);
      this.server.to(data.room).emit('message', {user: data.user , message : data.message}); // Envoi du message à tous les clients
    }
  }
  