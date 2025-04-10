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
  import { PostUserService } from './post-user/post-user.service';
  import { CreatePostUserDto } from './post-user/dto/create-post-user.dto';

  @WebSocketGateway({ cors: { origin: '*' } })
  export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    constructor(
       private readonly postUserService: PostUserService,
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

  
    @SubscribeMessage('createVote')
    async handleCreateVote(socket: Socket, @MessageBody() data: { room: string; userId: string }) {
       const {userId, room} = data
      const newPostUser: CreatePostUserDto = {
        participant_id: userId,
        post_id: Number(room),
      };

      try {
        const createpostUser = await this.postUserService.create(newPostUser);
      // Envoi du message à tous les clients de la room après l'enregistrement
        this.server.to(data.room).emit('createVote', {
        id: createpostUser.id,
        participant_id: createpostUser.participant_id,
        post_id: createpostUser.post_id,
       });
      
       const score = (await this.postUserService.findAllVoteByPostId(+room)).count;
       this.server.to(data.room).emit("statusVote", { isVoted : true , score : score});
      } catch (error) {
       console.error('Erreur lors de la création du vote :', error);
       socket.emit('error', { message: 'Impossible de sauvegarder le vote' });
      }
    }
    
    @SubscribeMessage('deleteVote')
    async handleDeleteVote(socket: Socket,@MessageBody() data: { userId: string , room : string}) {
      const { room, userId} = data;
      await this.postUserService.remove(+room, userId);
      const score = (await this.postUserService.findAllVoteByPostId(+room)).count;
      this.server.to(data.room).emit("statusVote", { isVoted : false , score : score });
    }
}
  