import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {Item, ItemSchema} from '../../schemas/items.schema';
import {Monthly, MonthlySchema} from '../../schemas/monthly.schema';


@Module({imports:[
  MongooseModule.forFeature([
    { name: Item.name, schema: ItemSchema },
    { name: Monthly.name, schema: MonthlySchema }
  ]),
],
  controllers: [ItemController],
  providers: [ItemService],
})

export class ItemModule{}

//--------------------------
//Middleware Implementation
//--------------------------

// export class ItemModule implements NestModule {
//   // configure(consumer: MiddlewareConsumer) {
//   //   consumer
//   //     .apply(VerifyUser) // Correctly apply the middleware
//   //     .forRoutes('api/item'); // Apply only to routes under 'item'
//   // }
// }
