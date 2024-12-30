import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from 'src/schemas/items.schema';
import { Monthly } from 'src/schemas/monthly.schema';
import { Model, StringExpression } from 'mongoose';
import toMonthWords from 'utils/toMonthWords';
import { run } from 'node:test';

@Injectable()
export class ItemService {

  constructor(@InjectModel(Item.name) private itemModel: Model<Item>, @InjectModel(Monthly.name) private monthlyModel: Model<Monthly>) { }
  async create(reqBody: CreateItemDto) {
    try {
      const newItem = await this.itemModel.create(reqBody);
      await this.monthlyModel.findOneAndUpdate({
        month: toMonthWords(new Date().getMonth()) + new Date().getFullYear(),
        uid: reqBody.uid
      },
        { $inc: { spent: reqBody.amount, [reqBody.category]: reqBody.amount } },
        { upsert: true },
      )
      return newItem
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else {
        // Handle other errors
        throw new Error('Internal Server Error');
      }
    }
  }

  async editItem(reqBody: UpdateItemDto, uid: string) {
    try {
      const item = await this.itemModel.findById(reqBody._id);
      const updateItem = await this.monthlyModel.findByIdAndUpdate(reqBody._id,
        {
          $set: {
            amount: reqBody.amount ? reqBody.amount : reqBody.amount === 0 ? 0 : item.amount,
            category: reqBody.category ?? item.category,
            description: reqBody.description ?? item.description,
          }
        },
        { upsert: true, new: true, runValidators: true },
      );
      if (reqBody.amount || reqBody.amount === 0) {
        await this.monthlyModel.findOneAndUpdate({
          month: item.month,
          uid
        }, {
          $set: {
            [item.category]: reqBody.amount,
          },
          $inc: {
            spent: reqBody.amount
          }
        })
      }
      return updateItem
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else {
        // Handle other errors
        throw new Error('Internal Server Error');
      }
    }
  }

  async findAll(uid: string, month: string | null, limit: number | null): Promise<Item[]> {
    try {
      console.log(uid);
      let items = []
      if (month) {
        items = await this.itemModel.find({ uid, month });
      } else if (limit) {
        items = await this.itemModel.find({ uid }).limit(limit);
      }
      else {
        items = await this.itemModel.find({ uid });
      }
      return items
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else {
        // Handle other errors
        throw new Error('Internal Server Error');
      }
    }
  }


  async getMonthDetails(month: string, monthlyLimit: number, uid: string): Promise<Monthly> {
    try {
      let monthDetails = await this.monthlyModel.findOne({ uid, month });
      if (!monthDetails || monthDetails.limit == 0) {
        monthDetails = await this.monthlyModel.findOneAndUpdate({
          month: toMonthWords(new Date().getMonth()) + new Date().getFullYear(),
          uid
        },
          { $set: { limit: monthlyLimit } },
          { upsert: true, new: true, runValidators: true }
        )
      }
      return monthDetails
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else {
        // Handle other errors
        throw new Error('Internal Server Error');
      }
    }
  }
  async getAllMonthDetails(uid: string): Promise<Monthly[]> {
    try {
      let monthlyDetails = await this.monthlyModel.find({ uid });
      return monthlyDetails
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else {
        throw new Error('Internal Server Error');
      }
    }
  }
  async editMonthlyLimit(uid: string, monthlyLimit: number): Promise<Monthly> {
    try {
      const updatedMontlyData = await this.monthlyModel.findOneAndUpdate({
        month: toMonthWords(new Date().getMonth()) + new Date().getFullYear(),
        uid
      },
        { $set: { limit: monthlyLimit } },
        { new: true, runValidators: true }
      )
      return updatedMontlyData
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else {
        throw new Error('Internal Server Error');
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
