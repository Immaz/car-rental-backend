// src/services/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    // get host with fallback
    const host =
      this.configService.get<string>('MAIL_HOST') ?? 'smtp.mailersend.net';

    // parse port safely (env values are strings)
    const portStr = this.configService.get<string>('MAIL_PORT');
    const port = parseInt(portStr ?? '587', 10) || 587;

    // auth values (may be undefined in some envs; nodemailer will error if missing)
    const user = this.configService.get<string>('MAIL_USER') ?? '';
    const pass = this.configService.get<string>('MAIL_PASS') ?? '';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false, // keep false for 587 / 2525
      auth: {
        user,
        pass,
      },
    });

    // fallback from address so type is always string (replace with your verified sender)
    this.fromEmail =
      this.configService.get<string>('MAIL_FROM') ?? `no-reply@localhost`;
  }

  // Accept number|string for userId because callers may pass either
  async sendFPMail(
    email: string,
    userId: string | number,
  ): Promise<'success' | 'error'> {
    const rawFrontend =
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const frontend = rawFrontend.replace(/\/+$/g, ''); // remove trailing slash(es)
    const url = `${frontend}/forgotpassword/user/${String(userId)}`;

    const btn = `<a href="${url}" 
       style="
         display: inline-block;
         padding: 10px 20px;
         font-size: 16px;
         color: white;
         background-color: #007BFF;
         text-decoration: none;
         border-radius: 5px;
       " target="_blank">Change</a>`;

    const htmlBody = `Please change your account password by clicking this link: ${btn}`;

    return this.sendEmail(email, 'Change Password', htmlBody);
  }

  async sendConfirmMail(
    email: string,
    userId: string | number,
  ): Promise<'success' | 'error'> {
    const rawBackend =
      this.configService.get<string>('BACKEND_URL') ?? 'http://localhost:4000';
    const backend = rawBackend.replace(/\/+$/g, '');
    const url = `${backend}/users/verifyuser/${String(userId)}`;

    const btn = `<a href="${url}" 
       style="
         display: inline-block;
         padding: 10px 20px;
         font-size: 16px;
         color: white;
         background-color: #007BFF;
         text-decoration: none;
         border-radius: 5px;
       " target="_blank">Verify</a>`;

    const htmlBody = `Please activate your account by clicking this link: ${btn}`;

    return this.sendEmail(email, 'Confirm Your Email', htmlBody);
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<'success' | 'error'> {
    const mailOptions = {
      from: this.fromEmail,
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${info.response}`);
      return 'success';
    } catch (error) {
      console.error('Error sending email:', error);
      return 'error';
    }
  }
}
