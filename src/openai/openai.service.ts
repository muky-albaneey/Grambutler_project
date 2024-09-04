import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  private readonly openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly openaiApiKey = process.env.OPENAI_API_KEY;

  async getChatCompletion(
    prompt: string, 
    no_of_captions: number = 3, 
    words_per_caption: number = 20,
    customEmojis: string[] = [],
    customHashtags: string[] = []
  ): Promise<string> {
    // Prepare the emojis and hashtags as a string
    const emojis = customEmojis.join(' ');
    const hashtags = customHashtags.map(tag => `#${tag}`).join(' ');

    const data = {
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `
          You are a helpful assistant. Please generate responses based on the following constraints:
          - Number of captions: ${no_of_captions}
          - Number of words per caption: ${words_per_caption} words
          - Tone: Friendly and professional
          - Include the following emojis: ${emojis}
          - Include the following hashtags: ${hashtags}
          - Ensure contacts are added if mentioned
          `,
        },
        { role: 'user', content: prompt },
      ],
    };

    try {
      const response = await axios.post(
        this.openaiApiUrl,
        data,
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const completion = response.data.choices[0].message.content;
      return completion;
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      throw new HttpException(
        'Failed to communicate with OpenAI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
