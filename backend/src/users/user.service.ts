import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  private readonly SALT_ROUNDS: number = 10;

  async findOneById(id: string): Promise<User | null> {
    return this.model.findOne({ _id: new Types.ObjectId(id) });
  }

  async findOne(email: string): Promise<User | null> {
    return this.model.findOne({ email });
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await hash(dto.password, this.SALT_ROUNDS);
    const newUser: User = { ...dto, passwordHash: hashedPassword };
    return this.model.create(newUser);
  }

  async validateUser(credentials: LoginUserDto): Promise<any> {
    const user = await this.findOne(credentials.email);
    if (!user) throw new BadRequestException('User not found');

    const isMatch = compare(credentials.password, user.passwordHash);
    if (!isMatch) throw new BadRequestException('Password does not match');

    return user;
  }
}
