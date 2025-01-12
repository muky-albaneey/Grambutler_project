  /* eslint-disable prettier/prettier */
  import { Injectable } from '@nestjs/common';
  import { PaymentService } from 'src/payment/payment.service';
  import Stripe from 'stripe';

  @Injectable()
  export class StripeService {
    private stripe: Stripe;
    private endpointSecret: string = process.env.STRIPE_WEBHOOK_SECRET; // Replace with your Stripe webhook secret

    constructor(private readonly paymentService: PaymentService) {
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
        product: product.id
      });

      return price.id; // Return the Price ID
    }

   
  async createCheckoutSession(priceId: string): Promise<string> {
    // Create a checkout session
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: "https://grambutler.vercel.app/payment-success/sessionId={CHECKOUT_SESSION_ID}",
      // success_url: "https://grambutler-project-d8bz.onrender.com/stripe/session?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://grambutler.vercel.app/pricing", // Add your failure URL here
    });

    // Return the session URL to redirect the user
    return session.url;
  }

  async fetchSessionAndSavePayment(sessionId: string, userId: string): Promise<void> {
  
    try {
      const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId);
      if (checkoutSession.payment_status === 'paid') {
        await this.paymentService.savePayment(
          {
            paymentIntentId: checkoutSession.id,
            amount: checkoutSession.amount_total,
            currency: checkoutSession.currency,
            status: checkoutSession.payment_status,
          },
          userId,
        );
        console.log('its working: ', userId)
      } else {
        console.warn(`Payment not successful. Status: ${checkoutSession.payment_status}`);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      throw new Error('Error processing payment session');
    }
    
  }

  handleWebhook(payload: Buffer, sig: string): string {
    let event: Stripe.Event;
  
    try {
      event = this.stripe.webhooks.constructEvent(payload, sig, this.endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }
  
    console.log('Received Stripe Event:', event);
  
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout Session completed:', session);
        // Perform any additional database operations or logic here, if needed
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice);
        // Handle invoice payment success (if needed)
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  
    return 'success';
  }
  
  



  }