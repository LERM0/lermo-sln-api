import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDBObject } from './base.entity'
import { msToTime } from 'src/common/util/util'
import { Diff } from 'src/common/util/util'

@Exclude()
export class VideoEntity extends BaseDBObject {

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  videoKey: string;

  @Expose()
  videoType: string;

  @Expose()
  paymantType: string;

  @Expose()
  view: number;

  @Expose()
  userId: string;

  @Expose()
  about: string;

  @Expose()
  enableDonation: boolean;

  @Expose()
  price: number;

  @Expose()
  freeMinute: number;

  @Expose()
  thumbnail: string;

  @Expose()
  tags: string[];

  @Expose()
  categories: string[];

  @Expose()
  status: string;

  @Expose()
  videoPath: string;

  @Expose()
  videoName: string

  @Expose()
  @Transform(value => value && value.value ? msToTime(value.value) : '0m')
  videoDuration

  @Expose()
  username: string

  @Expose()
  avatar: string

  @Expose()
  videoUrl: string

  @Expose()
  @Transform(value => value && value.value ? Diff(value.value) : '')
  createdAt: string | Date


  constructor(partial: Partial<VideoEntity>) {
    super()
    Object.assign(this, partial);
  }
}
@Exclude()
export class VideoKeyEntity extends BaseDBObject {
  @Expose()
  _id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  videoType: string;

  constructor(partial: Partial<VideoEntity>) {
    super()
    Object.assign(this, partial);
  }
}
