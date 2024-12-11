import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { Payment } from 'src/user/entities/payment.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User]), // Registers User and Payment repositories
    ConfigModule,
    HttpModule,
    UserModule
  ],
  providers: [PaymentService],
  exports: [TypeOrmModule] // Export TypeOrmModule to make it available for other modules
})
export class PaymentModule {}