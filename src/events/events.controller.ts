import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../common/decorators';
import { httpExceptionExamples } from '../common/exceptions';
import { EventsService } from './events.service';
import { CreateEventPayload, CreateEventResponse, toCreateEventResponse } from './dto';
import { eventExceptionExamples } from './exceptions';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an event',
    description: 'An **Event** has a type and referres to a **Device** and **Node**.',
  })
  @ApiExceptionResponse({
    status: 400,
    example: httpExceptionExamples.ValidationException.value,
  })
  @ApiExceptionResponse({
    status: 409,
    examples: {
      WrongTypeException: eventExceptionExamples.WrongTypeException,
      EntranceExitException: eventExceptionExamples.EntranceExitException,
    },
  })
  @ApiExceptionResponse({
    status: 422,
    example: eventExceptionExamples.ConstraintsViolation.value,
  })
  async createEvent(@Body() payload: CreateEventPayload): Promise<CreateEventResponse> {
    return toCreateEventResponse(await this.eventsService.create(payload));
  }
}
