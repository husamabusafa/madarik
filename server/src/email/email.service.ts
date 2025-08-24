import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface LeadNotificationData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  listingTitle: string;
  listingUrl: string;
}

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    await this.resend.emails.send({
      from: `${this.configService.get('FROM_NAME')} <${this.configService.get('FROM_EMAIL')}>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  async sendInvitationEmail(
    email: string,
    inviterName: string,
    role: string,
    inviteUrl: string,
  ): Promise<void> {
    const subject = 'Invitation to join Madarik Real Estate';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation to Madarik</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Madarik</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Real Estate Platform</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">You've been invited!</h2>
          
          <p>Hello,</p>
          
          <p><strong>${inviterName}</strong> has invited you to join Madarik Real Estate as a <strong>${role}</strong>.</p>
          
          <p>Madarik is our comprehensive real estate management platform where you can manage listings, handle leads, and collaborate with the team.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Accept Invitation</a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            <strong>Note:</strong> This invitation will expire in 7 days. If you don't accept it within this time, you'll need to request a new invitation.
          </p>
          
          <p style="font-size: 14px; color: #666;">
            If you're having trouble with the button above, copy and paste the following link into your browser:
          </p>
          <p style="font-size: 12px; word-break: break-all; color: #888;">${inviteUrl}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #888; text-align: center;">
            This email was sent by Madarik Real Estate. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to Madarik Real Estate!
      
      ${inviterName} has invited you to join Madarik Real Estate as a ${role}.
      
      To accept this invitation, please visit: ${inviteUrl}
      
      Note: This invitation will expire in 7 days.
      
      If you didn't expect this invitation, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    const subject = 'Reset your Madarik password';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password - Madarik</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Madarik Real Estate</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Reset your password</h2>
          
          <p>Hello,</p>
          
          <p>We received a request to reset your password for your Madarik account. If you made this request, click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            <strong>Note:</strong> This password reset link will expire in 1 hour for security reasons.
          </p>
          
          <p style="font-size: 14px; color: #666;">
            If you're having trouble with the button above, copy and paste the following link into your browser:
          </p>
          <p style="font-size: 12px; word-break: break-all; color: #888;">${resetUrl}</p>
          
          <p style="font-size: 14px; color: #666;">
            If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #888; text-align: center;">
            This email was sent by Madarik Real Estate for security purposes.
          </p>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset - Madarik Real Estate
      
      We received a request to reset your password for your Madarik account.
      
      To reset your password, please visit: ${resetUrl}
      
      Note: This link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  async sendEmailVerification(email: string, verifyUrl: string): Promise<void> {
    const subject = 'Verify your email - Madarik';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email - Madarik</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Verify your email</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Madarik Real Estate</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hello,</p>
          <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p style="font-size: 14px; color: #666;">If you’re having trouble, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; word-break: break-all; color: #888;">${verifyUrl}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">This email was sent by Madarik Real Estate.</p>
        </div>
      </body>
      </html>
    `;

    const text = `
      Verify your email - Madarik
      Please verify your email by visiting: ${verifyUrl}
    `;

    await this.sendEmail({ to: email, subject, html, text });
  }

  async sendLeadNotificationEmail(
    recipients: string[],
    leadData: LeadNotificationData,
  ): Promise<void> {
    const subject = `New Lead: ${leadData.name} - ${leadData.listingTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead - Madarik</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Lead Received</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Madarik Real Estate</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Lead Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;">Contact Information</h3>
            <p><strong>Name:</strong> ${leadData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${leadData.email}">${leadData.email}</a></p>
            ${leadData.phone ? `<p><strong>Phone:</strong> <a href="tel:${leadData.phone}">${leadData.phone}</a></p>` : ''}
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;">Property Interest</h3>
            <p><strong>Listing:</strong> <a href="${leadData.listingUrl}" style="color: #667eea;">${leadData.listingTitle}</a></p>
            ${leadData.message ? `
              <p><strong>Message:</strong></p>
              <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 10px 0;">
                ${leadData.message}
              </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${leadData.listingUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Listing</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #888; text-align: center;">
            This lead was submitted through the Madarik Real Estate website.
          </p>
        </div>
      </body>
      </html>
    `;

    const text = `
      New Lead Received - Madarik Real Estate
      
      Contact Information:
      Name: ${leadData.name}
      Email: ${leadData.email}
      ${leadData.phone ? `Phone: ${leadData.phone}` : ''}
      
      Property Interest:
      Listing: ${leadData.listingTitle}
      URL: ${leadData.listingUrl}
      
      ${leadData.message ? `Message: ${leadData.message}` : ''}
    `;

    await this.sendEmail({
      to: recipients,
      subject,
      html,
      text,
    });
  }
}
