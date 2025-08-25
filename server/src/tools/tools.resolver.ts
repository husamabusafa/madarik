import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MailService } from '../mail/mail.service';
import { SendTestEmailInput, SendTestEmailResult } from './dto/test-email.dto';

@Resolver()
export class ToolsResolver {
  constructor(private readonly mail: MailService) {}

  @Mutation(() => SendTestEmailResult)
  async sendTestEmail(@Args('input') input: SendTestEmailInput): Promise<SendTestEmailResult> {
    try {
      const res = await this.mail.sendEmail({
        to: input.to,
        subject: input.subject || 'Madarik test email',
        html: input.html,
        text: input.text || 'Hello from Madarik (test email)\nThis is a simple deliverability test.',
      });

      // When mailer is not configured, we return skipped
      if ((res as any)?.skipped) {
        return { success: true, skipped: true, messageId: undefined, raw: 'skipped: mail not configured' };
      }

      return {
        success: true,
        messageId: (res as any)?.id ?? undefined,
        raw: JSON.stringify(res),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unknown error',
      };
    }
  }
}
