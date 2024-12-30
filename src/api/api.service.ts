import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
    getApi(): string {
        return "hello API"
    }
}
