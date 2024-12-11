/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentModule } from 'src/payment/payment.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [StripeController],
  providers: [StripeService, PaymentService],
  imports: [PaymentModule, JwtModule]
})
export class StripeModule {}
