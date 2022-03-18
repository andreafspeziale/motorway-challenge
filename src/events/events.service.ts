import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { CreateEventPayload } from './dto';
import { Event } from './entities';
import { EventType } from './events.interfaces';
import {
  throwEventWrongTypeException,
  throwEventEntranceExitException,
  throwEventConstraintsViolationException,
} from './exceptions';

@Injectable()
export class EventsService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {
    this.logger.setContext(EventsService.name);
  }

  async create(data: CreateEventPayload): Promise<Event> {
    this.logger.debug('Creating event...', {
      fn: this.create.name,
      data,
    });

    const [latestEvent] = await this.eventRepository.find({
      where: { device: { id: data.device.id } },
      order: { createdAt: 'DESC' },
    });

    if (data.type === latestEvent?.type) {
      this.logger.debug('Error', {
        fn: this.create.name,
        currentType: data.type,
        latestType: latestEvent?.type,
      });

      throwEventWrongTypeException();
    }

    if (data.type === EventType.Exit && data.node.id === latestEvent?.node.id) {
      this.logger.debug('Error', {
        fn: this.create.name,
        currentNodeId: data.node.id,
        latestNodeId: latestEvent?.node.id,
      });

      throwEventEntranceExitException();
    }

    const event = await this.eventRepository
      .save({
        type: data.type,
        device: { id: data.device.id },
        node: { id: data.node.id },
      })
      .catch(() => throwEventConstraintsViolationException());

    this.logger.debug('Created event', {
      fn: this.create.name,
      event,
    });

    return event;
  }
}
