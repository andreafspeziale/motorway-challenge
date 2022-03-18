import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Event } from './entities';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsExceptionInterceptor } from './interceptors';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [
    EventsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: EventsExceptionInterceptor,
    },
  ],
  controllers: [EventsController],
})
export class EventsModule {}
