import { SendEmailDto } from "dtos/emails.dto";
import { HttpException } from "../exceptions/HttpException";
import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/isEmpty";
import EmailService from "../services/email.service";

class EmailController {
  private readonly emailService = new EmailService();

  public sendEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const emailData: SendEmailDto = req.body;

      if (isEmpty(emailData.name)) {
        throw new HttpException(400, 'The name should not be empty.');
      }
      if (isEmpty(emailData.email)) {
        throw new HttpException(400, 'The email should not be empty.');
      }
      if (isEmpty(emailData.subject)) {
        throw new HttpException(400, 'The subject should not be empty.');
      }
      if (isEmpty(emailData.content)) {
        throw new HttpException(400, 'The content should not be empty.');
      }

      await this.emailService.sendEmail(emailData);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default EmailController;
