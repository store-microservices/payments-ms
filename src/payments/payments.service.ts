import { Injectable } from '@nestjs/common';
import { env } from 'src/config/env';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dot/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(env.STRIPE_SECRET_KEY);

  createPaymentSession(createSessionDto: CreatePaymentSessionDto) {
    const { currency, items } = createSessionDto;
    const listItems = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    return this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {},
      },
      line_items: listItems,
      mode: 'payment',
      success_url: 'http://localhost:3003/api/payments/success',
      cancel_url: 'http://localhost:3003/api/payments/cancel',
    });
  }
}
