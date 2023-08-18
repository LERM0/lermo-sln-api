import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ICommentModel, IComment, IPostComment } from 'src/interfaces/comment.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('comment') private readonly commentModel: Model<ICommentModel>,
  ) {}

  async findAll(videoId: ObjectId): Promise<ICommentModel[]> {
    const res = await this.commentModel.find({ videoId })
    return res;
  }

  async create(document: IComment|IPostComment): Promise<ICommentModel|IPostComment> {
    const res = new this.commentModel(document);
    return await res.save().catch((err) => {
      console.error(err);
      return null
    });
  }
}
