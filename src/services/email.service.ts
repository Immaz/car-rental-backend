import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });

    this.fromEmail = this.configService.get<string>('MAIL_FROM');
  }

  async sendFPMail(email: string, userId: string) {
    const url = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}forgotpassword/user/${userId}`;
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

  async sendConfirmMail(email: string, userId: string) {
    const url = `${this.configService.get<string>('BACKEND_URL') || 'http://localhost:4000'}users/verifyuser/${userId}`;
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

  private async sendEmail(to: string, subject: string, html: string) {
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
