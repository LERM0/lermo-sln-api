import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ElasticsearchModule } from '@nestjs/elasticsearch'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { UserSchema } from './interfaces/user.interface';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { CommonModule } from './common/common.module';
import { VideoController } from './controllers/video/video.controller';
import { VideoService } from './services/video/video.service';
import { VideoSchema } from './interfaces/video.interface';
import { LocalStrategy } from './common/guards/local.strategy';
import { JwtStrategy } from './common/guards/jwt.strategy';
import { CommentService } from './services/comment/comment.service';
import { CommentSchema } from './interfaces/comment.interface';
import { FollowService } from './services/follow/follow.service';
import { FollowSchema } from './interfaces/follow.interface'
import { NotificationSchema } from './interfaces/notification.interface'

import { HttpModule } from 'src/common/http/http.module';
import { FeedController } from './controllers/feed/feed.controller';
import { NotificationService } from './services/notification/notification.service';
import { NotificationController } from './controllers/notification/notification.controller';

const JWT_PRIVATE_KEY = Buffer.from(process.env.JWT_PRIVATE_KEY, 'base64').toString('ascii')
const JWT_PUBLIC_KEY = Buffer.from(process.env.JWT_PUBLIC_KEY, 'base64').toString('ascii')
const JWT_PASSPHRASE = process.env.JWT_PASSPHRASE || 'lermo'
const JWT_ISSUER = process.env.JWT_ISSUER || 'lermo'
const JWT_EXPIRESIN = process.env.JWT_EXPIRESIN || '30d'

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION || "mongodb://localhost:27017/lermo"
const ELASTICSEARCH_CONNECTION = process.env.ELASTICSEARCH_CONNECTION || "http://localhost:9200"

@Module({
  imports: [
    HttpModule,
    ElasticsearchModule.register({
      node: ELASTICSEARCH_CONNECTION,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(DATABASE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      dbName: 'lermo'
    }),
    PassportModule,
    JwtModule.register({
      publicKey: JWT_PUBLIC_KEY,
      privateKey: { key: JWT_PRIVATE_KEY, passphrase: JWT_PASSPHRASE },
      signOptions: { algorithm: "RS256", expiresIn: JWT_EXPIRESIN, issuer: JWT_ISSUER, },
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
export class AppModule { }
