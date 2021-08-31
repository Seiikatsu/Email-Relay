import { Router } from 'express';
import EmailController from '../controllers/email.controller';
import { SendEmailDto } from '../dtos/emails.dto';
import { Routes } from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';

class EmailRoute implements Routes {
  public path = '/email';
  public router = Router();
  public emailController = new EmailController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}/send`, validationMiddleware(SendEmailDto, 'body'), this.emailController.sendEmail);
  }
}

export default EmailRoute;
