import { Document, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;
export interface IUser {
  email: string;
  username: string;
  password: string;
  classrooms?: string[];
  about?: string;
  gender?: string;
  age?: number;
  avatar?: string;
  banner?: string;
  explore?: [];
}

export interface IUserModel extends Document, IUser {
  createAt: Date;
  updateAt: Date;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    about: String,
    age: Number,
    gender: String,
    avatar: String,
    banner: String,
    explore: Array,
    classrooms: Array
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

UserSchema.pre<IUserModel>('save', function(next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified('password')) return next(null);

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next(null);
    });
  });
});

export { UserSchema };
