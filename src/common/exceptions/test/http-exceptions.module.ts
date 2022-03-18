import { Module, Injectable, Controller, Get } from '@nestjs/common';

@Injectable()
export class HttpExceptionsService {
  async getException(): Promise<string> {
    return 'Hello exceptions world!';
  }
}

@Controller('exceptions')
export class HttpExceptionsController {
  constructor(private readonly httpExceptionsService: HttpExceptionsService) {}

  @Get()
  getException(): Promise<string> {
    return this.httpExceptionsService.getException();
  }
}

@Module({
  controllers: [HttpExceptionsController],
  providers: [HttpExceptionsService],
})
export class HttpExceptionsModule {}
