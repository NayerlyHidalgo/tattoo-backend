import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Tattoo Shop Backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3001,
    };
  }

  @Get('api/info')
  getApiInfo() {
    return {
      name: 'Tattoo Shop API',
      version: '1.0.0',
      description: 'Backend API para tienda de tatuajes',
      endpoints: {
        auth: '/auth',
        products: '/products',
        categories: '/categories',
        cart: '/cart',
        orders: '/ordenes',
        invoices: '/invoices',
        users: '/users',
        reviews: '/review',
      },
      docs: 'Consulta SYNC_GUIDE.md para más información',
    };
  }
}
