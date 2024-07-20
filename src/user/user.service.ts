import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, ForgotPass } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { OnboardingDto } from './dto/update-user.dto';
import { Onboarding } from './entities/onoard.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
    
    @InjectRepository(Onboarding)
    private readonly emailservice: MailService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async create(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (userValidate) {
        throw new UnauthorizedException('The user already exists!');
      }

      // Hash the password before saving
      createAuthDto.password = await this.hashPassword(createAuthDto.password);

      const newUser = await this.userRepository.create(createAuthDto);
      const userSaved = await this.userRepository.save(newUser);

      return { user: userSaved };
    } catch (error) {
      console.error('User creation failed', error);
      throw error;
    }
  }

  async login(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (!userValidate) {
        throw new UnauthorizedException('The user does not exist!');
      }

      const isMatch = await bcrypt.compare(createAuthDto.password, userValidate.password);
      if (!isMatch) {
        throw new UnauthorizedException('The password does not match!');
      }

      return userValidate;
    } catch (error) {
      console.error('User login failed', error);
      throw error;
    }
  }

  // FORGOT PASSWORD SECTION
  async getTokens(userEmail: ForgotPass) {
    const userValidate = await this.userRepository.findOne({
      where: { email: userEmail.email },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The email address does not exist!');
    }

    const token = Math.floor(10000 + Math.random() * 90000).toString();

    userValidate.rememberToken = token;
    await this.userRepository.save(userValidate);

    await this.emailservice.dispatchEmail(
      userValidate.email,
      'FORGOT PASSWORD TOKEN',
      `
      this token will be expired imediately you changed your password
      password reset token: ${token} `,
      `<h1>${userValidate.rememberToken}</h1>`
    );

    return `Message has been sent to your email, ${userValidate.full_name}`;
  }

  async validateTokens(tokenNum: string): Promise<string> {
    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    return userValidate.rememberToken;
  }

  async changePassword(tokenNum: string, newPassword: string) {
    console.log('Changing password for token:', tokenNum);

    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate || tokenNum == undefined || tokenNum == null || tokenNum == '') {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    console.log('User found for password change:', userValidate);

    userValidate.password = await this.hashPassword(newPassword);
    userValidate.rememberToken = ''; // Clear token after successful password change
    await this.userRepository.save(userValidate);

    console.log('Password changed and token cleared for user:', userValidate);
    return userValidate;
  }

  // async updateOnboarding(id, body : OnboardingDto){
  //   const user = await this.userRepository.findOne({
  //     where: { id },
  //     relations: ['onboard_info'],
  //   });
  //   console.log(user)
  //   // return user

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //      if (user.onboard_info) {
  //         // Update existing profile image entity
  //         user.onboard_info.marketing_objectives = body.marketing_objectives;
  //         user.onboard_info.target_audience = body.target_audience;
  //         user.onboard_info.campaigns = body.campaigns;
  //         user.onboard_info.social_media_business = body.social_media_business;
  //         user.onboard_info.info_caption = body.info_caption;
  //         user.onboard_info.marketing_challenges = body.marketing_challenges;
  //         user.onboard_info.marketing_or_sales = body.marketing_or_sales;
  //         user.onboard_info.dashoard_roles = body.dashoard_roles;
  //         user.onboard_info.members_dashoard = body.members_dashoard;
  //         user.onboard_info.current_workflow = body.current_workflow;
  //         user.onboard_info.type_of_support = body.type_of_support;
  //         user.onboard_info.recommend_dashboard = body.recommend_dashboard;
  //         user.onboard_info.immediate_questions = body.immediate_questions;
  //         user.onboard_info.personalized_training = body.personalized_training;
  //         user.onboard_info.about_new_features = body.about_new_features;
  //         user.onboard_info.contact_information = body.contact_information;
  
  
  //     // Save the updated profile image entity to the database
  //     return await this.onboardingRepository.save(user.onboard_info);
  //   } else {
  //     // Create new profile image entity
  //       const newonboarding = new Onboarding({
  //           marketing_objectives : body.marketing_objectives,
  //           target_audience : body.target_audience,
  //           campaigns : body.campaigns,
  //           social_media_business : body.social_media_business,
  //           info_caption : body.info_caption,
  //           marketing_challenges : body.marketing_challenges,
  //           marketing_or_sales : body.marketing_or_sales,
  //           dashoard_roles : body.dashoard_roles,
  //           members_dashoard : body.members_dashoard,
  //           current_workflow : body.current_workflow,
  //           type_of_support : body.type_of_support,
  //           recommend_dashboard : body.recommend_dashboard,
  //           immediate_questions : body.immediate_questions,
  //           personalized_training : body.personalized_training,
  //           about_new_features : body.about_new_features,
  //           contact_information : body.contact_information,
  //       });
  
  //      // Save the new profile image entity to the database
  //      return user.onboard_info = await this.onboardingRepository.save(newonboarding);
  //   }
  // }
  async updateOnboarding(id, body: OnboardingDto) {
    // Find the user with the given id and their associated onboarding information
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['onboard_info'],
    });
  
    console.log("User found: ", user);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.onboard_info) {
      // Update existing onboarding entity
      user.onboard_info.marketing_objectives = body.marketing_objectives;
      user.onboard_info.target_audience = body.target_audience;
      user.onboard_info.campaigns = body.campaigns;
      user.onboard_info.social_media_business = body.social_media_business;
      user.onboard_info.info_caption = body.info_caption;
      user.onboard_info.marketing_challenges = body.marketing_challenges;
      user.onboard_info.marketing_or_sales = body.marketing_or_sales;
      user.onboard_info.dashoard_roles = body.dashoard_roles;
      user.onboard_info.members_dashoard = body.members_dashoard;
      user.onboard_info.current_workflow = body.current_workflow;
      user.onboard_info.type_of_support = body.type_of_support;
      user.onboard_info.recommend_dashboard = body.recommend_dashboard;
      user.onboard_info.immediate_questions = body.immediate_questions;
      user.onboard_info.personalized_training = body.personalized_training;
      user.onboard_info.about_new_features = body.about_new_features;
      user.onboard_info.contact_information = body.contact_information;
  
      console.log("Updating existing onboarding info: ", user.onboard_info);
      await this.onboardingRepository.save(user.onboard_info);
    } else {
      // Create new onboarding entity
      const newonboarding = this.onboardingRepository.create(body);
  
      console.log("Creating new onboarding info: ", newonboarding);
      user.onboard_info = await this.onboardingRepository.save(newonboarding);
    }
  
    // Save the updated user entity with new or updated onboarding info
    
    console.log("User updated successfully: ", user);
    return await this.userRepository.save(user);
  }
  
  async findAll() {
    const user = await this.userRepository.find({      
      relations: {onboard_info: true}
    });
    return user
  }
}
