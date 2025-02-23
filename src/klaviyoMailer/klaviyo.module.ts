import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KlaviyoService } from "./klaviyo.service";

@Module({
    imports: [ConfigModule],
    providers: [KlaviyoService],
    exports: [KlaviyoService],
})

export class KlaviyoModule {}