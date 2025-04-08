import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema} from './schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { FileValidationMiddleware } from './uploadFile.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MulterModule.registerAsync({
    useFactory: () => FileValidationMiddleware.multerOptions,
  }),],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
