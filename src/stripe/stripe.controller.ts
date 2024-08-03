import { Controller, Post, Body, Req, Res, Headers, Get, Query, HttpStatus } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-product-and-price')
  async createProductAndPrice(@Body() body: { name: string, amount: number, currency: string }, @Res() res: Response) {
    try {
      const priceId = await this.stripeService.createProductAndPrice(body.name, body.amount, body.currency);
      res.status(HttpStatus.OK).json({ priceId });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('create-checkout-session')
  async createCheckoutSession(@Body('priceId') priceId: string, @Res() res: Response) {
    const url = await this.stripeService.createCheckoutSession(priceId);
    res.status(200).json({ url });
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Headers('stripe-signature') sig: string, @Res() res: Response) {
    try {
      const rawBody = req.rawBody;
      if (typeof rawBody === 'string') {
        throw new Error('rawBody should be a Buffer');
      }
      const result = await this.stripeService.handleWebhook(rawBody, sig);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  @Get('session')
  async getSession(@Query('session_id') sessionId: string, @Res() res: Response) {
    try {
      const session = await this.stripeService.fetchSession(sessionId);
      res.status(200).json(session);
    } catch (error) {
      res.status(400).send(`Error fetching session: ${error.message}`);
    }
  }
}
