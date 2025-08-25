import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { ToolsResolver } from './tools.resolver';

@Module({
  imports: [MailModule],
  providers: [ToolsResolver],
})
export class ToolsModule {}
