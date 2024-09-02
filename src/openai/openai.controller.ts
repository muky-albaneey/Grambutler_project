import { Controller, Get, Query } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get('chat')
  async getChat(@Query('prompt') prompt: string) {
    const result = await this.openaiService.getChatCompletion(prompt);
    return result;
  }
}
