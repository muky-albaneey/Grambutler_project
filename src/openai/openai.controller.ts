import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('captions')
  async getChatCompletion(
    @Body('prompt') prompt: string,
    @Body('userId') userId: number, // Accept userId in the request body
    @Body('no_of_captions') no_of_captions: number,
    @Body('words_per_caption') words_per_caption: number,
    @Body('tone') tone: string,
    @Body('customEmojis') customEmojis?: boolean,
    @Body('customHashtags') customHashtags?: boolean,
    @Body('isContact') isContact?: boolean,
  ): Promise<string> {
    const result = await this.openaiService.captionsAi(
      prompt,
      userId, // Pass userId to the service
      no_of_captions,
      words_per_caption,
      tone,
      customEmojis,
      customHashtags,
      isContact
    );

    return result;
  }


  @Post('prompt')
  async getPrompt(@Body('prompt') prompt: string, @Body('userId') userId: number,): Promise<string> {
    return this.openaiService.promptAi(prompt, userId);
  }
}
