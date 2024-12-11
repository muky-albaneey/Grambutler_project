// /* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Payment } from 'src/user/entities/payment.entity';
// import { User } from 'src/user/entities/user.entity';
// import { Repository } from 'typeorm';


// @Injectable()
// export class PaymentService {
//   constructor(
//     @InjectRepository(Payment)
//     private paymentRepository: Repository<Payment>,

//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async savePayment(paymentData: Partial<Payment>, userId): Promise<Payment> {
//     const user = await this.userRepository.findOne({ where: { id: userId } });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const payment = this.paymentRepository.create({
//       ...paymentData,
//       user: user  // Associate payment with the user
//     });

//     return await this.paymentRepository.save(payment);
//   }
// }
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/user/entities/payment.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) 
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Make sure this is using Repository<User>
  ) {}

  async savePayment(paymentData: Partial<Payment>, userId): Promise<Payment> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const payment = this.paymentRepository.create({
      ...paymentData,
      user, // Associate payment with the user
    });

    return await this.paymentRepository.save(payment);
  }
}
