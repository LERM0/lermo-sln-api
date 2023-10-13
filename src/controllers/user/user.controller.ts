import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
  Query,
  SerializeOptions,
  ClassSerializerInterceptor,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  CreateUserDTO,
  FileUploadDTO,
  CreateFollowDTO,
  UpdateUserDTO,
} from 'src/common/validators';
import {
  IStorageService,
  UploadKey,
} from 'src/common/interfaces/storage.interface';

import { TYPES } from 'src/common/types';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { UserEntity, UserProfileEntity } from 'src/entities/user.entity';

import { UserService } from 'src/services/user/user.service';
import { VideoService } from 'src/services/video/video.service';
import { FollowService } from 'src/services/follow/follow.service';
import { AuthService } from 'src/services/auth/auth.service';

import { NotificationService } from 'src/services/notification/notification.service';
import {
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  MESSAGE_TYPE,
} from 'src/interfaces/notification.interface';

import { ConfigService } from '@nestjs/config';

@Controller('users')
@UseInterceptors(ResponseInterceptor)
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly videoService: VideoService,
    private readonly followService: FollowService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    // @Inject(TYPES.IStorageService)
    // private readonly storageService: IStorageService,
  ) { }

  @Get('/')
  async getUser() {
    const users = await this.userService.findAll({});
    const res: UserEntity[] = users.map(user => new UserEntity(user));
    return res;
  }

  @Get('/profile/:id')
  @ApiParam({ name: 'id', required: true })
  async getProfileById(@Param('id') id: string): Promise<any> {
    const user = await this.userService.findById(id).catch(err => {
      console.error(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // const avatarUrl = await this.storageService.getPresignedUrl(user.avatar, 60 * 60 * 24)
    // const bannerUrl = await this.storageService.getPresignedUrl(user.banner, 60 * 60 * 24)

    // const data = {
    //   ...user.toJSON(),
    //   avatar: avatarUrl,
    //   banner: bannerUrl
    // }

    // return new UserEntity(data);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any): Promise<any> {
    const { user } = req;
    const { _id } = user;

    // try {
    //   const user = await this.userService.findById(_id)
    //   const avatarUrl = await this.storageService.getPresignedUrl(user.avatar, 60 * 60 * 24)
    //   const bannerUrl = await this.storageService.getPresignedUrl(user.banner, 60 * 60 * 24)
    //   const data = {
    //     ...user.toJSON(),
    //     avatar: avatarUrl,
    //     banner: bannerUrl
    //   }

    //   return new UserProfileEntity(data)
    // } catch (error) {
    //   console.error(error);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.INTERNAL_SERVER_ERROR,
    //       message: 'Something went wrong',
    //     },
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  @Get('/follow/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'isFollowId', required: false })
  async getFollowing(
    @Param('id') id: string,
    @Query('isFollowId') isFollowId,
    @Request() req: any,
  ) {
    const queryFollower = { followId: id };
    const queryFollowing = { userId: id };

    const follower = await this.followService.count(queryFollower);
    const following = await this.followService.count(queryFollowing);
    const user = await this.followService.findByfollowId(isFollowId, id);
    const isFollow = user ? true : false;

    return { follower: follower, following: following, isFollow: isFollow };
  }

  @Patch('/profile')
  @ApiBody({ type: UpdateUserDTO })
  @UseGuards(JwtAuthGuard)
  async upadteProfile(
    @Request() req: any,
    @Body() body: UpdateUserDTO,
  ): Promise<any> {
    const { user } = req;
    const { _id, email } = user;
    const data: any = {};

    if (body.username) data.username = body.username;
    if (body.about) data.about = body.about;
    if (body.age) data.age = body.age;
    if (body.gender) data.gender = body.gender;

    if (body.oldPassword && body.password) {
      const user = await this.authService.validateUser(email, body.oldPassword);
      if (user) {
        data.password = await this.authService
          .hashPassword(body.password)
          .catch(err => {
            console.error(err);
            throw new HttpException(
              {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          });
      } else {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: 'User password is not correct',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }

    await this.userService.update(_id, data).catch(err => {
      console.error(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    const res = await this.userService.findById(_id).catch(err => {
      console.error(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    return new UserProfileEntity(res.toJSON());
  }

  @Post('/register')
  @ApiBody({ type: CreateUserDTO })
  async register(@Body() body: CreateUserDTO): Promise<any> {
    const user = await this.userService.create(body).catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'Email does exists',
        },
        HttpStatus.CONFLICT,
      );
    });
    const { email, username } = user;
    return {
      email,
      username,
    };
  }

  @Post('/index')
  async index() {
    const users = await this.userService.findAll({}).catch(err => {
      console.error(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    return { status: 'done' };
  }

  @Post('follow')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateFollowDTO })
  async follow(@Request() req: any, @Body() body: CreateFollowDTO) {
    const { username } = req.user;
    const userId: string = req.user._id;
    const followId = body.followId;

    if (followId === 'myspace' || userId === followId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: "Can't follow",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const follow = await this.followService
      .findByfollowId(userId, followId)
      .catch(err => {
        console.error(err);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    if (follow) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Following',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const data = {
      userId: userId,
      followId: followId,
    };

    await this.followService.create(data).catch(err => {
      console.error(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    const noti = {
      userId: followId,
      message: `${username} ${MESSAGE_TYPE.FOLLOW}`,
      notiType: NOTIFICATION_TYPE.FOLLOW,
      status: NOTIFICATION_STATUS.UNREAD,
    };
    await this.notificationService.create(noti);

    const queryFollower = { followId: followId };
    const queryFollowing = { userId: followId };

    const follower = await this.followService.count(queryFollower);
    const following = await this.followService.count(queryFollowing);
    const user = await this.followService.findByfollowId(userId, followId);
    const isFollow = user ? true : false;

    return { follower: follower, following: following, isFollow: isFollow };
  }

  @Patch('/profile/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload profile avatar.',
    type: FileUploadDTO,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileAvatar(
    @Request() req: any,
    @UploadedFile() file,
  ): Promise<any> {
    // const { buffer } = file;
    // const { user } = req;
    // const { _id } = user;

    // const fileName = `${_id}.png`;
    // const path = `${this.storageService.getLocationPath(UploadKey.AVATAR)}/${fileName}`;

    // try {
    //   const res = await this.storageService.uploadImage(buffer, path)
    //   await this.userService.updateAvatar(_id, path);
    //   return res
    // } catch (error) {
    //   console.log(error)
    //   throw new HttpException({
    //     status: HttpStatus.INTERNAL_SERVER_ERROR,
    //     message: 'Opps!!',
    //   }, HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }

  @Patch('/profile/banner')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload profile banner.',
    type: FileUploadDTO,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileBanner(
    @Request() req: any,
    @UploadedFile() file,
  ): Promise<any> {
    // const { buffer } = file;
    // const { user } = req;
    // const { _id } = user;

    // const fileName = `${_id}.png`;
    // const path = `${this.storageService.getLocationPath(UploadKey.BANNER)}/${fileName}`;

    // try {
    //   const res = await this.storageService.uploadImage(buffer, path)
    //   await this.userService.updateBanner(_id, path);
    //   return res
    // } catch (error) {
    //   console.log(error)
    //   throw new HttpException({
    //     status: HttpStatus.INTERNAL_SERVER_ERROR,
    //     message: 'Opps!!',
    //   }, HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }

  @Post('unfollow')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Request() req: any, @Body() body: CreateFollowDTO) {
    const userId: string = req.user._id;
    const followId = body.followId;

    const follow = await this.followService
      .findByfollowId(userId, followId)
      .catch(err => {
        console.error(err);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    if (!follow) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.followService.findByIdAndRemove(follow._id).catch(err => {
      console.error(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    const queryFollower = { followId: followId };
    const queryFollowing = { userId: followId };

    const follower = await this.followService.count(queryFollower);
    const following = await this.followService.count(queryFollowing);
    const user = await this.followService.findByfollowId(userId, followId);
    const isFollow = user ? true : false;

    return { follower: follower, following: following, isFollow: isFollow };
  }

  private async uploadAvatarImg(
    buffer: Buffer,
    fileName: string,
  ): Promise<any> {
    // const path = `${this.storageService.getLocationPath(
    //   UploadKey.AVATAR,
    // )}/${fileName}`;

    // const resUpload = await this.storageService.uploadFile(
    //   buffer,
    //   path,
    //   'public-read',
    // );
    // return resUpload.Key;
  }

  private async uploadBannerImg(
    buffer: Buffer,
    fileName: string,
  ): Promise<any> {
    // const path = `${this.storageService.getLocationPath(
    //   UploadKey.BANNER,
    // )}/${fileName}`;

    // const resUpload = await this.storageService.uploadFile(
    //   buffer,
    //   path,
    //   'public-read',
    // );
    // return resUpload.Key;
  }
}
