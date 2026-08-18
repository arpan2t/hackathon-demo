import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  ArcjetGuard,
  ArcjetModule,
  detectBot,
  fixedWindow,
  shield,
} from '@arcjet/nest';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ArcjetModule.forRoot({
      key: process.env.ARCJECT_KEY ?? '',
      rules: [
        shield({ mode: 'LIVE' }),
        detectBot({
          mode: 'LIVE', // Blocks requests. Use "DRY_RUN" to log only
          // Block all bots except the following
          allow: [
            'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
            // Uncomment to allow these other common bot categories
            // See the full list at https://arcjet.com/bot-list
            //"CATEGORY:MONITOR", // Uptime monitoring services
            //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
          ],
        }),
        fixedWindow({
          mode: 'LIVE',
          window: '60s', // 60 second fixed window  means in this time frame no. of max request that can be hitten
          max: 5, // Allow a maximum of 5 requests
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ArcjetGuard,
    },
  ],
})
export class AppModule {}
