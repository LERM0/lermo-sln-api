import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { IVideoModel, IVideo, IVideoStatus, IVideoUpdate } from 'src/interfaces/video.interface';

@Injectable()
export class VideoService {
  index = 'videos'
  constructor(
    @InjectModel('video') private readonly videoModel: Model<IVideoModel>,
  ) { }

  async findAll(query: unknown, page?: number, limit?: number): Promise<IVideoModel[]> {
    const res = await this.videoModel
      .find(query)
      .skip(page * limit)
      .limit(limit || 20)
      .sort({ createdAt: -1 });
    return res;
  }

  async findOne(_id: ObjectId): Promise<IVideoModel> {
    const res = await this.videoModel.findOne({ _id });
    return res;
  }

  async findByStreamKey(videoKey: string): Promise<IVideoModel> {
    const res = await this.videoModel.find({ videoKey });
    return res[0];
  }

  async findByTitle(title: string): Promise<IVideoModel[]> {
    const res = await this.videoModel.find({ title: { $regex: `${title}`, $options: 'i' } }).sort({ createdAt: -1 });
    return res;
  }

  async findByUserId(userId: string): Promise<IVideoModel[]> {
    const res = await this.videoModel.find({ userId: userId }).sort({ createdAt: -1 });
    return res;
  }

  async findById(_id: string): Promise<IVideoModel> {
    const res = await this.videoModel.findById(_id)
    return res;
  }

  async create(document: IVideo): Promise<IVideoModel> {
    const res = new this.videoModel(document);
    return await res.save();
  }

  async updateVideo(_id: string, document: IVideoUpdate): Promise<any> {
    const res = await this.videoModel.findByIdAndUpdate(_id, document)
    return res
  }

  async updateVideoStatus(_id: string, document: IVideoStatus): Promise<any> {
    const res = await this.videoModel.findByIdAndUpdate(_id, document)
    return res
  }

  async deleteVideoKey(videoKey: string) {
    await this.videoModel.update({ videoKey }, { $unset: { "videoKey": "" } })
  }

  async updateThumbnail(_id: ObjectId, uri: string): Promise<any> {
    const res = await this.videoModel.updateOne(
      { _id },
      {
        $set: {
          thumbnail: uri,
        }
      }
    );
    return res
  }

  async updateView(_id: ObjectId): Promise<any> {
    const res = await this.videoModel.updateOne(
      { _id },
      { $inc: { view: 1 } }
    );
    return res
  }

}
