import { Document, Schema, ObjectId } from 'mongoose';

export const NOTIFICATION_TYPE = {
  FOLLOW: 'follow',
  POST_COMMENT: 'post',
  VIDEO_COMMENT: 'video',
  TRANSCODE_SUCCESS: 'transcode_success'
}

export const NOTIFICATION_STATUS = {
  UNREAD: 'UNREAD',
  READ: 'READ'
}

export const MESSAGE_TYPE = {
  POST_COMMENT: 'commented on your post.',
  VIDEO_COMMENT: 'commented on your video.',
  FOLLOW: 'started following you.'
}

export interface INotification extends Document {
  userId: string,
  notiType: string,
  message: string,
  status: string,
  contentId: string
}

const NotificationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    contentId: {
      type: String,
    },
    notiType: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export { NotificationSchema }