import nodemailer, { SendMailOptions } from 'nodemailer';

import logger from './logger';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMPT_USER,
    pass: process.env.SMPT_PASSWORD,
  },
});

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      logger.error(error);
      return;
    }
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

export default sendEmail;
