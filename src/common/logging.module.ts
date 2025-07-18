import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'LOGGER',
      useFactory: () => {
        const logger = new Logger('Application');
        logger.log('Logging module initialized');
        return logger;
      },
    },
  ],
  exports: ['LOGGER'],
})
export class LoggingModule {}
