import { Controller, Get, Post, Body, Patch, Param, Req, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ExtendedRequest } from 'src/interfaces/RequestUserInterface';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  getUser(@Req() req: ExtendedRequest, @Res({ passthrough: true }) res: Response) {
    console.log(req?.user?.name, "name")
    return this.userService.getUser(req?.user?.id, res);
  }
  
  @Get("/auth/google/verify")
  googleAuthRedirect(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.userService.googleAuthVerify(code, res);
  }

  @Get("/auth/logout")
  logoutUser(
    @Res({ passthrough: true }) res: Response
  ) {
    return this.userService.logoutUser(res);
  }

  @Get("/auth/demo")
  demoLogin(
    @Res({ passthrough: true }) res: Response
  ) {
    return this.userService.demoLogin(res);
  }
  
  @Patch('/editDefaultMonthLimit/:amount')
  @UseGuards(AuthGuard)
  editMonthLimit(@Param('amount') amount: number, @Req() req: ExtendedRequest) {
    return this.userService.editDefaultMonthLimit(amount, req.user.id);
  }

  

}
