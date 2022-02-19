import { SendEmailDto } from "../dtos/emails.dto";
import { HttpException } from "../exceptions/HttpException";
import nodemailer from "nodemailer";
import { logger } from "../utils/logger";
import sanitizeHtml from "sanitize-html";

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
        from: sanitizeHtml(data.email),
        to: "seikatsu@seikatsu.io",
        subject: sanitizeHtml(data.subject),
        text: `Name: ${sanitizeHtml(data.name)}\nMessage: ${sanitizeHtml(
          data.content
        )}`,
      });
    } catch (e) {
      logger.error("Could not send e-mail: ", e);
      throw new HttpException(500, "Could not send e-mail.");
    }
  }
}
