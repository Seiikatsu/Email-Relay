import { SendEmailDto } from "../dtos/emails.dto";
import { HttpException } from "../exceptions/HttpException";
import nodemailer from "nodemailer";
import { logger } from "../utils/logger";

const smtpConfig = {
  host: "mail.seikatsu.io",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

const transport = nodemailer.createTransport(smtpConfig);

export default class EmailService {
  async sendEmail(data: SendEmailDto) {
    try {
      await transport.sendMail({
        from: data.email,
        to: "seikatsu@seikatsu.io",
        subject: data.subject,
        text: `Name: ${data.name}\nMessage: ${data.text}`,
      });
    } catch (e) {
      logger.error("Could not send e-mail: ", e);
      throw new HttpException(500, "Could not send e-mail.");
    }
  }
}
