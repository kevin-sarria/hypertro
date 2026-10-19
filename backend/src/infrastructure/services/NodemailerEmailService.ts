// Infrastructure Services: NodemailerEmailService

import nodemailer, { Transporter } from 'nodemailer';
import { IEmailService, SendMailOptions } from '../../domain/services/IEmailService';
import { env } from '../config/env';

export class NodemailerEmailService implements IEmailService {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: env.SMTP_USER && env.SMTP_PASS ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS
        } : undefined
      });
    }
    return this.transporter;
  }

  public async sendEmail(options: SendMailOptions): Promise<void> {
    const transporter = this.getTransporter();
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text
    });
  }

  public async sendPasswordResetEmail(to: string, resetToken: string, appUrl: string): Promise<void> {
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
    await this.sendEmail({
      to,
      subject: 'Restablecer contrasena — Hypertro',
      text: `Has solicitado restablecer tu contrasena de Hypertro.\n\nHaz clic en el siguiente enlace o pegalo en tu navegador para continuar:\n${resetUrl}\n\nEste enlace expirara en 30 minutos.\nSi no solicitaste este cambio, puedes ignorar este mensaje de forma segura.`,
      html: `
        <div style="font-family: sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px; border-radius: 8px;">
          <h2 style="color: #39FF14;">Hypertro</h2>
          <p>Has solicitado restablecer tu contrase&ntilde;a.</p>
          <p>Haz clic en el bot&oacute;n siguiente para definir una nueva credencial:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #39FF14; color: #000; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 6px; margin: 16px 0;">Restablecer contrase&ntilde;a</a>
          <p style="color: #a1a1aa; font-size: 13px;">El enlace expira en 30 minutos. Si no fuiste t&uacute;, ignora este mensaje.</p>
        </div>
      `
    });
  }

  public async sendStudentWelcomeEmail(to: string, tempPassword: string, squadName: string, appUrl: string): Promise<void> {
    const loginUrl = `${appUrl}/login`;
    await this.sendEmail({
      to,
      subject: `Bienvenido a Hypertro — Te has unido al squad ${squadName}`,
      text: `Tu entrenador te ha registrado en el squad "${squadName}" de Hypertro.\n\nTus credenciales temporales de acceso:\nUsuario: ${to}\nContrasena temporal: ${tempPassword}\n\nInicia sesion en ${loginUrl} y se te pedira cambiar tu contrasena por seguridad en el primer acceso.`,
      html: `
        <div style="font-family: sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px; border-radius: 8px;">
          <h2 style="color: #39FF14;">Bienvenido a Hypertro</h2>
          <p>Tu entrenador te ha registrado en el squad <strong>${squadName}</strong>.</p>
          <div style="background-color: #18181b; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Usuario:</strong> ${to}</p>
            <p style="margin: 4px 0;"><strong>Contrase&ntilde;a temporal:</strong> <code style="color: #39FF14; font-size: 16px;">${tempPassword}</code></p>
          </div>
          <p>Debes cambiar tu contrase&ntilde;a inmediatamente tras iniciar sesi&oacute;n.</p>
          <a href="${loginUrl}" style="display: inline-block; background-color: #39FF14; color: #000; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 6px;">Iniciar Sesi&oacute;n</a>
        </div>
      `
    });
  }
}
