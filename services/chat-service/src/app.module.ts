import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { CONFIG_DATABASE } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  
      envFilePath: '.env',
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get(CONFIG_DATABASE).users.uri,
        };
      },
      inject: [ConfigService],
    }),
    
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306' , 10),
        username: process.env.DB_USER || 'wiwi',
        password: process.env.DB_PASSWORD || 'wiwi123',
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
     PostsModule, 
    //base de donnée en mode production ici
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
