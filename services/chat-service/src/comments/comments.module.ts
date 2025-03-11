import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports:[TypeOrmModule.forFeature([Comment]), ProfileService],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
