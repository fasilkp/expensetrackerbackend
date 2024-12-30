import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ExtendedRequest } from 'src/interfaces/RequestUserInterface';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/item')
@UseGuards(AuthGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {
    console.log("item controller invoked") 
  }

  @Post()
  async create(@Body() createItemDto: CreateItemDto, @Req() req: ExtendedRequest) {
    return this.itemService.create({...createItemDto, uid:req.user.id});
  }
  
  @Get()
  findAll(@Req() req: ExtendedRequest, @Query('month') month: string | null, @Query('limit') limit: number | null) {
    console.log(req.user, "req.user")
    return this.itemService.findAll(req.user.id, month, limit);
  }

  @Patch()
  async editItem(@Body() updateItemDto: UpdateItemDto, @Req() req: ExtendedRequest) {
    return this.itemService.editItem(updateItemDto, req.user.id);
  }

  //Monthly Limit

  @Get('/monthly')

  getAllMonthDetails(
    @Req() req: ExtendedRequest
  ) {
    return this.itemService.getAllMonthDetails(req.user.id );
  }

  @Get('/month/:month')

  getMonthDetails(
    @Param('month') month: string,
    @Query('monthlyLimit') monthlyLimit: number,
    @Req() req: ExtendedRequest
  ) {
    return this.itemService.getMonthDetails(month,monthlyLimit, req.user.id );
  }

  @Patch('/monthlyLimit/:amount')
  editMonthlyLimit(@Param('amount') amount: number, @Req() req: ExtendedRequest) {
    return this.itemService.editMonthlyLimit(req.user.id, amount);
  }
}

