import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsiteModule } from './website/website.module';
import { MessageModule } from './message/message.module';
import { SettingsModule } from './settings/settings.module';
import { TelegramService } from './customService/telegram.service';
import { ChatgptService } from './customService/chatgpt.service';
import { BookModule } from './book/book.module';
import { SettingsService } from './settings/settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './models/settings.model';

@Global()
@Module({
  imports: [WebsiteModule, MessageModule ,SettingsModule, BookModule],
  controllers: [AppController],
  providers: [AppService, TelegramService, ChatgptService, SettingsService],
  exports: [TelegramService]
})
export class AppModule {}
