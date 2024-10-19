import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { EbooksModule } from './ebooks/ebooks.module';
import { WebsiteModule } from './website/website.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [
    EventsModule,
    EbooksModule,
    WebsiteModule,
    FeedbackModule,
    CommunityModule,
  ],
})
export class AdminModule {}
