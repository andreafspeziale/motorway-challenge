import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { Event } from '../events/entities';
import { GraphService } from '../graph/graph.service';
import { BillPayload } from './bills.interfaces';
import { throwBillIncompletedTravels } from './exceptions';

@Injectable()
export class BillsService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly graphService: GraphService
  ) {
    this.logger.setContext(BillsService.name);
  }

  async computeBill(data: BillPayload): Promise<number> {
    this.logger.debug('Computing bill...', {
      fn: this.computeBill.name,
      data,
    });

    const entrances = await this.eventRepository.find({
      where: {
        device: { user: data.user },
        type: 'entrance',
        createdAt: Between(data.period.from, data.period.to),
      },
      relations: ['device'],
    });

    const exits = await this.eventRepository.find({
      where: {
        device: { user: data.user },
        type: 'exit',
        createdAt: Between(data.period.from, data.period.to),
      },
      relations: ['device'],
    });

    this.logger.debug('Travels', {
      fn: this.computeBill.name,
      entrances,
      exits,
    });

    if (entrances.length !== exits.length) {
      this.logger.error('Error while computing a bill', {
        fn: this.computeBill.name,
        data,
      });

      throwBillIncompletedTravels();
    }

    const travelsKms = entrances.reduce((acc, event, index) => {
      const shortestPath = this.graphService.computeShortestPath({
        from: event.node.id,
        to: exits[index].node.id,
      });

      const shortestPathWeight = this.graphService.computePathWeight(shortestPath);

      acc += shortestPathWeight;

      return acc;
    }, 0);

    this.logger.debug('Total Kms', {
      fn: this.computeBill.name,
      data,
      travelsKms,
    });

    return travelsKms * data.costKm;
  }
}
