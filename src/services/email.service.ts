import { Injectable } from '@nestjs/common';
const nodemailer = require('nodemailer');

@Injectable()
export class EmailService {
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'gerhard79@ethereal.email',
      pass: '7b3kSs7612YUHFp1YN',
    },
  });

  private mailOptions = {
    from: 'gerhard79@ethereal.email',
    to: '',
    html: '',
    subject: '',
  };

  async sendFPMail(email, userId) {
    const url = `http://localhost:3000/forgotpassword/user/${userId}`;
    const btn = `<a href="${url}" 
       style="
         display: inline-block;
         padding: 10px 20px;
         font-size: 16px;
         color: white;
         background-color: #007BFF;
         text-decoration: none;
         border-radius: 5px;
         "
         target="_blank" >
        Change
    </a>`;
    const body = `Please Change your account password by clicking this link ${btn}`;
    this.mailOptions.to = email;
    this.mailOptions.html = body;
    this.mailOptions.subject = 'Change Password';
    let response = await this.transporter.sendMail(
      this.mailOptions,
      (err, info) => {
        if (err) {
          return 'error';
        }
        return 'success';
      },
    );
    return response;
  }
  sendConfirmMail(email, userId) {
    const url = `http://localhost:4000/users/verifyuser/${userId}`;
    const btn = `<a href="${url}" 
       style="
         display: inline-block;
         padding: 10px 20px;
         font-size: 16px;
         color: white;
         background-color: #007BFF;
         text-decoration: none;
         border-radius: 5px;
         "
         target="_blank" >
        Verify
    </a>`;
    const body = `Please Activate your account by clicking this link ${btn}`;
    this.mailOptions.to = email;
    this.mailOptions.html = body;
    this.mailOptions.subject = 'Confirm Your Mail Please';

    this.transporter.sendMail(this.mailOptions, (err, info) => {
      if (err) {
        return new Error(err);
      }
      return info.response;
    });
  }
  async send(subject, body, email) {
    this.mailOptions.to = email;
    this.mailOptions.html = body;
    this.mailOptions.subject = subject;
    let response = await this.transporter.sendMail(
      this.mailOptions,
      (err, info) => {
        if (err) {
          return 'error';
        }
        return 'success';
      },
    );
    return response;
  }
}
