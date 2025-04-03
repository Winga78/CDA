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
  import { PostsService } from './posts/posts.service';
  import { CreatePostDto } from './posts/dto/create-post.dto';

  @WebSocketGateway({ cors: { origin: '*' } }) // Autoriser toutes les origines
  export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    constructor(
       private readonly postService: PostsService,
     ) { }

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
    async handleMessage(socket: Socket, @MessageBody() data: { room: string; user: any; message: string; titre: string }) {
    console.log(`Message reçu dans la room ${data.room}: ${data.message}`);

      const newPost: CreatePostDto = {
      user_id: data.user.id,
      project_id: Number(data.room),
      titre: data.titre,
      description: data.message,
      score : 0
      };

      try {
        const createpost = await this.postService.create(newPost);
      // Envoi du message à tous les clients de la room après l'enregistrement
        this.server.to(data.room).emit('message', {
        user: data.user,
        description: createpost.description,
        titre: createpost.titre,
        post_id: createpost.project_id,
        score : createpost.score
       });
      } catch (error) {
       console.error('Erreur lors de la création du post :', error);
       socket.emit('error', { message: 'Impossible de sauvegarder le message' });
      }
    }
}
  