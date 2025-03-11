import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { HttpModule } from '@nestjs/axios';
import { ProfileService } from 'src/profile/profile.service';
@Module({
  imports:[TypeOrmModule.forFeature([Collection]) , HttpModule, ProfileService],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
