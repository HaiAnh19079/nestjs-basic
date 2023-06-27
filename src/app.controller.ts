import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Render('home')
  root() {
    console.log('Check port : ', this.configService.get<string>('PORT'));
    return this.appService.getHello();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
