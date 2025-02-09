import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateOnboardingDto,
  UpdateOnboardingDto,
} from '../dto/onboarding.dto';
import { AdminOnboarding, Question } from '../entities/onboarding.entity';
import { OnboardingRepository } from '../repositories';
import { FilterDto } from 'src/utils/filter.dto';
import { QuestionRepository } from '../repositories/onboarding.repository';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly onboardingRepository: OnboardingRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async create(
    createOnboardingDto: CreateOnboardingDto,
    userId: string,
  ): Promise<AdminOnboarding> {
    const onboarding = await this.onboardingRepository.create({
      category: createOnboardingDto.category,
      createdBy: userId,
    });

    const questions: Question[] = createOnboardingDto.questions.map(
      (question) => {
        question.categoryId = onboarding.id;
        return question;
      },
    );

    try {
      await this.questionRepository.createMany(questions);
    } catch (error) {
      throw new BadRequestException(
        'Questions were not added to the onboarding category, update it or add them',
      );
    }

    return await this.onboardingRepository.saveOnboarding(onboarding);
  }

  findAll(filter: FilterDto): Promise<AdminOnboarding[]> {
    return this.onboardingRepository.find(
      {},
      { ...filter, populate: ['questions'] },
    );
  }

  findOne(id: string): Promise<AdminOnboarding> {
    return this.onboardingRepository.findOne({ id }, null, { questions: true });
  }

  async update(
    id: string,
    updateOnboardingDto: UpdateOnboardingDto,
  ): Promise<AdminOnboarding> {
    const { category, questions } = updateOnboardingDto;

    const onboarding = await this.onboardingRepository.findOne({ id }, null, {
      questions: true,
    });

    if (!onboarding) {
      throw new NotFoundException(`Onboarding entity not found`);
    }

    // Update category if provided
    if (category) {
      onboarding.category = category;
    }

    if (questions && questions.length) {
      await Promise.all(
        questions.map((questionDto) => {
          if (questionDto.id) {
            // Find existing question and update
            const existingQuestion = onboarding.questions.find(
              (q) => q.id === questionDto.id,
            );
            if (existingQuestion) {
              return { ...existingQuestion, ...questionDto };
            }
          }

          // If the question is new or not found, create a new question
          return this.questionRepository.create({
            ...questionDto,
            categoryId: onboarding.id, // Set the relationship
          });
        }),
      );
    }

    return this.onboardingRepository.saveOnboarding(onboarding);
  }

  remove(id: string): Promise<boolean> {
    return this.onboardingRepository.deleteMany({ id });
  }
}
