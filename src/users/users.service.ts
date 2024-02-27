import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<any>) {}

  async create(email: string, password: string): Promise<User> {
    const user = new this.userModel({ email, password });
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: any): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async update(id: string, usersData: any): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, usersData, { new: true })
      .exec();
  }
  async remove(id: string): Promise<any> {
    try {
      const doc = await this.userModel.findByIdAndDelete(id).exec();
      return doc;
    } catch (err) {
      throw new BadRequestException(`Error inesperado`);
    }
  }

  async findOneByEmail(email: string, error: boolean = true): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user && error) {
      throw new NotFoundException(`User with email:${email} not found `);
    }
    return user;
  }

  async registerUser(body: any): Promise<User> {
    const createdUser = new this.userModel(body);
    return createdUser.save();
  }

  async verificatedFindByCodeAndEmail(
    code: string,
    email: string,
    validate: boolean = true,
  ): Promise<User> {
    const user = await this.userModel.findOne({ email: email, code }).exec();
    if (!user) {
      throw new NotFoundException(`User with email:${email} not found `);
    }
    if (validate) {
      user.code = null;
      user.status = true;
      await user.save();
    }
    return user;
  }
}
