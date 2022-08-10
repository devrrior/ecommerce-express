import nodemailer, { SendMailOptions } from 'nodemailer';

import logger from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      logger.error(`${error} Error sending email`);
      return;
    }
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

export default sendEmail;
