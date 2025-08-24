import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      success: true,
      message: 'Madarik NestJS API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
