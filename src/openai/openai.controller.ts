/* eslint-disable prettier/prettier */
import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ResponseEntity } from 'src/user/entities/response.entity';
import { PromptEntity } from 'src/user/entities/reponse_prompt.entity';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('captions')
  async getChatCompletion(
    @Body('prompt') prompt: string,
    @Body('userId') userId: string, // Accept userId in the request body
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
  // @Param('id', ParseUUIDPipe)

  @Post('prompt')
  async getPrompt(@Body('prompt') prompt: string, @Body('userId') userId: string,): Promise<string> {
    return this.openaiService.promptAi(prompt, userId);
  }

  @Get(':id/caption-responses')
  async getLastTenCaptionResponses(@Param('id', ParseUUIDPipe) userId: string): Promise<ResponseEntity[]> {
    try {
      const captionResponses = await this.openaiService.findLastTenCaptionResponses(userId);
      return captionResponses;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // New endpoint to get the last ten prompt_responses
  @Get(':id/prompt-responses')
  async getLastTenPromptResponses(@Param('id', ParseUUIDPipe) userId: string): Promise<PromptEntity[]> {
    try {
      const promptResponses = await this.openaiService.findLastTenPromptResponses(userId);
      return promptResponses;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

 
  @Get('count-today')
  async getCountEntitiesToday(): Promise<{ day: string, dayCount: number[], weekCount: number[] }> {
    return this.openaiService.countEntitiesTodayAndWeek();
  }
  
}
