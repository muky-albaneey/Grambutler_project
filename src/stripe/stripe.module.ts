/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/user/entities/payment.entity';
import { User } from 'src/user/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forFeature([User, Payment]),HttpModule, UserModule],
  controllers: [StripeController],
  providers: [PaymentService, StripeService]
})
export class StripeModule {}
