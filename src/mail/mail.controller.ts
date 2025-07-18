import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { FilterEmailsDto } from './dto/filter-emails.dto';
import { BulkEmailDto } from './dto/bulk-email.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiResponse } from '../types/api-response.interface';

@Controller('mail')
@UseGuards(JwtAuthGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async sendEmail(@Body() dto: SendMailDto): Promise<ApiResponse<any>> {
    try {
      const result = await this.mailService.sendMail(dto);
      return {
        success: true,
        message: 'Email sent successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send email',
        error: error.message,
      };
    }
  }

  @Get('emails')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllEmails(@Query() filterDto: FilterEmailsDto): Promise<ApiResponse<any>> {
    try {
      const result = await this.mailService.findAll(filterDto);
      return {
        success: true,
        message: 'Emails retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve emails',
        error: error.message,
      };
    }
  }

  @Get('emails/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getEmail(@Param('id') id: string): Promise<ApiResponse<any>> {
    try {
      const email = await this.mailService.findOne(id);
      return {
        success: true,
        message: 'Email retrieved successfully',
        data: email,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve email',
        error: error.message,
      };
    }
  }

  @Post('emails/:id/resend')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async resendEmail(@Param('id') id: string): Promise<ApiResponse<any>> {
    try {
      const result = await this.mailService.resendEmail(id);
      return {
        success: true,
        message: 'Email resent successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to resend email',
        error: error.message,
      };
    }
  }

  @Delete('emails/bulk')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async bulkDeleteEmails(@Body() bulkEmailDto: BulkEmailDto): Promise<ApiResponse<any>> {
    try {
      const result = await this.mailService.bulkDelete(bulkEmailDto);
      return {
        success: true,
        message: `${result.deletedCount} emails deleted successfully`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete emails',
        error: error.message,
      };
    }
  }

  @Delete('emails/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEmail(@Param('id') id: string): Promise<void> {
    await this.mailService.remove(id);
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getStatistics(): Promise<ApiResponse<any>> {
    try {
      const stats = await this.mailService.getStatistics();
      return {
        success: true,
        message: 'Email statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve email statistics',
        error: error.message,
      };
    }
  }

  @Post('bulk-send')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async sendBulkEmails(
    @Body() bulkData: {
      emails: string[];
      subject: string;
      templateId: string;
      templateData: Record<string, any>;
    }
  ): Promise<ApiResponse<any>> {
    try {
      const result = await this.mailService.sendBulkEmails(
        bulkData.emails,
        bulkData.subject,
        bulkData.templateId,
        bulkData.templateData
      );
      return {
        success: true,
        message: `Bulk email operation completed: ${result.sent} sent, ${result.failed} failed`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send bulk emails',
        error: error.message,
      };
    }
  }

  @Delete('cleanup/:days')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async cleanupOldEmails(@Param('days') days: string): Promise<ApiResponse<any>> {
    try {
      const daysOld = parseInt(days, 10);
      if (isNaN(daysOld) || daysOld < 1) {
        return {
          success: false,
          message: 'Invalid number of days provided',
        };
      }

      const result = await this.mailService.cleanupOldEmails(daysOld);
      return {
        success: true,
        message: `${result.deletedCount} old emails deleted successfully`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to cleanup old emails',
        error: error.message,
      };
    }
  }

  @Get('public-api/users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUsersFromPublicApi(): Promise<ApiResponse<any>> {
    try {
      const result = await this.mailService.fetchUserListFromPublicApi();
      return {
        success: true,
        message: 'Users retrieved from external API successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch users from external API',
        error: error.message,
      };
    }
  }

  // Endpoint legacy para mantener compatibilidad
  @Post('gmail')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async sendGmail(@Body() dto: SendMailDto) {
    const result = await this.mailService.sendMail(dto);
    return new SuccessResponseDto('Correo enviado con Gmail', result);
  }

  // Endpoint legacy para mantener compatibilidad
  @Get('public-api')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUsersFromPublicApiLegacy() {
    const result = await this.mailService.fetchUserListFromPublicApi();
    return new SuccessResponseDto('Usuarios obtenidos', result);
  }
}
