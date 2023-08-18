import { Document, Schema } from 'mongoose';

export interface IVideo {
  title: string;
  userId: string;
  description?: string;
  videoType?: string;
  paymentType?: string;
  enableDonation?: boolean;
  price?: number;
  freeMinute?: number;
  thumbnail?: string;
  tags?: [];
  categories?: [];
  status?: string;
  videoKey?: string;
  videoName?: string;
  videoPath?: string;
  videoDuration?: number;
}

export interface IVideoUpdate {
  title?: string;
  description?: string;
  paymentType?: string;
  videoType?: string;
  enableDonation?: boolean;
  price?: number;
  freeMinute?: number;
  thumbnail?: string;
  tags?: [];
  categories?: [];
  status?: string;
  videoKey?: string;
  videoName?: string;
  videoPath?: string;
  videoDuration?: number;
}

export interface IVideoStatus {
  status: string;
  videoName: string;
  videoPath: string;
  videoDuration: number;
}

export interface IVideoModel extends Document, IVideo {
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      // index: true,
    },
    view: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    description: String,
    videoType: String,
    videoKey: String,
    paymentType: String,
    enableDonation: Boolean,
    price: Number,
    freeMinute: Number,
    status: String,
    videoName: String,
    videoPath: String,
    videoDuration: Number,
    thumbnail: String,
    tags: Array,
    categories: Array,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export { VideoSchema };
