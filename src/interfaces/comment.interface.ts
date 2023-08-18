import { Document, Schema, ObjectId } from 'mongoose';

export interface IComment {
  userId: ObjectId;
  videoId: ObjectId;
  message: string;
}

export interface IPostComment {
  userId: ObjectId;
  postId: ObjectId;
  message: string;
}

export interface ICommentModel extends Document, IComment {
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
    },
    postId: {
      type: Schema.Types.ObjectId,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export { CommentSchema };

