import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectUserModule } from './project-user/project-user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { jwtConstants } from './guard/constants';
import { JwtModule } from '@nestjs/jwt';
import configuration, { CONFIG_DATABASE } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostUserModule } from './post-user/post-user.module';
import { AuthModule } from './guard/auth.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
  }),
ConfigModule.forRoot({
  isGlobal: true,  
  envFilePath: ['.env', '.env.production'],
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
    username: process.env.MYSQL_USER || 'db_username',
    password: process.env.MYSQL_PASSWORD || 'db_password',
    database : process.env.DB_DATABASE_RELATION || "db_database",
    autoLoadEntities: true,
    synchronize: true,
  })
}),
PostUserModule,
ProjectUserModule,
AuthModule
],
  controllers: [AppController],
  providers: [
    AppService,
    SocketGateway,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule {}
