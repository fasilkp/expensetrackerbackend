import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';
import { ApiModule } from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {VerifyUser} from './middlewares/verifyUser';
// import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiModule, 
    MongooseModule.forRoot(process.env.DB_URL)
    // PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AppController, ApiController],
  providers: [AppService, ApiService],

})
export class AppModule{}
