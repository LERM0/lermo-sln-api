import { Document, Schema, ObjectId } from 'mongoose';

export interface IFollow {
  userId: String
  followId: String
}

export interface IFollowModel extends Document, IFollow {
  createAt: Date;
  updateAt: Date;
}

const FollowSchema = new Schema (
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    followId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  },
)

export { FollowSchema }