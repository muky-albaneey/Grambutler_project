// import { Body, Controller, Post } from '@nestjs/common';
// import { OpenaiService } from './openai.service';

// @Controller('openai')
// export class OpenaiController {
//   constructor(private readonly openaiService: OpenaiService) {}

//   @Post('chat-completion')
//   async getChatCompletion(
//     @Body('prompt') prompt: string,
//     @Body('no_of_captions') no_of_captions: number,
//     @Body('words_per_caption') words_per_caption: number,
//     @Body('customEmojis') customEmojis?: string[],  // Optional
//     @Body('customHashtags') customHashtags?: string[]  // Optional
//   ): Promise<string> {
//     // Pass parameters directly to the service
//     return this.openaiService.getChatCompletion(
//       prompt,
//       no_of_captions,
//       words_per_caption,
//       customEmojis,
//       customHashtags,
//     );
//   }
// }
import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat-completion')
  async getChatCompletion(
    @Body('prompt') prompt: string,
    @Body('userId') userId: string, // Accept userId in the request body
    @Body('no_of_captions') no_of_captions: number,
    @Body('words_per_caption') words_per_caption: number,
    @Body('customEmojis') customEmojis?: string[],
    @Body('customHashtags') customHashtags?: string[],
  ): Promise<string> {
    const result = await this.openaiService.getChatCompletion(
      prompt,
      userId, // Pass userId to the service
      no_of_captions,
      words_per_caption,
      customEmojis,
      customHashtags,
    );

    return result;
  }
}
