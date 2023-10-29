import { IsNotEmpty, isNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateFollowDTO {
  @IsNotEmpty()
  followId: string;
}

export class SearchDTO {
  @IsNotEmpty()
  @ApiProperty()
  query: string
}

export class CreateUserDTO {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class SignInDTO {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class FileUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class CreateVideoDTO {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  videoType: string;

  @ApiProperty({ type: String })
  videoKey: string;
}

export class UpdateVideoDTO {
  @ApiProperty({ type: String })
  status: string;

  @IsNotEmpty()
  @ApiProperty()
  videoId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty()
  videoType?: string;

  @ApiProperty()
  paymentType?: string;

  @ApiProperty({ type: Boolean })
  enableDonation?: boolean

  @ApiProperty({ type: Number })
  price?: number;

  @ApiProperty({ type: Number })
  freeMinute?: number;

  @ApiProperty({ type: Array })
  tags?: []; 

  @ApiProperty({ type: Array })
  categories?: [];
}

export class UpdateVideoStatusDTO {
  @IsNotEmpty()
  @ApiProperty()
  videoId: string;

  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @ApiProperty({ type: String })
  videoName: string;

  @ApiProperty({ type: String })
  videoPath: string;

  @ApiProperty({ type: Number })
  videoDuration: number
}

export class CreateCourseDTO {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: Array })
  videoLists: [string];
}

export class UpdatePositionVideoDTO {
  @IsNotEmpty()
  @ApiProperty({ type: Array })
  videoLists: [string]
}

export class CreateCommentDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  message: string;
}

export class PostDTO {
  @IsNotEmpty()
  @ApiProperty()
  contentRAW: JSON

  @ApiProperty()
  contentHTML: string

  @ApiProperty()
  userId: string

  @IsNotEmpty()
  status: string

  postType: string
}

export class UpdatePostDTO {
  @IsNotEmpty()
  @ApiProperty()
  postId: string

  @ApiProperty()
  contentRAW: JSON

  @ApiProperty()
  contentHTML: string

  @IsNotEmpty()
  @ApiProperty()
  status: string

  @ApiProperty()
  tags: []
}
export class CreateVideoPlaylistDTO {

  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  description?: string;

  @ApiProperty({ type: Number })
  price?: number;

  @ApiProperty({ type: String })
  thumbnail?: string;

  @ApiProperty({ type: String })
  tags?: string;

  @ApiProperty({ type: String })
  categories?: string;

  @ApiProperty({ type: String })
  status: string

  @ApiProperty({ type: [String] })
  videos: [string];
}

export class UpdateUserDTO {
  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  about: string

  @ApiProperty({ type: Number })
  age: number;

  @ApiProperty({ type: String })
  gender: string;

  @ApiProperty({ type: String })
  oldPassword: string;

  @ApiProperty({ type: String })
  password: string;
}

export class CreateClassroomDTO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: String })
  banner: string;
}

export class JoinClassroom {
  @ApiProperty({ type: String })
  classroomId: string;
}