import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../interfaces/RequestUserInterface';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';

@Injectable()


export class VerifyUser implements NestMiddleware {
  constructor(
    private jwtService: JwtService
  ) { }
  async use(req: ExtendedRequest, res: Response, next: NextFunction) {

    try {
      const verified = await this.jwtService.verifyAsync(req.cookies.token, { secret: jwtConstants.secret });
      console.log(verified, "in middleware");
      if (verified) {
        req.user = {
          id: verified.id,
          name: verified.name
        }
        next(); // Pass control to the next middleware or route handler
      }else{
        throw new UnauthorizedException('Token verification failed: user not found');
      }
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException('Token verification failed: user not found');
    }
    // Add a custom value to the request object

  }
}
