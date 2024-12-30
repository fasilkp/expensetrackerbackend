import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../constants/constants';
import { ExtendedRequest } from '../../interfaces/RequestUserInterface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    
    try {
      const token = request.cookies.token;
      const verified = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });

      if (verified) {
        request.user = {
          id: verified.id,
          name: verified.name
        };
        return true; // Allow the request to proceed
      } else {
        throw new UnauthorizedException('Token verification failed: user not found');
      }
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Token verification failed: user not found');
    }
  }
}
