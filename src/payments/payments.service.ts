import { Injectable } from '@nestjs/common';
import { env } from 'src/config/env';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(env.STRIPE_SECRET_KEY);

  createPaymentSession() {
    return 'createPaymentSession';
  }
}
