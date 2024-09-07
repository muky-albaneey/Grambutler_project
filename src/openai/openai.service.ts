import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseEntity } from 'src/user/entities/response.entity';
import { User } from 'src/user/entities/user.entity';
import { PromptEntity } from 'src/user/entities/reponse_prompt.entity';


@Injectable()
export class OpenaiService {
  private readonly openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly openaiApiKey = process.env.OPENAI_API_KEY;

  constructor(
    @InjectRepository(ResponseEntity)
    private readonly responseRepository: Repository<ResponseEntity>,
    @InjectRepository(ResponseEntity)
    private readonly promptRepository: Repository<PromptEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async captionsAi(
    prompt: string,
    userId: number, // Add userId as a parameter
    no_of_captions: number,
    words_per_caption: number,
    tone: string,
    customEmojis?: boolean,
    customHashtags?: boolean,
    isContact?: boolean
  ): Promise<string> {
    // const emojis = customEmojis && customEmojis.length > 0 ? customEmojis : ['🔥', '🚀', '🎉'];
    // const hashtags = customHashtags && customHashtags.length > 0 ? customHashtags : ['OpenAI', 'AI', 'Tech'];
    // - Tone: Friendly and professional
     // Find the user by ID
     const user = await this.userRepository.findOne({ where: { id: userId } });
     if (!user) {
       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
     }

          const contactInfo = isContact == true ?`
          Contact Information:
          Name: ${user.full_name || 'N/A'}
          Email: ${user.email || 'N/A'}
          Phone: ${user.country || 'N/A'}
        ` : ``;
    const data = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
          You are a helpful assistant. Please generate responses based on the following constraints:
          - Number of captions: ${no_of_captions}
          - Number of words per caption: ${words_per_caption} words
          - Tone: ${tone}
          - Include the following emojis: ${customEmojis}
          - Include the following hashtags: ${customHashtags}

          - Ensure contacts are added if mentioned:
            - If a person is mentioned by name, include their contact details (e.g., email or phone number) if provided in the prompt.
            - If a company or organization is mentioned, include relevant contact information such as a website or support email.
            - If no specific contact details are provided, suggest generic contact methods (e.g., "Reach out via our website or email us at support@example.com").

          ${contactInfo}
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

  async promptAi(prompt: string, userId: number, ): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    try {
      const response = await axios.post(
        this.openaiApiUrl,
        {
          model: 'gpt-4',
          // messages: [{ role: 'user', content: prompt }],
           messages : [
            {
              role: 'system',content: `You are a helpful assistant tasked with providing accurate and insightful information to assist the user in achieving their goals efficiently. Always respond in a polite, clear, and concise manner.`
            },
            {
              role: 'user',
              content: prompt
            }
          ]
          
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      

      // Extract the completion text from the response
      const completion = response.data.choices[0].message.content;

      const responseEntity = this.promptRepository.create({
        prompt,
        response: completion,
        createdAt: new Date(),
        user, // Associate the response with the user
      });

      await this.promptRepository.save(responseEntity);
      return completion;
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      throw new HttpException(
        'Failed to communicate with OpenAI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findLastTenCaptionResponses(userId: number): Promise<ResponseEntity[]> {
    // Ensure the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Fetch the last ten caption_responses
    const captionResponses = await this.responseRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return captionResponses;
  }

  async findLastTenPromptResponses(userId: number): Promise<PromptEntity[]> {
    // Ensure the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Fetch the last ten prompt_responses
    const promptResponses = await this.promptRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return promptResponses;
  }
  

}
