import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [StripeController],
  providers: [PaymentService,StripeService],
})
export class StripeModule {}
