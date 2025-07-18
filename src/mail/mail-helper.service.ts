import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailHelperService {
  constructor(private readonly mailService: MailService) {}

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const mailDto: SendMailDto = {
      to: userEmail,
      subject: '¡Bienvenido a nuestra plataforma!',
      text: `Hola ${userName}, gracias por registrarte en nuestra plataforma.`,
      html: `
        <h1>¡Bienvenido ${userName}!</h1>
        <p>Gracias por registrarte en nuestra plataforma.</p>
        <p>Esperamos que disfrutes de nuestros servicios.</p>
        <br>
        <p>Saludos,<br>El equipo</p>
      `,
      templateId: 'welcome',
      templateData: { name: userName, email: userEmail }
    };

    await this.mailService.sendMail(mailDto);
  }

  async sendOrderConfirmationEmail(
    userEmail: string,
    userName: string,
    orderNumber: string,
    orderTotal: number
  ): Promise<void> {
    const mailDto: SendMailDto = {
      to: userEmail,
      subject: `Confirmación de Orden #${orderNumber}`,
      text: `Hola ${userName}, tu orden #${orderNumber} ha sido confirmada por un total de $${orderTotal.toFixed(2)}.`,
      html: `
        <h1>Confirmación de Orden</h1>
        <p>Hola ${userName},</p>
        <p>Tu orden <strong>#${orderNumber}</strong> ha sido confirmada.</p>
        <p>Total: <strong>$${orderTotal.toFixed(2)}</strong></p>
        <p>Te notificaremos cuando tu orden sea enviada.</p>
        <br>
        <p>Saludos,<br>El equipo</p>
      `,
      templateId: 'order-confirmation',
      templateData: { name: userName, orderNumber, total: orderTotal }
    };

    await this.mailService.sendMail(mailDto);
  }

  async sendPaymentSuccessEmail(
    userEmail: string,
    userName: string,
    orderNumber: string,
    amount: number,
    paymentMethod: string
  ): Promise<void> {
    const mailDto: SendMailDto = {
      to: userEmail,
      subject: `Pago Procesado - Orden #${orderNumber}`,
      text: `Hola ${userName}, tu pago de $${amount.toFixed(2)} para la orden #${orderNumber} ha sido procesado exitosamente.`,
      html: `
        <h1>Pago Procesado Exitosamente</h1>
        <p>Hola ${userName},</p>
        <p>Tu pago de <strong>$${amount.toFixed(2)}</strong> para la orden <strong>#${orderNumber}</strong> ha sido procesado exitosamente.</p>
        <p>Método de pago: ${paymentMethod}</p>
        <p>Tu orden está siendo procesada.</p>
        <br>
        <p>Saludos,<br>El equipo</p>
      `,
      templateId: 'payment-success',
      templateData: { name: userName, orderNumber, amount, paymentMethod }
    };

    await this.mailService.sendMail(mailDto);
  }

  async sendPaymentFailedEmail(
    userEmail: string,
    userName: string,
    orderNumber: string,
    amount: number,
    errorReason?: string
  ): Promise<void> {
    const mailDto: SendMailDto = {
      to: userEmail,
      subject: `Error en Pago - Orden #${orderNumber}`,
      text: `Hola ${userName}, hubo un problema procesando tu pago de $${amount.toFixed(2)} para la orden #${orderNumber}.`,
      html: `
        <h1>Error en el Procesamiento del Pago</h1>
        <p>Hola ${userName},</p>
        <p>Hubo un problema procesando tu pago de <strong>$${amount.toFixed(2)}</strong> para la orden <strong>#${orderNumber}</strong>.</p>
        ${errorReason ? `<p>Razón: ${errorReason}</p>` : ''}
        <p>Por favor, intenta nuevamente o contacta con soporte.</p>
        <br>
        <p>Saludos,<br>El equipo</p>
      `,
      templateId: 'payment-failed',
      templateData: { name: userName, orderNumber, amount, errorReason }
    };

    await this.mailService.sendMail(mailDto);
  }

  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailDto: SendMailDto = {
      to: userEmail,
      subject: 'Restablecimiento de Contraseña',
      text: `Hola ${userName}, has solicitado restablecer tu contraseña. Usa este enlace: ${resetUrl}`,
      html: `
        <h1>Restablecimiento de Contraseña</h1>
        <p>Hola ${userName},</p>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Restablecer Contraseña
        </a>
        <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
        <p><small>Este enlace expira en 1 hora.</small></p>
        <br>
        <p>Saludos,<br>El equipo</p>
      `,
      templateId: 'password-reset',
      templateData: { name: userName, resetUrl, resetToken }
    };

    await this.mailService.sendMail(mailDto);
  }

  async sendNewsletterEmail(
    userEmail: string,
    userName: string,
    subject: string,
    content: string
  ): Promise<void> {
    const mailDto: SendMailDto = {
      to: userEmail,
      subject,
      text: `Hola ${userName}, ${content}`,
      html: `
        <h1>${subject}</h1>
        <p>Hola ${userName},</p>
        <div>${content}</div>
        <br>
        <p>Saludos,<br>El equipo</p>
        <hr>
        <p><small>Si no deseas recibir más emails, <a href="${process.env.FRONTEND_URL}/unsubscribe">cancelar suscripción</a></small></p>
      `,
      templateId: 'newsletter',
      templateData: { name: userName, content, subject }
    };

    await this.mailService.sendMail(mailDto);
  }

  async sendContactFormEmail(
    name: string,
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    
    const mailDto: SendMailDto = {
      to: adminEmail,
      subject: `Contacto: ${subject}`,
      text: `Nuevo mensaje de contacto de ${name} (${email}): ${message}`,
      html: `
        <h1>Nuevo Mensaje de Contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <div style="border-left: 4px solid #007bff; padding-left: 10px; margin: 10px 0;">
          ${message}
        </div>
      `,
      templateId: 'contact-form',
      templateData: { name, email, subject, message }
    };

    await this.mailService.sendMail(mailDto);
  }
}
