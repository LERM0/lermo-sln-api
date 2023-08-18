import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model } from 'mongoose';
import { IUserModel, IUser } from '../../interfaces/user.interface';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { UserEntity } from 'src/entity/user.entity'

@Injectable()
export class UserService {
  index = 'users'
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectModel('user') private readonly userModel: Model<IUserModel>,
  ) { }

  async create(document: IUser): Promise<IUserModel> {
    const res = new this.userModel(document);
    return await res.save();
  }

  async update(_id: string, document: IUser): Promise<IUser> {
    const res = this.userModel.findByIdAndUpdate(_id, document)
    return res
  }

  async findOne(email: string): Promise<any> {
    const res = await this.userModel.findOne({ email });
    return res;
  }

  async findById(_id: string): Promise<IUserModel> {
    const res = await this.userModel.findById(_id);
    return res;
  }

  async findByIds(ids: string[]): Promise<any> {
    const res = await this.userModel.find().where('_id').in(ids)
    return res;
  }

  async findAll(query: {}, page?: number, limit?: number): Promise<IUser[]> {
    const res = await this.userModel
      .find(query)
      .skip(page || 0)
      .limit(limit || 20)
      .sort({ createdAt: -1 });
    return res;
  }

  async updateAvatar(_id: string, uri: string): Promise<any> {
    const res = await this.userModel.updateOne(
      { _id },
      {
        $set: {
          avatar: uri,
        }
      }
    );
    return res
  }

  async updateBanner(_id: string, uri: string): Promise<any> {
    const res = await this.userModel.updateOne(
      { _id },
      {
        $set: {
          banner: uri,
        }
      }
    );
    return res
  }

  // async indexUser(user): Promise<any> {
  //   return await this.elasticsearchService.index({
  //     index: this.index,
  //     body: {
  //       username: user.username,
  //       userId: user._id
  //     }
  //   })
  // }

  // async search(query: string, from: Number, size: Number): Promise<any> {
  //   const queryStr = query ?
  //     {
  //       multi_match: {
  //         query: query,
  //         fields: ['username']
  //       }
  //     } :
  //     { match_all: {} }

  // const { body } = await this.elasticsearchService.search<any>({
  //   index: this.index,
  //   body: {
  //     from: from,
  //     size: size,
  //     query: queryStr
  //   }
  // })

  // const hits = body.hits.hits;
  // return hits.map((item) => item._source);
  // }

}
