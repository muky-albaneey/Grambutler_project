/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Req, Res, Headers, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/guards/jwt.guards';
import { User } from 'src/decorators/user.decorator';

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

  // @UseGuards(JwtGuard)
  // @Post('webhook')
  // async handleWebhook(@Req() req: Request, @Headers('stripe-signature') sig: string, @Res() res: Response) {
  //   try {
  //     const rawBody = req.body; // Ensure this is accessed correctly
  //     console.log('Raw Body:', rawBody); // Log raw body for debugging
  //     if (!rawBody) {
  //       throw new Error('rawBody is undefined');
  //     }
  //     // const result = await this.stripeService.handleWebhook(rawBody, sig);
  //     const userId = req['userId'];// Extract user ID from JWT guard
  //     if (!userId) {
  //       throw new Error('User ID not found in the token.');
  //     }

  //     console.log('User ID:', userId); // Debug: Log the user ID
  //     const result = await this.stripeService.handleWebhook(rawBody, sig, userId);
  //     res.status(200).send(result);
  //   } catch (err) {
  //     console.error(`Webhook Error: ${err.message}`); // Log error for debugging
  //     res.status(400).send(`Webhook Error: ${err.message}`);
  //   }
  // }
  @UseGuards(JwtGuard)
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
    @Res() res: Response,
    @User('sub') userId: string // Use custom User decorator to access user ID
  ) {
    try {
      const rawBody = req.body;
      console.log('Raw Body:', rawBody);

      if (!rawBody) {
        throw new Error('rawBody is undefined');
      }

      console.log('User ID:', userId); // Debug: Log userId

      const result = await this.stripeService.handleWebhook(rawBody, sig, userId);
      res.status(200).send(result);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
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
