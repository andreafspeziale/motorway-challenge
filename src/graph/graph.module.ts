import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from '../nodes/entities';
import { Edge } from '../edges/entities';
import { GraphService } from './graph.service';

@Module({
  imports: [TypeOrmModule.forFeature([Node]), TypeOrmModule.forFeature([Edge])],
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
