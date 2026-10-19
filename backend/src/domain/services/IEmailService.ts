// Domain Service Interface: IEmailService

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface IEmailService {
  sendEmail(options: SendMailOptions): Promise<void>;
  sendPasswordResetEmail(to: string, resetToken: string, appUrl: string): Promise<void>;
  sendStudentWelcomeEmail(to: string, tempPassword: string, squadName: string, appUrl: string): Promise<void>;
}
