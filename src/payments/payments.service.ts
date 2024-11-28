import { Injectable } from '@nestjs/common';
import { env } from 'src/config/env';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dot/create-payment-session.dto';
import { Request, Response } from 'express';

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
      success_url: env.STRIPE_URL_SUCCESSFUL_PAYMENT,
      cancel_url: env.STRIPE_URL_CANCEL_PAYMENT,
    });
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    const endpointSecret = env.STRIPE_ENDPOINT_SECRET_KEY;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        // TODO: llamar nuestro microservicio
        console.log({
          metadata: chargeSucceeded.metadata,
          orderId: chargeSucceeded.metadata.orderId,
        });
        break;

      default:
        console.log(`Event ${event.type} not handled`);
    }

    return res.status(200).json({ sig });
  }
}
