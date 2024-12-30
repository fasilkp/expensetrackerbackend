import { BadRequestException, ConflictException, Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose'
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService

  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      return newUser
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else if (err.code === 11000) {
        throw new ConflictException('User already exists');
      } else {
        // Handle other errors
        throw new Error('Internal Server Error');
      }
    }
  }

  async getUser(id: string, res: Response): Promise<User> {
    console.log(id)
    // res.cookie('token',"")
    // res.cookie('tokens',"")
    const user = await this.userModel.findById(id);
    return user;
  }

  async googleAuthVerify(code: string, @Res() res: Response) {
    try {
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
      const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
      const REDIRECT_URI = process.env.CLIENT_URL+"/user/auth/google/callback";
      console.log("redirecting to", REDIRECT_URI);
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      });
      console.log("token response", tokenResponse)

      const { access_token, id_token } = tokenResponse.data;
      const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      console.log("token response", userInfo)

      const user: Partial<CreateUserDto> = {
        email: userInfo.data.email,
        name: userInfo.data.name,
        image: userInfo.data.picture
      };

      await this.userModel.findOneAndUpdate({ email: user.email }, { $set: { image: user.image, name: user.name } }, { upsert: true });
      let newUser = await this.userModel.findOne({ email: user.email });
      const token = await this.jwtService.signAsync({ id: newUser._id, name: newUser.name }, { expiresIn: '30d' });
      console.log("newToken", token)
      res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true,
        secure: true,
        sameSite:"none"
      });
      return { message: "Login Successful" }

    } catch (err) {
      if (err?.response?.data) {
        console.log(err.response.data)
      } else {
        console.log(err);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else {
        // Handle other errors
        throw new Error('Internal Server Error');
      }

    }
  }

  async editDefaultMonthLimit(amount: Number, uid: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(uid, { $set: { monthlyLimit: amount } }, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validators are run
      });
      return user;

    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + err.message);
      } else {
        // Handle other errors
        throw new Error('Internal Server Error');
      }
    }
  }

  async logoutUser(@Res() res: Response) {
    res.cookie('token', '', { 
      maxAge: 0, 
      httpOnly: true,
      secure: true,
      sameSite:"none"
     });
    return { message: 'Logout Successful' };
  }

  async demoLogin(@Res() res: Response) {
    const token = await this.jwtService.signAsync({ id: "6772c8d37cde8809451781bd", name: "Demo User" }, { expiresIn: '30d' });
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24, 
      httpOnly: true,
      secure: true,
      sameSite:"none"
    });
    return { message: 'Demo Login Successfull' };
  }

}
