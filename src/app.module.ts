import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ElasticsearchModule } from '@nestjs/elasticsearch'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from '@controllers/user/user.controller';
import { UserService } from '@services/user/user.service';
import { UserSchema } from '@interfaces/user.interface';
import { AuthController } from '@controllers/auth/auth.controller';
import { AuthService } from '@services/auth/auth.service';
import { CommonModule } from '@common/common.module';
import { VideoController } from '@controllers/video/video.controller';
import { VideoService } from '@services/video/video.service';
import { VideoSchema } from '@interfaces/video.interface';
import { LocalStrategy } from '@common/guards/local.strategy';
import { JwtStrategy } from '@common/guards/jwt.strategy';
import { CommentService } from '@services/comment/comment.service';
import { CommentSchema } from '@interfaces/comment.interface';
import { FollowService } from '@services/follow/follow.service';
import { FollowSchema } from '@interfaces/follow.interface'
import { NotificationSchema } from '@interfaces/notification.interface'

import { HttpModule } from '@common/http/http.module';
import { FeedController } from '@controllers/feed/feed.controller';
import { NotificationService } from '@services/notification/notification.service';
import { NotificationController } from '@controllers/notification/notification.controller';
import configuration from '@config/configuration';
import databaseConfig from '@config/database.config';
import { jwtConstants } from '@common/constants';

const ELASTICSEARCH_CONNECTION = process.env.ELASTICSEARCH_CONNECTION || "http://localhost:9200"

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forRootAsync({ 
      imports: [ConfigModule.forRoot({ load: [databaseConfig] })],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('db.url'),
          dbName: 'lermo'
        }
      },
      inject: [ConfigService],
    }),
    ElasticsearchModule.register({
      node: ELASTICSEARCH_CONNECTION,
    }),
    PassportModule,
    JwtModule.register({
      // publicKey: '',
      // privateKey: { key: '', passphrase: JWT_PASSPHRASE },
      // signOptions: { algorithm: "RS256", expiresIn: JWT_EXPIRESIN, issuer: JWT_ISSUER, },
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema, collection: "users" }]),
    MongooseModule.forFeature([{ name: 'video', schema: VideoSchema, collection: "videos" }]),
    MongooseModule.forFeature([{ name: 'comment', schema: CommentSchema, collection: "comments" }]),
    MongooseModule.forFeature([{ name: 'follow', schema: FollowSchema, collection: "follows" }]),
    MongooseModule.forFeature([{ name: 'notification', schema: NotificationSchema, collection: "notifications" }]),
    CommonModule,
  ],
  controllers: [AppController, UserController, AuthController, VideoController, FeedController, NotificationController],
  providers: [
    AppService,
    UserService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    VideoService,
    CommentService,
    FollowService,
    NotificationService,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // console.log('app module - ', this.configService.get('db'))
  }
}
