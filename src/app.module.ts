import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'dpg-cq98u1jv2p9s73cfhb8g-a',
      host: 'dpg-cq98u1jv2p9s73cfhb8g-a',
      port: 5432,
      username: 'muky_albany',
      password: 'iOoWAcFOvQUPnqooXU9II2kvNLgd7KQ0',
      database: 'grambutler',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
