import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/constants';

@Module({
  imports: [ 
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UserModule, ItemModule
  ],
  providers: []
})
export class ApiModule {}
