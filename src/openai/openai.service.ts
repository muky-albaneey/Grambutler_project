/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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
    userId: string, // Add userId as a parameter
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

    const data = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an advanced AI assistant specializing in generating creative and engaging social media captions. Your task is to create ${no_of_captions} unique caption${no_of_captions > 1 ? 's' : ''} based on the following guidelines:

            1. Length: Aim for approximately ${words_per_caption} words per caption.
            2. Tone: Adopt a ${tone} tone.
            3. Hashtags: ${customHashtags ? 'Include relevant and trending hashtags.' : 'Do not include hashtags.'}
            4. Emojis: ${customEmojis ? 'Incorporate appropriate and trendy emojis to enhance engagement.' : 'Do not use emojis.'}
            5. Contact Information: ${isContact ? 'Include a call-to-action with contact details.' : 'Do not include contact information.'}

            Ensure each caption is:
            - Engaging and attention-grabbing
            - Relevant to the provided prompt
            - Optimized for the specific social media platform (if mentioned in the prompt)
            - Unique and creative, avoiding clichés
            
            If multiple captions are requested, make each one distinct in style and approach.`,
          },
        { role: 'user', content: prompt },
      ],
      n: 1,
      temperature: 0.7,
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

  async promptAi(prompt: string, userId: string, ): Promise<string> {
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
           messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that generates unique content ideas with detailed description thereby making user achieving their goals efficiently.`
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

  async findLastTenCaptionResponses(userId): Promise<ResponseEntity[]> {
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

  async findLastTenPromptResponses(userId): Promise<PromptEntity[]> {
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

  // async countEntitiesToday(): Promise<number[]> {
  //   const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)); // Start of the day
  //   const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)); // End of the day
  
  //   const responseCountToday = await this.responseRepository.count({
  //     where: {
  //       createdAt: Between(startOfDay, endOfDay)
  //     }
  //   });
  
  //   const promptCountToday = await this.promptRepository.count({
  //     where: {
  //       createdAt: Between(startOfDay, endOfDay)
  //     }
  //   });
  
  //   console.log(`Responses added today: ${responseCountToday}`);
  //   console.log(`Prompts added today: ${promptCountToday}`);
  
  //   return [responseCountToday, promptCountToday];
  // }
  
  async countEntitiesTodayAndWeek(): Promise<{ day: string, dayCount: number[], weekCount: number[] }> {
    // Helper function to get the name of the day
    const getDayName = (date: Date) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    };
  
    // Start and end of the day
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)); // End of the day
  
    // Start and end of the week (assuming the week starts on Sunday)
    const currentDate = new Date();
    const firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Get the first day of the current week
    const startOfWeek = new Date(new Date(currentDate.setDate(firstDayOfWeek)).setHours(0, 0, 0, 0)); // Start of the week
    const endOfWeek = new Date(new Date(currentDate.setDate(firstDayOfWeek + 6)).setHours(23, 59, 59, 999)); // End of the week
  
    // Count for today
    const responseCountToday = await this.responseRepository.count({
      where: {
        createdAt: Between(startOfDay, endOfDay)
      }
    });
  
    const promptCountToday = await this.promptRepository.count({
      where: {
        createdAt: Between(startOfDay, endOfDay)
      }
    });
  
    // Count for this week
    const responseCountWeek = await this.responseRepository.count({
      where: {
        createdAt: Between(startOfWeek, endOfWeek)
      }
    });
  
    const promptCountWeek = await this.promptRepository.count({
      where: {
        createdAt: Between(startOfWeek, endOfWeek)
      }
    });
  
    const dayName = getDayName(new Date());
  
    console.log(`Today is: ${dayName}`);
    console.log(`Responses added today: ${responseCountToday}`);
    console.log(`Prompts added today: ${promptCountToday}`);
    console.log(`Responses added this week: ${responseCountWeek}`);
    console.log(`Prompts added this week: ${promptCountWeek}`);
  
    return {
      day: dayName, // Name of the day (e.g., Monday)
      dayCount: [responseCountToday, promptCountToday], // Count for today
      weekCount: [responseCountWeek, promptCountWeek] // Count for this week
    };
  }
  
}
