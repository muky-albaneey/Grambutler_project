import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {

  constructor(private readonly openaiService: OpenaiService) {}

  
  @Post('chat-completion')
  async getChatCompletion(@Body('prompt') prompt: string): Promise<string> {
    const customEmojis = ['🔥', '🚀', '🎉'];
    const customHashtags = ['OpenAI', 'AI', 'Tech'];
    
    const result = await this.openaiService.getChatCompletion(
      prompt,
      3,
      25,
      customEmojis,
      customHashtags,
    );
    
    return result;
  }

}
