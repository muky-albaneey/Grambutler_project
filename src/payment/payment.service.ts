/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/user/entities/payment.entity';
import { Repository } from 'typeorm';


@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async savePayment(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentRepository.create(paymentData);
    return await this.paymentRepository.save(payment);
  }
}
