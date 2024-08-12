// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class StripeService {}
// src/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private endpointSecret: string = process.env.STRIPE_WEBHOOK_SECRET; // Replace with your Stripe webhook secret

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async createProductAndPrice(name: string, amount: number, currency: string): Promise<string> {
    // Create a product
    const product = await this.stripe.products.create({
      name,
    });

    // Create a price for the product
    const price = await this.stripe.prices.create({
      unit_amount: amount, // Amount in cents
      currency,
      product: product.id,
    });

    return price.id; // Return the Price ID
  }

  async createCheckoutSession(priceId: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      // success_url: "https://grambutler-project.onrender.com/stripe/session?session_id={CHECKOUT_SESSION_ID}",
      // success_url: 'localhost:3000/stripe/session?session_id={CHECKOUT_SESSION_ID}',
      // success_url: 'https://grambutler-project.onrender.com/stripe/session?session_id={CHECKOUT_SESSION_ID}',
      success_url: "https://grambutler-client-platform.onrender.com/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://grambutler-client-platform.onrender.com/payment-failure", // Add your failure URL here
    });

    return session.url;
  }

  async fetchSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }

  // handleWebhook(payload: Buffer, sig: string): string {
  //   let event: Stripe.Event;

  //   try {
  //     event = this.stripe.webhooks.constructEvent(payload, sig, this.endpointSecret);
  //   } catch (err) {
  //     console.error(`Webhook Error: ${err.message}`);
  //     throw new Error(`Webhook Error: ${err.message}`);
  //   }

  //   // Handle the event
  //   switch (event.type) {
  //     case 'checkout.session.completed':
  //       const session = event.data.object as Stripe.Checkout.Session;
  //       console.log('Checkout Session completed:', session);
  //       // Handle the successful payment here, e.g., update order status in database
  //       break;
  //     // Handle other event types if needed
  //     default:
  //       console.warn(`Unhandled event type ${event.type}`);
  //   }

  //   return 'Success';
  // }
  handleWebhook(payload: Buffer, sig: string): string {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, sig, this.endpointSecret);
    } catch (err) {
      console.error(`Webhook Error is here: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    // switch (event.type) {
    //   case 'checkout.session.completed':
    //     const session = event.data.object as Stripe.Checkout.Session;
    //     console.log('Checkout Session completed:', session);
    //     // Handle the successful payment here, e.g., update order status in the database
    //     break;
    //   // Handle other event types if needed
    //   default:
    //     console.warn(`Unhandled event type ${event.type}`);
    // }
    

    // return 'Success';
    switch (event.type) {
      case 'balance.available':
        const balanceAvailable = event.data.object;
        // Then define and call a function to handle the event balance.available
        break;
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
        break;
      case 'invoice.created':
        const invoiceCreated = event.data.object;
        // Then define and call a function to handle the event invoice.created
        break;
      case 'payment_intent.created':
        const paymentIntentCreated = event.data.object;
        // Then define and call a function to handle the event payment_intent.created
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
  
    // Return a 200 response to acknowledge receipt of the event
    return  'successfull'
  }
}
}