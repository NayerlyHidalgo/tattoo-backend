// Exportar servicios principales
export { MailService } from './mail.service';
export { MailHelperService } from './mail-helper.service';

// Exportar entidad y tipos
export { 
  Email,
  EmailStatus,
  EmailProvider 
} from './email.entity';

// Exportar DTOs
export { SendMailDto } from './dto/send-mail.dto';
export { FilterEmailsDto, EmailStatus as FilterEmailStatus, EmailProvider as FilterEmailProvider } from './dto/filter-emails.dto';
export { BulkEmailDto, ResendEmailDto } from './dto/bulk-email.dto';

// Exportar módulo
export { MailModule } from './mail.module';
