import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiKey: string;
  private readonly fromEmail: string;
  private readonly fromName?: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('RESEND_API_KEY') || '';
    this.fromEmail = this.config.get<string>('FROM_EMAIL') || '';
    this.fromName = this.config.get<string>('FROM_NAME') || undefined;
  }

  get isConfigured() {
    return !!this.apiKey && !!this.fromEmail;
  }

  async sendEmail(params: { to: string; subject: string; html?: string; text?: string }) {
    if (!this.isConfigured) {
      this.logger.warn('Resend not configured. Skipping email send.');
      return { skipped: true } as const;
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromName ? `${this.fromName} <${this.fromEmail}>` : this.fromEmail,
          to: params.to,
          subject: params.subject,
          ...(params.html ? { html: params.html } : {}),
          ...(params.text ? { text: params.text } : {}),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        this.logger.error(`Resend API error: ${res.status} ${res.statusText} - ${text}`);
        throw new Error(`Failed to send email via Resend: ${res.status} ${res.statusText} - ${text}`);
      }

      const json = await res.json();
      this.logger.log(`Email queued via Resend: ${json?.id ?? 'unknown id'}`);
      return json;
    } catch (err) {
      this.logger.error('Resend email send failed', err as any);
      throw err;
    }
  }
}
