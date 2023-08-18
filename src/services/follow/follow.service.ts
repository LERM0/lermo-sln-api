import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model } from 'mongoose';
import { IFollow, IFollowModel } from 'src/interfaces/follow.interface'


@Injectable()
export class FollowService {

  constructor(
    @InjectModel('follow') private readonly followModel: Model<IFollowModel>
  ){}

  async create(doc: IFollow): Promise<IFollowModel>{
    const res = new this.followModel(doc)
    return await res.save();
  }

  async findByfollowId(userId: string, followId: string): Promise<any> {
    const res = await this.followModel.find({
        userId: userId,
        followId: followId
      })
    return res[0];
  }

  async count(query): Promise<any> {
    const res = await this.followModel.count(query)
    return res;
  }

  async findByIdAndRemove(_id: string): Promise<any> {
    const res = await this.followModel.findByIdAndRemove(_id)

    return res;
  }
}