// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class OpenaiService {
//   private readonly openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
//   private readonly openaiApiKey = process.env.OPENAI_API_KEY;

//   async getChatCompletion(
//     prompt: string, 
//     no_of_captions: number = 3, 
//     words_per_caption: number = 20,
//     customEmojis?: string[],  // Optional
//     customHashtags?: string[]  // Optional
//   ): Promise<string> {
//     // Assign default values if not provided
//     const emojis = customEmojis && customEmojis.length > 0 ? customEmojis : ['🔥', '🚀', '🎉'];
//     const hashtags = customHashtags && customHashtags.length > 0 ? customHashtags : ['OpenAI', 'AI', 'Tech'];

//     const data = {
//       model: 'gpt-4-turbo',
//       messages: [
//         {
//           role: 'system',
//           content: `
//           You are a helpful assistant. Please generate responses based on the following constraints:
//           - Number of captions: ${no_of_captions}
//           - Number of words per caption: ${words_per_caption} words
//           - Tone: Friendly and professional
//           - Include the following emojis: ${emojis.join(' ')}
//           - Include the following hashtags: ${hashtags.map(tag => `#${tag}`).join(' ')}
//           - Ensure contacts are added if mentioned
//           `,
//         },
//         { role: 'user', content: prompt },
//       ],
//     };

//     try {
//       const response = await axios.post(
//         this.openaiApiUrl,
//         data,
//         {
//           headers: {
//             'Authorization': `Bearer ${this.openaiApiKey}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       const completion = response.data.choices[0].message.content;
//       return completion;
//     } catch (error) {
//       console.error('Error communicating with OpenAI:', error);
//       throw new HttpException(
//         'Failed to communicate with OpenAI',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseEntity } from 'src/user/entities/response.entity';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class OpenaiService {
  private readonly openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly openaiApiKey = process.env.OPENAI_API_KEY;

  constructor(
    @InjectRepository(ResponseEntity)
    private readonly responseRepository: Repository<ResponseEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getChatCompletion(
    prompt: string,
    userId: number, // Add userId as a parameter
    no_of_captions: number = 3,
    words_per_caption: number = 20,
    customEmojis?: string[],
    customHashtags?: string[],
  ): Promise<string> {
    const emojis = customEmojis && customEmojis.length > 0 ? customEmojis : ['🔥', '🚀', '🎉'];
    const hashtags = customHashtags && customHashtags.length > 0 ? customHashtags : ['OpenAI', 'AI', 'Tech'];

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
          - Include the following emojis: ${emojis.join(' ')}
          - Include the following hashtags: ${hashtags.map(tag => `#${tag}`).join(' ')}
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
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const completion = response.data.choices[0].message.content;

      // Find the user by ID
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Save the prompt and response to the database, associated with the user
      const responseEntity = this.responseRepository.create({
        prompt,
        response: completion,
        createdAt: new Date(),
        user, // Associate the response with the user
      });

      await this.responseRepository.save(responseEntity);

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
