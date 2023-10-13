import {
  Controller,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Param,
  Inject,
  NotFoundException,
  Get,
  Request,
  Query,
  HttpException,
  HttpStatus,
  Headers,
  HttpService,
  Delete,
  ClassSerializerInterceptor,
  UsePipes
} from '@nestjs/common';
import { VideoService } from 'src/services/video/video.service';
import {
  ApiBody,
  ApiTags,
  ApiConsumes,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TYPES } from 'src/common/types';
import {
  IStorageService,
  UploadKey,
} from 'src/common/interfaces/storage.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CommentService } from 'src/services/comment/comment.service';
import { UserService } from 'src/services/user/user.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';

import { VideoEntity } from 'src/entities/video.entity'

@Controller('feeds')
@UseInterceptors(ResponseInterceptor)
@ApiTags('feeds')
export class FeedController {
  constructor(
    private readonly userService: UserService,
    private readonly videoService: VideoService,
    private readonly commentService: CommentService,
    // @Inject(TYPES.IStorageService)
    // private readonly storageService: IStorageService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async feeds(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string,  @Query('uid') uid) {
    /* Videos, Posts, Tranding, Topic
    Videos List, Article List */ 
    let postQuery
    let videoQuery
    if (uid) {
      postQuery = { userId: uid,  status: 'publish' }
      videoQuery = { userId: uid, $or: [ { status: 'completed' }, { status: 'streaming'} ]  }
    } else {
      postQuery = { status: 'publish' }
      videoQuery = { $or: [ { status: 'completed' }, { status: 'streaming'} ] }
    }

    const videos = await this.videoService.findAll(videoQuery, parseInt(page), parseInt(limit));
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const user = await this.userService.findById(`${video.userId}`)
        const videoJSON = video.toJSON()
        // const videoUrl = await this.storageService.getPresignedUrl(videoJSON.videoPath, 60 * 60 * 2)
        // const avatarUrl = await this.storageService.getPresignedUrl(user.avatar, 60 * 60 * 24)
        // const thumbnailUrl = await this.storageService.getPresignedUrl(videoJSON.thumbnail, 60 * 60 * 24)
        const data = {
          ...videoJSON,
          thumbnail: '',
          username: user.username,
          avatar: '',
          videoUrl: ''
        }

        return new VideoEntity(data)
      }),
    );

    const data = [
      ...videosData
    ]

    const sortedData = data.sort((a: any, b: any) => {
      return  b.createdAt - a.createdAt 
    })

    return sortedData
  }

  @Get('/myfeed')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UseGuards(JwtAuthGuard)
  async getMyFeed(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string): Promise<any> {
    const { _id } = req.user
    const videoQuery = { userId: _id, status: { $ne: 'deleted'}}

    const videos = await this.videoService.findAll(videoQuery, parseInt(page), parseInt(limit));
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const user = await this.userService.findById(`${video.userId}`)
        const videoJSON = video.toJSON()
        // const videoUrl = await this.storageService.getPresignedUrl(videoJSON.videoPath, 60 * 60 * 2)
        // const avatarUrl = await this.storageService.getPresignedUrl(user.avatar, 60 * 60 * 24)
        // const thumbnailUrl = await this.storageService.getPresignedUrl(videoJSON.thumbnail, 60 * 60 * 24)
        const data = {
          ...videoJSON,
          thumbnail: '',
          username: user.username,
          avatar: '',
          videoUrl: ''
        }

        return new VideoEntity(data)
      }),
    );

    const data = [
      ...videosData
    ]

    const sortedData = data.sort((a: any, b: any) => {
      return  b.createdAt - a.createdAt 
    })

    return sortedData
  }

}
