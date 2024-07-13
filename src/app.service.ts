import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Ya nuru samawati wal ard ya zal jalalu wal ikram!!');
    
    return 'Assalamuu alaikum World!';
  }
}
