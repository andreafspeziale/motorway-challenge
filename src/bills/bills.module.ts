import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphModule } from '../graph/graph.module';
import { Event } from '../events/entities';
import { BillsService } from './bills.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), GraphModule],
  providers: [BillsService],
})
export class BillsModule {}
