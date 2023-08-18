import { Controller } from '@nestjs/common';
import {
  Post,
  Body,
  Get,
  Delete,
  Request,
  UseGuards,
  Query,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PostDTO, UpdatePostDTO, CreateCommentDTO } from 'src/common/validators';
import { ApiBody, ApiBearerAuth, ApiConsumes, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserService } from 'src/services/user/user.service';
import { CommentService } from 'src/services/comment/comment.service';
import { NotificationService } from 'src/services/notification/notification.service'
import { NOTIFICATION_TYPE, NOTIFICATION_STATUS, MESSAGE_TYPE } from 'src/interfaces/notification.interface'



@Controller('notifications')
@ApiTags('notifications')
@UseInterceptors(ResponseInterceptor)
@ApiBearerAuth()
export class NotificationController {
  constructor(
    private readonly notiService: NotificationService
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getNoti(@Request() req) {
    const { _id } = req.user

    const query = {
      userId: _id,
    }

    const res = await this.notiService.findAll(query)
    return res
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async updateNotiStatus(@Request() req) {
    const { _id } = req.user

    const query = {
      userId: _id,
      status: NOTIFICATION_STATUS.UNREAD
    }

    const update = {
      userId: _id,
      status: NOTIFICATION_STATUS.READ
    }

    const res = await this.notiService.update(query, update)

    return res
  }

}
