import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, body, query, params, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || request.connection.remoteAddress;

    const now = Date.now();

    // Log de entrada
    this.logger.log({
      message: 'Incoming Request',
      method,
      url,
      body: this.sanitizeBody(body),
      query,
      params,
      userAgent,
      ip,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - now;
        
        // Log de salida exitosa
        this.logger.log({
          message: 'Outgoing Response',
          method,
          url,
          statusCode: response.statusCode,
          responseTime: `${responseTime}ms`,
          dataSize: JSON.stringify(data).length,
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        
        // Log de error
        this.logger.error({
          message: 'Request Error',
          method,
          url,
          error: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
        });

        return throwError(() => error);
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sensitiveFields = ['password', 'token', 'authorization', 'secret'];
    const sanitized = { ...body };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }
}
