import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<any>('STRIPE_SECRET_KEY'));
  }
  async createPaymentIntent(amount: number, currency = 'usd') {
    return await this.stripe.paymentIntents.create({
      amount, // amount in cents
      currency,
      payment_method_types: ['card'],
    });
  }

  async verifyPayment(paymentIntentId: string) {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      return true;
    }
    return false;
  }
}
