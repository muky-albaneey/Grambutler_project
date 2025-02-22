import { Injectable } from '@nestjs/common';
import { Klaviyo, ApiKeySession } from 'klaviyo-api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KlaviyoService {
  private klaviyo: any;

  constructor(private configService: ConfigService) {
    this.klaviyo = new ApiKeySession('pk_5dcce9c78ab6b179e919dc254111e0c12b');
  }

  async sendAccountCreationEmail(user: {
    email: string;
    fullName?: string;
  }) {
    try {
      await this.klaviyo.profiles.createProfile({
        data: {
          type: 'profile',
          attributes: {
            email: user.email,
            full_name: user.fullName,
          },
        },
      });

      await this.klaviyo.events.createEvent({
        data: {
          type: 'event',
          attributes: {
            metric: {
              name: 'Account Created',
            },
            profile: {
              email: user.email,
            },
            properties: {
              'Account Creation Date': new Date().toISOString(),
              template_id: 'TC7Pe7'
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to send account creation email: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      await this.klaviyo.events.createEvent({
        data: {
          type: 'event',
          attributes: {
            metric: {
              name: 'Password Reset Requested',
            },
            profile: {
              email: email,
            },
            properties: {
              resetToken,
              resetUrl: `${this.configService.get('APP_URL')}/reset-password?token=${resetToken}`,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  async sendTaskCompletionEmail(email: string, taskDetails: any) {
    try {
      await this.klaviyo.events.createEvent({
        data: {
          type: 'event',
          attributes: {
            metric: {
              name: 'Task Completed',
            },
            profile: {
              email: email,
            },
            properties: {
              taskId: taskDetails.id,
              taskName: taskDetails.name,
              completionDate: new Date().toISOString(),
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to send task completion email: ${error.message}`);
    }
  }
}