import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenaiService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly apiKey = process.env.OPENAI_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async getChatCompletion(prompt: string) {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, data, { headers })
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching OpenAI API:', error.response?.data || error.message);
      throw new Error('Failed to fetch response from OpenAI API');
    }
  }
}
