import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model } from 'mongoose';
import { INotification } from 'src/interfaces/notification.interface'

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('notification') private readonly notiModel: Model<INotification>,
  ) {}

  async create(document: any): Promise<INotification> {
    const res = new this.notiModel(document);
    return await res.save();
  }

  async findAll(query: unknown, page?: number, limit?: number): Promise<any> {
    const res = await this.notiModel
                        .find(query)
                        .skip(page * limit)
                        .limit(limit || 10)
                        .sort({ createdAt: -1 });

    return res;
  }

  async update(query, update): Promise<any> {
    const res = await this.notiModel.update(query, update)
    return res
  }
}
